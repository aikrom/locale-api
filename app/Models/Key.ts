import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Collection from './Collection'
import KeyValue from './KeyValue'

export default class Key extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public collectionId: number

  @belongsTo(() => Collection)
  public collection: BelongsTo<typeof Collection>

  @hasMany(() => KeyValue)
  public values: HasMany<typeof KeyValue>
}
