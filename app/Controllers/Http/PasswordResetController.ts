import Encryption from '@ioc:Adonis/Core/Encryption'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import PasswordReset from 'App/Models/PasswordReset'
import UserQuery from 'App/Queries/UserQuery'
import PasswordResetValidator from 'App/Validators/PasswordResetValidator'

export default class PasswordResetController {
  /**
   * Create a database entry to reset password.
   * Also generate a signature and send an email with a password reset URL.
   *
   * @param ctx - Http context
   */
  public async forgot({ request, response }: HttpContextContract) {
    /**
     * Get email address from request body
     */
    const email = request.input('email')

    console.log({ email })

    /**
     * Find a user with a given email address
     */
    const user = await UserQuery.findByEmailOrFail(email)

    /**
     * Create a signature that will be used to validate the reset request
     * Note: Signature should be valid only 30 minut
     */
    const signature = Route.makeSignedUrl(
      'password-reset.verify',
      {
        email,
      },
      { expiresIn: '30m' }
    )

    // TODO: Send email
    console.log(signature)

    /**
     * Create a record so to track who tried to change password
     */
    await PasswordReset.create({
      email,
      signature,
      userId: user.id,
    })

    return response.ok('OK')
  }

  /**
   * Check reset signature from email and generate new one to reset
   *
   * @param ctx - Http context
   */
  public async handShake({ request, response }: HttpContextContract) {
    /**
     * Validate reguest signature
     */
    if (!request.hasValidSignature()) {
      return response.badRequest('Invalid signature')
    }

    /**
     * Generate new signaure
     */
    const email = request.param('email')
    const signature = Encryption.encrypt(email, '15m')

    return { signature }
  }

  /**
   * Reset user password
   *
   * @param ctx - Http context
   */
  public async reset({ request, response }: HttpContextContract) {
    /**
     * Get signature from request query param and decrypt
     */
    const signature = request.input('signature')
    const email = Encryption.decrypt(signature) as string

    /**
     * Check is signature valid (decrypted)
     */
    if (!email) {
      return response.badRequest('Invalid signature')
    }

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate(PasswordResetValidator)

    /**
     * Fidn user by email
     */
    const user = await UserQuery.findByEmailOrFail(email)

    /**
     * Update user password
     */
    await user.merge(payload).save()

    /**
     * Revoke all user api tokens
     */
    await Database.query().from('api_tokens').where('user_id', user.id).delete()

    return response.ok('OK')
  }
}
