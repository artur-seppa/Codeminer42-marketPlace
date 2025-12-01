import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Store from './store.js'
import Price from './price.js'
import Option from './option.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare quantity: number

  @column()
  declare category: string

  @column({ serializeAs: 'is_visible' })
  declare is_visible: boolean

  @column({ serializeAs: 'store_id' })
  declare store_id: number

  @belongsTo(() => Store, {
    foreignKey: 'store_id',
    serializeAs: 'store'
  })
  declare store: BelongsTo<typeof Store>

  @hasMany(() => Price, {
    foreignKey: 'product_id',
    serializeAs: 'prices'
  })
  declare prices: HasMany<typeof Price>

  @hasMany(() => Option, {
    foreignKey: 'product_id',
    serializeAs: 'options'
  })
  declare options: HasMany<typeof Option>
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}