import { DateTime } from 'luxon'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import Address from './address.js'
import Account from './account.js'

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

  @column()
  declare address_id: number

  @hasOne(() => Address, {
    foreignKey: 'store_id',
    serializeAs: 'address'
  })
  declare address: HasOne<typeof Address>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}