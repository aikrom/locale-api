import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistsException from 'App/Exceptions/AlreadyExistException'
import User from 'App/Models/User'
import UserCreateValidator from 'App/Validators/UserCreateValidator'

export default class AuthController {
  public async signUp({ request }: HttpContextContract) {
    const payload = await request.validate(UserCreateValidator)

    const isUnique = User.findBy('email', payload.email)

    if (!isUnique) {
      throw new AlreadyExistsException('A user with this email already exists')
    }

    const user = await User.create(payload)

    return user
  }

  public async signIn({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      return token
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return { revoked: true }
  }
}
