import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Store from './store.js'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ serializeAs: 'store_id' })
  declare store_id: number

  @belongsTo(() => Store, {
    foreignKey: 'store_id',
    serializeAs: 'store'
  })
  declare store: BelongsTo<typeof Store>

  @column()
  declare street: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column({ serializeAs: 'zip_code' })
  declare zip_code: string

  @column()
  declare complement?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}