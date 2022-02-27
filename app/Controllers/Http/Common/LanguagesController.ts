import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Language from 'App/Models/Language'
import FilterUtil from 'App/Shared/Utils/FilterUtil'
import PaginationUtil from 'App/Shared/Utils/PaginationUtil'

export default class LanguagesController {
  /**
   * Filter language
   *
   * @param ctx - Http context
   */
  public async find({ request }: HttpContextContract) {
    /**
     * Get pagination parameters from a request
     */
    const pagination = PaginationUtil.fromInput(request)

    /**
     * Build a query with filters
     */
    const query = FilterUtil.where(Language.query(), {
      name: {
        value: request.input('name'),
        builder: (value: string) => ['LIKE', `%${value}%`],
      },
      code: {
        value: request.input('code'),
        builder: (value: string) => ['=', value],
      },
    })

    return await query.paginate(...pagination)
  }

  /**
   * Find language by code
   *
   * @param ctx - Http context
   */
  public async findByCode({ request }: HttpContextContract) {
    /**
     * Get code from request params
     */
    const languageCode: string = request.param('code')

    /**
     * Check is language code is 'string'
     */
    if (typeof languageCode !== 'string') {
      throw new BadRequestException()
    }

    /**
     * Find language
     */
    const language = await Language.findBy('code', languageCode)

    if (!language) {
      throw new NotFoundException()
    }

    return language
  }
}
