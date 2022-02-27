import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CollectionUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    code: schema.string.optional({ trim: true }),
    name: schema.string.optional({ trim: true }),
    description: schema.string.nullableAndOptional({ trim: true }),
  })
}
