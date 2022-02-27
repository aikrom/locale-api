import NotFoundException from 'App/Exceptions/NotFoundException'
import Key from 'App/Models/Key'

class KeyQuery {
  public async findById(keyId: number) {
    return await Key.find(keyId)
  }

  public async findByIdOrFail(keyId: number) {
    const key = await this.findById(keyId)

    if (!key) {
      throw new NotFoundException()
    }

    return key
  }

  public async findByKeyAndLanguage(key: string, language: string) {
    return await Key.query().where('key', key).andWhere('language', language).first()
  }
}

export default new KeyQuery()
