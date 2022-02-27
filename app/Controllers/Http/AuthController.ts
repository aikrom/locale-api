import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistsException from 'App/Exceptions/AlreadyExistException'
import User from 'App/Models/User'
import UserCreateValidator from 'App/Validators/UserCreateValidator'

export default class AuthController {
  /**
   * Sign up new user
   *
   * @param ctx - Http Context
   */
  public async signUp({ request }: HttpContextContract) {
    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(UserCreateValidator)

    /**
     * Get user by email to check if any user exists
     * Note: Emails should be unique.
     */
    const isUnique = await User.findBy('email', payload.email)

    /**
     * Throw error if user with email already exists
     */
    if (isUnique) {
      throw new AlreadyExistsException('A user with this email already exists')
    }

    /**
     * Create user and save
     */
    const user = await User.create(payload)

    return user
  }

  /**
   * User sign in - creating an authorization token
   *
   * @param ctx - Http context
   */
  public async signIn({ auth, request, response }: HttpContextContract) {
    /**
     * Get user credentials from request body
     */
    const email = request.input('email')
    const password = request.input('password')

    try {
      /**
       * Generate auth token by credentials
       */
      const token = await auth.use('api').attempt(email, password)

      return token
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  /**
   * User logout - revoking the authorization token
   *
   * @param ctx - Http context
   */
  public async logout({ auth }: HttpContextContract) {
    /**
     * Revoke user auth token
     */
    await auth.use('api').revoke()

    return { revoked: true }
  }
}
