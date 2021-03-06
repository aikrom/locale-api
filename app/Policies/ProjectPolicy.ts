import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class ProjectPolicy extends BasePolicy {
  public async view(user: User, project: Project) {
    const isUserAttached = await project.related('users').query().where('user_id', user.id).first()
    return !!isUserAttached
  }

  public async update(user: User, project: Project) {
    const isCanView = await this.view(user, project)
    return !!isCanView
  }

  public async delete(user: User, project: Project) {
    return user.id === project.createdByUserId
  }
}
