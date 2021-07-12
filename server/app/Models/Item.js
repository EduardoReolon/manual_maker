'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Item extends Model {
  content() {
    return this.hasMany('App/Models/Content')
  }
}

module.exports = Item
