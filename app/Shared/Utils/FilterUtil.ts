import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

type Schema<T extends LucidModel = any> = Record<
  string,
  {
    value: any
    buidler: QueryBuilder<T>
  }
>

type QueryBuilder<T extends LucidModel = any, R = ModelQueryBuilderContract<T>> = (
  value: any,
  query: R,
  isFirst: boolean
) => void

class FilterUtil {
  public filter<T extends LucidModel = any>(query: ModelQueryBuilderContract<T>, schema: Schema) {
    Object.keys(schema).forEach((key, idx) =>
      schema[key].buidler(schema[key].value, query, idx === 0)
    )
    return query
  }
}

export default new FilterUtil()
