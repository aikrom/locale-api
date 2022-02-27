import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class KeyUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    key: schema.string.optional({ trim: true }),
    value: schema.string.optional({ trim: true }),
    language: schema.string.optional({ trim: true }),
  })
}
