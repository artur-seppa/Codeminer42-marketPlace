import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'option_values'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('value').notNullable()

      table
        .integer('option_id')
        .references('id')
        .inTable('options')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}