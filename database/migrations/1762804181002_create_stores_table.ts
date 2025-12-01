import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stores'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable().unique()
      table.string('category').notNullable()

      table
        .integer('owner_id')
        .references('id')
        .inTable('accounts')
        .notNullable()

      table
        .integer('address_id')
        .references('id')
        .inTable('addresses')
        .notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}