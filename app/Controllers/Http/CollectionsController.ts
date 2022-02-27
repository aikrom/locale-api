import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistsException from 'App/Exceptions/AlreadyExistException'
import Collection from 'App/Models/Collection'
import CollectionQuery from 'App/Queries/CollectionQuery'
import ProjectQuery from 'App/Queries/ProjectQuery'
import FilterUtil from 'App/Shared/Utils/FilterUtil'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import CollectionCreateValidator from 'App/Validators/CollectionCreateValidator'
import CollectionUpdateValidator from 'App/Validators/CollectionUpdateValidator'

export default class CollectionsController {
  /**
   * Filter user collections
   *
   * @param ctx - Http context
   */
  public async find({ request, bouncer }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Verify that an authorized user can read project information
     */
    await bouncer.with('ProjectPolicy').authorize('view', project)

    /**
     * Get pagination parameters from a request
     */
    const pagination = PaginationUtil.fromInput(request)

    /**
     * Build a query with filters
     */
    const query = FilterUtil.where(project.related('collections').query<Collection>(), {
      name: {
        value: request.input('name'),
        builder: (value) => ['LIKE', `%${value}%`],
      },
      code: {
        value: request.input('code'),
        builder: (value: string) => ['=', value],
      },
    })

    return await query.paginate(...pagination)
  }

  /**
   * Find user collection by id
   *
   * @param ctx - Http context
   */
  public async findById({ bouncer, request }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Get collection ID from query params and try to fetch
     */
    const collectionId: number = request.param('id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Verify than an authorized user can read information about projects and collections
     */
    await bouncer.with('CollectionPolicy').authorize('view', project, collection)

    return collection
  }

  /**
   * Create new collection
   *
   * @param ctx - Http context
   */
  public async create({ auth, bouncer, request }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(CollectionCreateValidator)

    /**
     * Verify that an authorized user can create new collection
     */
    await bouncer.with('CollectionPolicy').authorize('create', project)

    /**
     * Try to find the collection with the provided `code` to
     * verify the collection `code` is unique within the project
     */
    const isCodeExists = await CollectionQuery.findByCode(payload.code)

    if (isCodeExists && isCodeExists.projectId === project.id) {
      throw new AlreadyExistsException('A collection with this code already exists')
    }

    /**
     * Create new collection and relationships
     */
    const collection = await Collection.create(payload)
    await collection.related('createdByUser').associate(auth.user!)
    await collection.related('project').associate(project)

    return collection
  }

  public async update({ request, bouncer }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Get collection ID from query params and try to fetch
     */
    const collectionId: number = request.param('id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Verify that an authorized user can update a collection
     */
    await bouncer.with('CollectionPolicy').authorize('update', project, collection)

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(CollectionUpdateValidator)

    /**
     * If the provided data has an update `code`, try to find the collection with the provided `code`
     * to ensure that the collection `code` is unique within the project
     */
    if (payload.code) {
      const isCodeExists = await CollectionQuery.findByCode(payload.code)

      if (isCodeExists && isCodeExists.projectId === project.id) {
        throw new AlreadyExistsException('A collection with this code already exists')
      }
    }

    /**
     * Merge updates and save
     */
    return collection.merge(payload).save()
  }

  /**
   * Delete collection
   *
   * @param ct - Http context
   */
  public async delete({ bouncer, request }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Get collection ID from query params and try to fetch
     */
    const collectionId: number = request.param('id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Verify that an authorized user can delete a collection
     */
    await bouncer.with('CollectionPolicy').authorize('view', project, collection)

    /**
     * Delete collection
     */
    return await collection.delete()
  }
}
