import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistsException from 'App/Exceptions/AlreadyExistException'
import KeyValue from 'App/Models/KeyValue'
import CollectionQuery from 'App/Queries/CollectionQuery'
import KeyQuery from 'App/Queries/KeyQuery'
import KeyValueQuery from 'App/Queries/KeyValueQuery'
import ProjectQuery from 'App/Queries/ProjectQuery'
import FilterUtil from 'App/Shared/Utils/FilterUtil'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import KeyValueCreateValidator from 'App/Validators/KeyValueCreateValidator'
import KeyValueUpdateValidator from 'App/Validators/KeyValueUpdateValidator'

export default class CollectionsController {
  /**
   * Filter key values
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
     * Get key ID from query params and try to fetch
     */
    const keyId: number = request.param('key_id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Verify that an authorized user can read project, collection and key information
     */
    await bouncer.with('KeyPolicy').authorize('view', project, collection, key)

    /**
     * Get pagination parameters from a request
     */
    const pagination = PaginationUtil.fromInput(request)

    /**
     * Build a query with filters
     */
    const query = FilterUtil.where(key.related('values').query<KeyValue>(), {
      value: {
        value: request.input('value'),
        builder: (value) => ['LIKE', `%${value}%`],
      },
      language: {
        value: request.input('language'),
        builder: (value) => ['=', value],
      },
    })

    return await query.paginate(...pagination)
  }

  /**
   * Find key value by ID
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
    const keyId: number = request.param('key_id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Get key value ID from query params and try to fetch
     */
    const keyValueId: number = request.param('id')
    const keyValue = await KeyValueQuery.findByIdOrFail(keyValueId)

    /**
     * Verify that an authorized user can read project, collection, key and value information
     */
    await bouncer.with('KeyValuePolicy').authorize('view', project, collection, key, keyValue)

    return key
  }

  /**
   * Create key value
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
     * Get collection ID from query params and try to fetch
     */
    const collectionId: number = request.param('collection_id')
    await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Get key ID from query params and try to fetch
     */
    const keyId: number = request.param('key_id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Verify that an authorized user can create key value
     */
    await bouncer.with('KeyValuePolicy').authorize('create', project)

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(KeyValueCreateValidator)

    /**
     * Try to find the key value with the provided `key ID` and `language` to
     * verify the key combination of fields is unique within the key
     */
    const isKeyExists = await KeyValueQuery.findByKeyAndLanguage(key.id, payload.language)

    if (isKeyExists) {
      throw new AlreadyExistsException('Key already exists')
    }

    /**
     * Create key value and relationships
     */
    const keyValue = await KeyValue.create(payload)
    await keyValue.related('key').associate(key)

    return keyValue
  }

  /**
   * Update key value
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
     * Get collection ID from query params and try to fetch
     */
    const collectionId: number = request.param('collection_id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Get key ID from query params and try to fetch
     */
    const keyId: number = request.param('key_id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Get key value ID from query params and try to fetch
     */
    const keyValueId: number = request.param('id')
    const keyValue = await KeyValueQuery.findByIdOrFail(keyValueId)

    /**
     * Verify that an authorized user can update key value
     */
    await bouncer.with('KeyValuePolicy').authorize('update', project, collection, key, keyValue)

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(KeyValueUpdateValidator)

    /**
     * If the provided data has an update `language`, try to find the key value
     * with the provided `key ID` and `language` to verify the key combination
     * of fields is unique within the key
     */
    if (payload.language) {
      const isKeyExists = await KeyValueQuery.findByKeyAndLanguage(key.id, payload.language)

      if (isKeyExists) {
        throw new AlreadyExistsException('Key already exists')
      }
    }

    /**
     * Merge updates and save
     */
    return keyValue.merge(payload).save()
  }

  /**
   * Delete key value
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
     * Get collection ID from query params and try to fetch
     */
    const collectionId: number = request.param('collection_id')
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    /**
     * Get key ID from query params and try to fetch
     */
    const keyId: number = request.param('key_id')
    const key = await KeyQuery.findByIdOrFail(keyId)

    /**
     * Get key value ID from query params and try to fetch
     */
    const keyValueId: number = request.param('id')
    const keyValue = await KeyValueQuery.findByIdOrFail(keyValueId)

    /**
     * Verify that an authorized user can delete key value
     */
    await bouncer.with('KeyValuePolicy').authorize('delete', project, collection, key, keyValue)

    /**
     * Delete key value
     */
    return await keyValue.delete()
  }
}
