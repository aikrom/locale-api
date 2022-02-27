import NotFoundException from 'App/Exceptions/NotFoundException'
import KeyValue from 'App/Models/KeyValue'

class KeyValueQuery {
  public async findById(keyValueId: number) {
    return await KeyValue.find(keyValueId)
  }

  public async findByIdOrFail(keyValueId: number) {
    const keyValue = await this.findById(keyValueId)

    if (!keyValue) {
      throw new NotFoundException()
    }

    return keyValue
  }

  public async findByKeyAndLanguage(keyId: number, language: string) {
    return await KeyValue.query().where('key_id', keyId).andWhere('language', language).first()
  }
}

export default new KeyValueQuery()
