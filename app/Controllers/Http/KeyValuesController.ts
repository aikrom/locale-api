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
  public async find({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('key_id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)

    await bouncer.with('KeyPolicy').authorize('view', project, collection, key)

    const pagination = PaginationUtil.fromInput(request)

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

  public async findById({ bouncer, request }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('key_id')
    const keyValueId: number = request.param('id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)
    const keyValue = await KeyValueQuery.findByIdOrFail(keyValueId)

    await bouncer.with('KeyValuePolicy').authorize('view', project, collection, key, keyValue)

    return key
  }

  public async create({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('key_id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)

    await bouncer.with('KeyValuePolicy').authorize('create', project)

    const payload = await request.validate(KeyValueCreateValidator)

    const isKeyExists = await KeyValueQuery.findByKeyAndLanguage(key.id, payload.language)

    if (isKeyExists) {
      throw new AlreadyExistsException('Key already exists')
    }

    const keyValue = await KeyValue.create(payload)
    await keyValue.related('key').associate(key)

    return keyValue
  }

  public async update({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('key_id')
    const keyValueId: number = request.param('id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)
    const keyValue = await KeyValueQuery.findByIdOrFail(keyValueId)

    await bouncer.with('KeyValuePolicy').authorize('update', project, collection, key, keyValue)

    const payload = await request.validate(KeyValueUpdateValidator)

    if (payload.language) {
      const isKeyExists = await KeyValueQuery.findByKeyAndLanguage(key.id, payload.language)

      if (isKeyExists) {
        throw new AlreadyExistsException('Key already exists')
      }
    }

    return keyValue.merge(payload).save()
  }

  public async delete({ bouncer, request }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('key_id')
    const keyValueId: number = request.param('id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)
    const keyValue = await KeyValueQuery.findByIdOrFail(keyValueId)

    await bouncer.with('KeyValuePolicy').authorize('delete', project, collection, key, keyValue)

    return await keyValue.delete()
  }
}
