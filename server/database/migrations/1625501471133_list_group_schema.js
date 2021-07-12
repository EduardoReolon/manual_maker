'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListGroupSchema extends Schema {
  up () {
    this.create('list_groups', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('users', 255).defaultTo('')
    })
  }

  down () {
    this.drop('list_groups')
  }
}

module.exports = ListGroupSchema
