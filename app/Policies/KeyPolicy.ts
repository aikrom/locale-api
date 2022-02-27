import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Collection from 'App/Models/Collection'
import Key from 'App/Models/Key'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class KeyPolicy extends BasePolicy {
  public async view(user: User, project: Project, collection: Collection, key: Key) {
    const isProjectAttachedToUser = await project.related('users').query().where('id', user.id)
    return (
      !!isProjectAttachedToUser &&
      project.id === collection.projectId &&
      key.collectionId === collection.id
    )
  }

  public async create(user: User, project: Project) {
    const isProjectAttachedToUser = await project.related('users').query().where('id', user.id)
    return !!isProjectAttachedToUser
  }

  public async update(user: User, project: Project, collection: Collection, key: Key) {
    const isCanView = await this.view(user, project, collection, key)
    return isCanView
  }

  public async delete(user: User, project: Project, collection: Collection, key: Key) {
    const isCanView = await this.view(user, project, collection, key)
    return isCanView
  }
}
