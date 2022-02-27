import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }),
    email: schema.string.optional({ trim: true }, [rules.email()]),
    password: schema.string.optional({}, [rules.confirmed()]),
  })
}
