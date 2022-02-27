import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'

class UserQuery {
  public async findByEmail(email: string) {
    return await User.findBy('email', email)
  }

  public async findByEmailOrFail(email: string) {
    const user = await this.findByEmail(email)

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }
}

export default new UserQuery()
