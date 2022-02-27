import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  /**
   * Return authed user accout
   *
   * @param ctx - Http context
   */
  public async me({ auth }: HttpContextContract) {
    return auth.user
  }
}
