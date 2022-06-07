'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Items = use('App/Models/Item')
const ItemsTransformer = use('App/Transformers/ItemTransformer')
const Database = use('Database')
const ListGroup = use('App/Models/ListGroup')
const ListGroupTransformer = use('App/Transformers/ListGroupTransformer')
const PermissionService = use('App/Services/Permission')

/**
 * Resourceful controller for interacting with items
 */
class ItemController {
  /**
   * Show a list of all items.
   * GET items
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, transform }) {
    try {
      var listGroups = await ListGroup.all();
      listGroups = await transform.collection(listGroups, ListGroupTransformer);
      return response.status(201).send(listGroups);
    } catch (error) {
      console.error(error)
      return response.status(400).send('Error')
    }
  }

  /**
   * Create/save a new item.
   * POST items
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    let {listToSave} = request.all()
    const user = await auth.getUser();
    const trx = await Database.beginTransaction();

    try {
      if (typeof listToSave === 'string') listToSave = JSON.parse(listToSave);

      // conferir permissao do grupo
      const groupCheckUser = await new PermissionService().groupCheckUser(user.id, listToSave[0].group);
      if (groupCheckUser.status === 400)
        return response.status(400).send({msg: groupCheckUser.msg})

      const items = await Items.all();
      const newIdsList = [];
      async function loopItems(list, id_parent = null, callback) {
        for (const [key, item] of Object.entries(list)) {
          let itemBD = items.rows.find((i) => i.id === item.id);
          let idPivot = item.id < 0 ? item.id : 0;
          if (!itemBD) itemBD = new Items();
          if (itemBD.id_parent !== id_parent || itemBD.description !== item.description
            || itemBD.order_number !== item.order_number || itemBD.external !== item.external) {
            itemBD.id_parent = id_parent;
            itemBD.group = item.group;
            itemBD.order_number = item.order_number;
            itemBD.description = item.description;
            itemBD.external = item.external;
            await itemBD.save(trx)
            if (idPivot) newIdsList.push({pivot: idPivot, id: itemBD.id});
          }
          await callback(item.children, itemBD.id, callback);
        }
      }
      await loopItems(listToSave, null, loopItems);
      
      await trx.commit()

      return response.status(200).send(newIdsList)
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(400).send('Error')
    }
  }

  /**
   * Display a single item.
   * GET items/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: {group}, request, response, transform }) {
    group = group.replace(/\%20/g, ' ')
    try {
      let items = await Items.query()
        .where('group', group)
        .orderBy('order_number')
        .fetch()
      items = await transform.collection(items, ItemsTransformer)

      return response.status(201).send(items);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Update item details.
   * PUT or PATCH items/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a item with id.
   * DELETE items/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ItemController
