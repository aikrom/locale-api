import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

type WhereQueryBuilder = (value: any) => string[]

type Schema = Record<
  string,
  {
    value: any
    builder: WhereQueryBuilder
  }
>

class FilterUtil {
  public where<T extends LucidModel = any>(query: ModelQueryBuilderContract<T>, schema: Schema) {
    Object.keys(schema).forEach((key, idx) => {
      const values = schema[key].builder(schema[key].value) as [string, string]
      if (idx === 0) {
        query.where(key, ...values)
      } else {
        query.andWhere(key, ...values)
      }
    })
    return query
  }
}

export default new FilterUtil()
