'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.string('group', 50).notNullable()
      table.integer('order_number').unsigned().notNullable().defaultTo(0)
      table.string('description', 255)
      table.integer('id_parent').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemSchema
