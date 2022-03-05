import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Key from './Key'

export default class KeyValue extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public value: string

  @column()
  public language: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public keyId: number

  @belongsTo(() => Key)
  public key: BelongsTo<typeof Key>
}
