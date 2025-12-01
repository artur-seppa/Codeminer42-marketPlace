import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Product from './product.js'

export default class Price extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare price: number

  @column()
  declare currency: 'BRL' | 'USD'

  @column({ serializeAs: 'product_id' })
  declare product_id: number

  @belongsTo(() => Product, {
    foreignKey: 'product_id',
    serializeAs: 'product'
  })
  declare product: BelongsTo<typeof Product>
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}