import NotFoundException from 'App/Exceptions/NotFoundException'
import KeyValue from 'App/Models/KeyValue'

class KeyValueQuery {
  /**
   * Find key value by `ID`
   *
   * @param keyValueId - Key value ID
   */
  public async findById(keyValueId: number) {
    return await KeyValue.find(keyValueId)
  }

  /**
   * Find key value by `ID` and fail if not found
   *
   * @param keyValueId - Key value ID
   */
  public async findByIdOrFail(keyValueId: number) {
    const keyValue = await this.findById(keyValueId)

    if (!keyValue) {
      throw new NotFoundException()
    }

    return keyValue
  }

  /**
   * Find key value by `ID` and `language`
   *
   * @param keyId - Key ID
   * @param language - Language (code)
   */
  public async findByKeyAndLanguage(keyId: number, language: string) {
    return await KeyValue.query().where('key_id', keyId).andWhere('language', language).first()
  }
}

export default new KeyValueQuery()
