import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Option from './option.js'

export default class OptionValue extends BaseModel {
  public static table = 'option_values'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare value: string

  @column({ serializeAs: 'option_id' })
  declare option_id: number

  @belongsTo(() => Option, {
    foreignKey: 'option_id',
    serializeAs: 'option'
  })
  declare option: BelongsTo<typeof Option>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}