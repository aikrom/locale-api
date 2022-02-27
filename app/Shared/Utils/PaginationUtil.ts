import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pagination from '../Types/Pagination'

class PaginationUtil {
  public fromInput(input: HttpContextContract['request']['input']): Pagination {
    let page = +input('page')
    let limit = +input('limit')

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
