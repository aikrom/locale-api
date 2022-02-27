import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import ProjectQuery from 'App/Queries/ProjectQuery'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import ProjectCreateValidator from 'App/Validators/ProjectCreateValidator'
import ProjectUpdateValidator from 'App/Validators/ProjectUpdateValidator'

export default class ProjectsController {
  public async find({ auth, request }: HttpContextContract) {
    const query = auth.user!.related('projects').query()
    const pagination = PaginationUtil.fromInput(request.input)

    const filter = {
      name: {
        value: request.input('name'),
        query: (value: string) => ['LIKE', `%${value}%`],
      },
    }

    Object.entries(filter)
      .filter(([, schema]) => !!schema.value)
      .forEach(([key, schema], idx) => {
        const schemaQuery = schema.query(schema.value)
        if (idx === 0) {
          query.where(key, schemaQuery[0], schemaQuery[1])
        } else {
          query.andWhere(key, schemaQuery[0], schemaQuery[1])
        }
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
    await project.related('users').attach([auth.user!.id])
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
