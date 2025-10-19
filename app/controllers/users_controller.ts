import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    return User.query().paginate(page)
  }

  async show({ params }: HttpContext) {
    return User.findByOrFail('username', decodeURI(params.username))
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const username = decodeURI(params.username)
      const user = await User.findByOrFail('username', username)

      user.merge(request.only(['username']))
      await user.save()

      return response.ok({
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update user',
        error: error.message,
      })
    }
  }

  async provide({ params, response }: HttpContext) {
    const user = await User.findByOrFail('username', decodeURI(params.username))

    if (user.role !== 'user')
      return response.status(409).json({
        message: 'User adalah admin',
      })

    user.role = 'admin'
    user.save()

    return response.status(201).json({
      user: user.username,
      newRole: user.role,
      messege: 'Role User Berhasil Di Provide',
    })
  }
}
