'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContentSchema extends Schema {
  up () {
    this.create('contents', (table) => {
      table.increments()
      table.integer('item_id').unsigned().notNullable()
        table.foreign('item_id').references('id').on('items').onUpdate('CASCADE').onDelete('RESTRICT')
      table.boolean('public').defaultTo(false)
      table.text('content', 'mediumtext')
      table.timestamps()
    })
  }

  down () {
    this.drop('contents')
  }
}

module.exports = ContentSchema
