import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CollectionCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    code: schema.string({ trim: true }),
    name: schema.string({ trim: true }),
    description: schema.string.nullableAndOptional({ trim: true }),
  })
}
