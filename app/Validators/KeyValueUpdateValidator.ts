import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class KeyValueUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    value: schema.string.optional({ trim: true }),
    language: schema.string.optional({ trim: true }),
  })
}
