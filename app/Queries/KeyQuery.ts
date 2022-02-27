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

  public async findByKey(key: string) {
    return await Key.findBy('key', key)
  }
}

export default new KeyQuery()
