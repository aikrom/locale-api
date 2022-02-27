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
  public async find({ request, bouncer }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    await bouncer.with('ProjectPolicy').authorize('view', project)
    const pagination = PaginationUtil.fromInput(request)

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

  public async findById({ bouncer, request }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const collectionId: number = request.param('id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    await bouncer.with('CollectionPolicy').authorize('view', project, collection)

    return collection
  }

  public async create({ auth, bouncer, request }: HttpContextContract) {
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    const payload = await request.validate(CollectionCreateValidator)
    await bouncer.with('CollectionPolicy').authorize('create', project)

    const isCodeExists = await CollectionQuery.findByCode(payload.code)

    if (isCodeExists && isCodeExists.projectId === project.id) {
      throw new AlreadyExistsException('A collection with this code already exists')
    }

    const collection = await Collection.create(payload)
    await collection.related('createdByUser').associate(auth.user!)
    await collection.related('project').associate(project)

    return collection
  }

  public async update({ request, bouncer }: HttpContextContract) {
    const collectionId: number = request.param('id')
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    await bouncer.with('CollectionPolicy').authorize('update', project, collection)
    const payload = await request.validate(CollectionUpdateValidator)

    if (payload.code) {
      const isCodeExists = await CollectionQuery.findByCode(payload.code)

      if (isCodeExists && isCodeExists.projectId === project.id) {
        throw new AlreadyExistsException('A collection with this code already exists')
      }
    }

    return collection.merge(payload).save()
  }

  public async delete({ bouncer, request }: HttpContextContract) {
    const collectionId: number = request.param('id')
    const projectId: number = request.param('project_id')
    const project = await ProjectQuery.findByIdOrFail(projectId)
    const collection = await CollectionQuery.findByIdOrFail(collectionId)
    await bouncer.with('CollectionPolicy').authorize('view', project, collection)
    return await collection.delete()
  }
}
