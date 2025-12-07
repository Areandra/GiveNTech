import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

class UserService {
  private userQuery(userId?: number) {
    let query = User.query().preload('bookings')
    if (userId) query = query.where('id', userId)
    return query
  }

  public async listUsers() {
    return User.query()
  }

  public async createUser(userData: Partial<User>, ctx: HttpContext) {
    const user = await User.create(userData)
    if (!user) throw new Error('User not found')

    const token = await ctx.auth.use('api').createToken(user, [], {
      expiresIn: '7 days',
    })

    await user.refresh()

    return { user, token: token.toJSON().token }
  }

  public async updateUser(userId: number, updateData: Partial<User>) {
    const user = await User.find(userId)
    if (!user) throw new Error('User not found')

    user.merge(updateData)
    await user.save()
    return user
  }

  public async deleteUser(userId: number) {
    const user = await User.find(userId)
    if (!user) throw new Error('User not found')

    await user.delete()
    return user
  }

  public async getUser(userId: number, meId?: number) {
    const user = await this.userQuery(meId || userId).first()
    if (!user) throw new Error('User not found')
    if (meId && user.id !== meId) throw new Error('Unauthorized')

    return user
  }

  public async getUserByCredential(
    credentials: { email: string; password?: string },
    ctx: HttpContext,
    createToken = true
  ) {
    let user
    if (credentials.password)
      user = await User.verifyCredentials(credentials.email, credentials.password)
    else user = await User.findByOrFail('email', credentials.email)
    if (!user) throw new Error('User not found')

    await user.load('bookings')

    if (createToken) {
      const token = await ctx.auth.use('api').createToken(user, [], {
        expiresIn: '7 days',
      })

      return { user, token: token.toJSON().token }
    }

    return { user }
  }
}

export default new UserService()
