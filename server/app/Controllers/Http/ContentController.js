'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Content = use('App/Models/Content')
const Database = use('Database')
const ContentTransformer = use('App/transformers/ContentTransformer')
const Item = use('App/Models/Item')
const PermissionService = use('App/Services/Permission')

/**
 * Resourceful controller for interacting with contents
 */
class ContentController {
  /**
   * Show a list of all contents.
   * GET contents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Create/save a new content.
   * POST contents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single content.
   * GET contents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: {id}, request, response, transform }) {
    try {
      id = parseInt(id);
      if (isNaN(id) || id < 0) return response.status(201).send([])

      let content = await Content.query()
        .where('item_id', id)
        .orderBy('created_at')
        .fetch()
      
      content = await transform.collection(content, ContentTransformer)

      return response.status(201).send(content)
    } catch (error) {
      console.log(error)
      return response.status(400).send({msg: 'error'})
    }
  }

  /**
   * Update content details.
   * PUT or PATCH contents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: {id}, request, auth, response }) {
    let {content, item_id, publicValue} = request.all();
    const user = await auth.getUser();

    const trx = await Database.beginTransaction()

    try {
      id = parseInt(id);
      publicValue = publicValue === 'true' ? true : false;

      const item = await Item.findOrFail(item_id);

      // conferir permissao do grupo
      const groupCheckUser = await new PermissionService().groupCheckUser(user.id, item.group);
      if (groupCheckUser.status === 400)
        return response.status(400).send({msg: groupCheckUser.msg})

      let contentBD

      if (id > -1) contentBD = await Content.findOrFail(id);
      else {
        if (item_id < 0)
          return response.status(400).send({msg: 'wrong item id'});
        contentBD = new Content();
        contentBD.item_id = item_id
      }

      contentBD.content = content;
      contentBD.public = publicValue;

      await contentBD.save(trx);
      
      await trx.commit();

      return response.status(200).send({pivot: id, id: contentBD.id, public: publicValue})
    } catch (error) {
      await trx.rollback()
      console.log(error)
      return response.status(400).send({msg: 'error'})
    }
  }

  /**
   * Delete a content with id.
   * DELETE contents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ContentController
