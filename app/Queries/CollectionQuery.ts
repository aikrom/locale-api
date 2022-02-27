import NotFoundException from 'App/Exceptions/NotFoundException'
import Collection from 'App/Models/Collection'

class CollectionQuery {
  public async findById(collectionId: number) {
    return await Collection.find(collectionId)
  }

  public async findByIdOrFail(collectionId: number) {
    const collection = await this.findById(collectionId)

    if (!collection) {
      throw new NotFoundException()
    }

    return collection
  }

  public async findByCode(colectionCode: string) {
    return await Collection.findBy('code', colectionCode)
  }

  public async findByCodeOrFail(colectionCode: string) {
    const collection = await this.findByCode(colectionCode)

    if (!collection) {
      throw new NotFoundException()
    }

    return collection
  }
}

export default new CollectionQuery()
