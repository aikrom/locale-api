import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import ProjectQuery from 'App/Queries/ProjectQuery'
import FilterUtil from 'App/Shared/Utils/FilterUtil'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import ProjectCreateValidator from 'App/Validators/ProjectCreateValidator'
import ProjectUpdateValidator from 'App/Validators/ProjectUpdateValidator'

export default class ProjectsController {
  /**
   * Filter projects
   *
   * @param ctx - Http context
   */
  public async find({ auth, request }: HttpContextContract) {
    /**
     * Get pagination parameters from a request
     */
    const pagination = PaginationUtil.fromInput(request)

    /**
     * Build a query with filters
     */
    const query = FilterUtil.where(auth.user!.related('projects').query<Project>(), {
      name: {
        value: request.input('name'),
        builder: (value) => ['LIKE', `%${value}%`],
      },
    })

    return await query.paginate(...pagination)
  }
  /**
   * Find project by ID
   *
   * @param ctx - Http context
   */
  public async findById({ bouncer, request }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Verify that an authorized user can read project information
     */
    await bouncer.with('ProjectPolicy').authorize('view', project)

    return project
  }

  /**
   * Create project
   *
   * @param ctx - Http context
   */
  public async create({ auth, request }: HttpContextContract) {
    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(ProjectCreateValidator)

    /**
     * Create project and relationships
     */
    const project = await Project.create(payload)
    await project.related('createdByUser').associate(auth.user!)
    await project.related('users').attach([auth.user!.id])

    return project
  }

  /**
   * Update project
   *
   * @param ctx - Http context
   */
  public async update({ request, bouncer }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Verify that an authorized user can update project
     */
    await bouncer.with('ProjectPolicy').authorize('update', project)

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(ProjectUpdateValidator)

    /**
     * Merge updates and save
     */
    return project.merge(payload).save()
  }

  /**
   * Delete project
   *
   * @param ctx - Http context
   */
  public async delete({ bouncer, request }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Verify that an authorized user can delete project
     */
    await bouncer.with('ProjectPolicy').authorize('delete', project)

    /**
     * Delete project
     */
    return await project.delete()
  }
}
