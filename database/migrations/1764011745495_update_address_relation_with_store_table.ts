import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('store_id')
        .references('id')
        .inTable('stores')
        .onDelete('CASCADE')
        .notNullable()
        .unique()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('store_id')
    })
  }
}