import NotFoundException from 'App/Exceptions/NotFoundException'
import Collection from 'App/Models/Collection'

class CollectionQuery {
  /**
   * Find collection by `ID`
   *
   * @param collectionId - Collection ID
   */
  public async findById(collectionId: number) {
    return await Collection.find(collectionId)
  }

  /**
   * Find collection by `ID` and fail if not found
   *
   * @param collectionId - Collection ID
   */
  public async findByIdOrFail(collectionId: number) {
    const collection = await this.findById(collectionId)

    if (!collection) {
      throw new NotFoundException()
    }

    return collection
  }

  /**
   * Find collection by `code`
   *
   * @param colectionCode - Collection code
   */
  public async findByCode(colectionCode: string) {
    return await Collection.findBy('code', colectionCode)
  }

  /**
   * Find collection by `code` and fail if not found
   *
   * @param colectionCode - Collection code
   */
  public async findByCodeOrFail(colectionCode: string) {
    const collection = await this.findByCode(colectionCode)

    if (!collection) {
      throw new NotFoundException()
    }

    return collection
  }
}

export default new CollectionQuery()
