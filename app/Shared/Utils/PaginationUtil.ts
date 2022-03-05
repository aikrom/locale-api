import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pagination from '../Types/Pagination'

class PaginationUtil {
  /**
   * Get pagination params from request
   *
   * @param request - Http request
   */
  public fromInput(request: HttpContextContract['request']): Pagination {
    /**
     * Get params from request input
     */
    let page = +request.input('page')
    let limit = +request.input('limit')

    /**
     * Validate params types
     */
    if (!page || isNaN(page)) {
      page = Env.get('DEFAULT_PAGE')
    }
    if (!limit || isNaN(limit)) {
      limit = Env.get('DEFAULT_PAGE_LIMIT')
    }

    return [page, limit]
  }
}

export default new PaginationUtil()
