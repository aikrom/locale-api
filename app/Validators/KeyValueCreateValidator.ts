import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class KeyValueCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    value: schema.string({ trim: true }),
    language: schema.string({ trim: true }),
  })
}
