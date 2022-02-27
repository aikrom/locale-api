import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Collection from './Collection'

export default class Key extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: string

  @column()
  public value: string

  @column()
  public language: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public collectionId: number

  @belongsTo(() => Collection)
  public collection: BelongsTo<typeof Collection>
}
