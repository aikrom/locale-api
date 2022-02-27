import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Language from 'App/Models/Language'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'

export default class LanguagesController {
  public async find({ request }: HttpContextContract) {
    const query = Language.query()
    const pagination = PaginationUtil.fromInput(request.input)

    const filter = {
      name: {
        value: request.input('name'),
        query: (value: string) => ['LIKE', `%${value}%`],
      },
      code: {
        value: request.input('code'),
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

  public async findByCode({ request }: HttpContextContract) {
    const languageCode: string = request.param('code')

    if (!languageCode) {
      throw new BadRequestException()
    }

    return await Language.findByOrFail('code', languageCode)
  }
}
