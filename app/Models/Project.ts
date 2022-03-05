import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  HasMany,
  hasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Collection from './Collection'
import User from './User'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public createdByUserId: number

  @belongsTo(() => User, {
    foreignKey: 'createdByUserId',
  })
  public createdByUser: BelongsTo<typeof User>

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @hasMany(() => Collection)
  public collections: HasMany<typeof Collection>
}
