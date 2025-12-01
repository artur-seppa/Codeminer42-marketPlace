import { DateTime } from 'luxon'
import type { BelongsTo, HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import Address from './address.js'
import Account from './account.js'
import Product from './product.js'

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ serializeAs: 'owner_id' })
  declare owner_id: number

  @belongsTo(() => Account, {
    foreignKey: 'owner_id',
    serializeAs: 'account'
  })
  declare account: BelongsTo<typeof Account>

  @column()
  declare category: string

  @hasOne(() => Address, {
    foreignKey: 'store_id',
    serializeAs: 'address'
  })
  declare address: HasOne<typeof Address>

  @hasMany(() => Product, {
    foreignKey: 'store_id',
    serializeAs: 'products'
  })
  declare products: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}