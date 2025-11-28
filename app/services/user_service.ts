import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

class UserService {
  /**
   * List users with pagination
   */
  public async listUsers(page = 1) {
    return User.query().paginate(page)
  }

  /**
   * Create new user
   */
  public async createUser(userData: Partial<User>, ctx: HttpContext) {
    const user = await User.create(userData)
    const token = await ctx.auth.use('api').createToken(user, [], {
      expiresIn: '7 days',
    })

    if (!user) throw new Error('User not found')
    return { user, token }
  }

  /**
   * Update user data
   */
  public async updateUser(userId: number, updateData: Partial<User>) {
    const user = await User.find(userId)
    if (!user) throw new Error('User not found')

    user.merge(updateData)
    await user.save()

    return user
  }

  /**
   * Delete user
   */
  public async deleteUser(userId: number) {
    const user = await User.find(userId)
    if (!user) throw new Error('User not found')

    await user.delete()
    return user
  }

  /**
   * Get user with bookings
   */
  public async getUser(userId: number) {
    const user = await User.query().where('id', userId).preload('bookings').first()

    if (!user) throw new Error('User not found')
    return user
  }

  public async getUserByCredential(credentials: any, ctx: HttpContext) {
    const user = await User.verifyCredentials(
      credentials.email || credentials.username,
      credentials.password
    )
    user.load('bookings')

    const token = await ctx.auth.use('api').createToken(user, [], {
      expiresIn: '7 days',
    })

    if (!user) throw new Error('User not found')
    return { user, token }
  }
}

export default new UserService()
