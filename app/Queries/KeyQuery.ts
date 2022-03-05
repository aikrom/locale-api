import NotFoundException from 'App/Exceptions/NotFoundException'
import Key from 'App/Models/Key'

class KeyQuery {
  /**
   * Find key by `ID`
   *
   * @param keyId - Key ID
   */
  public async findById(keyId: number) {
    return await Key.find(keyId)
  }

  /**
   * Find key by `ID` and fail if not found
   *
   * @param keyId - Key ID
   */
  public async findByIdOrFail(keyId: number) {
    const key = await this.findById(keyId)

    if (!key) {
      throw new NotFoundException()
    }

    return key
  }

  /**
   * Find key by `key`
   *
   * @param key - Key
   */
  public async findByKey(key: string) {
    return await Key.findBy('key', key)
  }
}

export default new KeyQuery()
