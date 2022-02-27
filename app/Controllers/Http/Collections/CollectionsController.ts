import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistsException from 'App/Exceptions/AlreadyExistException'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Collection from 'App/Models/Collection'
import Project from 'App/Models/Project'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'
import CollectionCreateValidator from 'App/Validators/CollectionCreateValidator'
import CollectionUpdateValidator from 'App/Validators/CollectionUpdateValidator'

export default class CollectionsController {
  public async find({ request, bouncer }: HttpContextContract) {
    const projectId = +request.param('id')

    if (!projectId) {
      throw new BadRequestException()
    }

    const project = await Project.find(projectId)

    if (!project) {
      throw new NotFoundException()
    }

    await bouncer.with('ProjectPolicy').authorize('view', project)

    const query = project.related('collections').query()
    const pagination = PaginationUtil.fromInput(request.input)

    const filter = {
      name: {
        value: request.input('name'),
        query: (value: string) => ['LIKE', `%${value}%`],
      },
      code: {
        value: request.input('name'),
        query: (value: string) => ['=', value],
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
    const collectionId = +request.param('id')
    const projectId = +request.param('id')

    if (!projectId || !collectionId) {
      throw new BadRequestException()
    }

    const project = await Project.find(projectId)
    const collection = await Collection.find(collectionId)

    if (!project || !collection) {
      throw new NotFoundException()
    }

    await bouncer.with('CollectionPolicy').authorize('view', project, collection)

    return collection
  }

  public async create({ auth, request }: HttpContextContract) {
    const projectId = +request.param('id')

    if (!projectId) {
      throw new BadRequestException()
    }

    const project = await Project.find(projectId)

    if (!project) {
      throw new NotFoundException()
    }

    const payload = await request.validate(CollectionCreateValidator)

    const isCodeExists = await Collection.findBy('code', payload.code)

    if (isCodeExists && isCodeExists.projectId === project.id) {
      throw new AlreadyExistsException('A collection with this code already exists')
    }

    const collection = await Collection.create(payload)
    await collection.related('createdByUser').associate(auth.user!)
    await collection.related('project').associate(project)

    return collection
  }

  public async update({ request, bouncer }: HttpContextContract) {
    const collectionId = +request.param('id')
    const projectId = +request.param('id')

    if (!projectId || !collectionId) {
      throw new BadRequestException()
    }

    const project = await Project.find(projectId)
    const collection = await Collection.find(collectionId)

    if (!project || !collection) {
      throw new NotFoundException()
    }

    await bouncer.with('CollectionPolicy').authorize('update', project, collection)

    const payload = await request.validate(CollectionUpdateValidator)

    const isCodeExists = await Collection.findBy('code', payload.code)

    if (isCodeExists && isCodeExists.projectId === project.id) {
      throw new AlreadyExistsException('A collection with this code already exists')
    }

    return project.merge(payload).save()
  }

  public async delete({ bouncer, request }: HttpContextContract) {
    const collectionId = +request.param('id')
    const projectId = +request.param('id')

    if (!projectId || !collectionId) {
      throw new BadRequestException()
    }

    const project = await Project.find(projectId)
    const collection = await Collection.find(collectionId)

    if (!project || !collection) {
      throw new NotFoundException()
    }

    await bouncer.with('CollectionPolicy').authorize('view', project, collection)

    return await project.delete()
  }
}
