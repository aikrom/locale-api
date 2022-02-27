import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async me({ auth }: HttpContextContract) {
    return auth.user
  }
}
