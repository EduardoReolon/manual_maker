'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Content extends Model {
  item() {
    return this.belongsTo('App/Models/Item')
  }
}

module.exports = Content
