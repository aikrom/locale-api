import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistsException from 'App/Exceptions/AlreadyExistException'
import Key from 'App/Models/Key'
import CollectionQuery from 'App/Queries/CollectionQuery'
import KeyQuery from 'App/Queries/KeyQuery'
import ProjectQuery from 'App/Queries/ProjectQuery'
import FilterUtil from 'App/Shared/Utils/FilterUtil'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import KeyCreateValidator from 'App/Validators/KeyCreateValidator'
import KeyUpdateValidator from 'App/Validators/KeyUpdateValidator'

export default class CollectionsController {
  /**
   * Filter keys
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
     * Get collection ID from query params and try to fetch
     */
    const collectionId: number = request.param('collection_id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Verify that an authorized user can read project and collection information
     */
    await bouncer.with('CollectionPolicy').authorize('view', project, collection)

    /**
     * Get pagination parameters from a request
     */
    const pagination = PaginationUtil.fromInput(request)

    /**
     * Build a query with filters
     */
    const query = FilterUtil.where(collection.related('keys').query<Key>(), {
      key: {
        value: request.input('key'),
        builder: (value) => ['LIKE', `%${value}%`],
      },
    })

    return await query.paginate(...pagination)
  }

  /**
   * Find key by ID
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
    const collectionId: number = request.param('collection_id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Get key ID from query params and try to fetch
     */
    const keyId: number = request.param('id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Verify that an authorized user can read project, collection and key information
     */
    await bouncer.with('KeyPolicy').authorize('view', project, collection, key)

    return key
  }

  /**
   * Create key
   *
   * @param ctx - Http context
   */
  public async create({ request, bouncer }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Get project ID from query params and try to fetch
     */
    const collectionId: number = request.param('collection_id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Verify that an authorized user can create new key within the project
     */
    await bouncer.with('KeyPolicy').authorize('create', project)

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(KeyCreateValidator)

    /**
     * Try to find the key with the provided `key` to
     * verify the key `key` is unique within the collection
     */
    const isKeyExists = await KeyQuery.findByKey(payload.key)

    if (isKeyExists && isKeyExists.collectionId === collection.id) {
      throw new AlreadyExistsException('Key already exists')
    }

    /**
     * Create key and relationships
     */
    const key = await Key.create(payload)
    await key.related('collection').associate(collection)

    return key
  }

  /**
   * Update key
   *
   * @param ctx - Http context
   */
  public async update({ request, bouncer }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Get project ID from query params and try to fetch
     */
    const collectionId: number = request.param('collection_id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Get project ID from query params and try to fetch
     */
    const keyId: number = request.param('id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Verify that an authorized user can update key
     */
    await bouncer.with('KeyPolicy').authorize('update', project, collection, key)

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(KeyUpdateValidator)

    /**
     * If the provided data has an update `key`, try to find the key with the provided `key`
     * to ensure that the key `key` is unique within the collection
     */
    if (payload.key) {
      const isKeyExists = await KeyQuery.findByKey(payload.key)

      if (isKeyExists && isKeyExists.collectionId === collection.id) {
        throw new AlreadyExistsException('Key already exists')
      }
    }

    /**
     * Merge updates and save
     */
    return key.merge(payload).save()
  }

  /**
   * Delete key
   *
   * @param ctx - Http context
   */
  public async delete({ bouncer, request }: HttpContextContract) {
    /**
     * Get project ID from query params and try to fetch
     */
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)

    /**
     * Get project ID from query params and try to fetch
     */
    const collectionId: number = request.param('collection_id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Get project ID from query params and try to fetch
     */
    const keyId: number = request.param('id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Verify that an authorized user can delete key
     */
    await bouncer.with('KeyPolicy').authorize('delete', project, collection, key)

    /**
     * Delete key
     */
    return await key.delete()
  }
}
