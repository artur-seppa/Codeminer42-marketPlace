import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import OptionValue from './option_value.js'

export default class Option extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ serializeAs: 'product_id' })
  declare product_id: number

  @belongsTo(() => Product, {
    foreignKey: 'product_id',
    serializeAs: 'product'
  })
  declare product: BelongsTo<typeof Product>

  @hasMany(() => OptionValue, {
    foreignKey: 'option_id',
    serializeAs: 'values'
  })
  declare optionValues: HasMany<typeof OptionValue>
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}