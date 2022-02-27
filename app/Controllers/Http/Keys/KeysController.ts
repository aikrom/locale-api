import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistsException from 'App/Exceptions/AlreadyExistException'
import Key from 'App/Models/Key'
import CollectionQuery from 'App/Queries/CollectionQuery'
import KeyQuery from 'App/Queries/KeyQuery'
import ProjectQuery from 'App/Queries/ProjectQuery'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import KeyCreateValidator from 'App/Validators/KeyCreateValidator'
import KeyUpdateValidator from 'App/Validators/KeyUpdateValidator'

export default class CollectionsController {
  public async find({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    await bouncer.with('CollectionPolicy').authorize('view', project, collection)

    const query = collection.related('keys').query()
    const pagination = PaginationUtil.fromInput(request.input)

    const filter = {
      key: {
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
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)

    await bouncer.with('KeyPolicy').authorize('view', project, collection, key)

    return key
  }

  public async create({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)

    await bouncer.with('KeyPolicy').authorize('create', project)

    const payload = await request.validate(KeyCreateValidator)

    const isKeyExists = await KeyQuery.findByKey(payload.key)

    if (isKeyExists && isKeyExists.collectionId === collection.id) {
      throw new AlreadyExistsException('Key already exists')
    }

    const key = await Key.create(payload)
    await key.related('collection').associate(collection)

    return key
  }

  public async update({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)

    await bouncer.with('KeyPolicy').authorize('update', project, collection, key)

    const payload = await request.validate(KeyUpdateValidator)

    if (payload.key) {
      const isKeyExists = await KeyQuery.findByKey(payload.key)

      if (isKeyExists && isKeyExists.collectionId === collection.id) {
        throw new AlreadyExistsException('Key already exists')
      }
    }

    return key.merge(payload).save()
  }

  public async delete({ bouncer, request }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('collection_id')
    const keyId: number = request.param('id')

    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    const key = await KeyQuery.findByIdOrFail(keyId)

    await bouncer.with('KeyPolicy').authorize('delete', project, collection, key)

    return await key.delete()
  }
}
