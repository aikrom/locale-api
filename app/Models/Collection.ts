import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Key from './Key'
import Project from './Project'
import User from './User'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public description: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column()
  public createdByUserId: number

  @belongsTo(() => User, {
    foreignKey: 'createdByUserId',
  })
  public createdByUser: BelongsTo<typeof User>

  @hasMany(() => Key)
  public keys: HasMany<typeof Key>
}
