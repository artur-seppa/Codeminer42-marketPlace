import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stores'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('address_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('address_id')
        .references('id')
        .inTable('addresses')
        .notNullable()
    })
  }
}