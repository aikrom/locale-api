import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import ProjectQuery from 'App/Queries/ProjectQuery'
import FilterUtil from 'App/Shared/Utils/FilterUtil'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import ProjectCreateValidator from 'App/Validators/ProjectCreateValidator'
import ProjectUpdateValidator from 'App/Validators/ProjectUpdateValidator'

export default class ProjectsController {
  public async find({ auth, request }: HttpContextContract) {
    const pagination = PaginationUtil.fromInput(request)

    const query = FilterUtil.where(auth.user!.related('projects').query<Project>(), {
      name: {
        value: request.input('name'),
        builder: (value) => ['LIKE', `%${value}%`],
      },
    })

    return await query.paginate(...pagination)
  }

  public async findById({ bouncer, request }: HttpContextContract) {
    const projectId: number = request.param('id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    await bouncer.with('ProjectPolicy').authorize('view', project)
    return project
  }

  public async create({ auth, request }: HttpContextContract) {
    const payload = await request.validate(ProjectCreateValidator)
    const project = await Project.create(payload)
    await project.related('createdByUser').associate(auth.user!)
    await auth.user!.related('projects').attach([project.id])
    return project
  }

  public async update({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    await bouncer.with('ProjectPolicy').authorize('update', project)
    const payload = await request.validate(ProjectUpdateValidator)
    return project.merge(payload).save()
  }

  public async delete({ bouncer, request }: HttpContextContract) {
    const projectId: number = request.param('id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    await bouncer.with('ProjectPolicy').authorize('delete', project)
    return await project.delete()
  }
}
