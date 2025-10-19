import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!
    await user.load('bookings', (query) => {
      query.select(['id', 'no_ruang', 'nama'])
    })

    return inertia.render('user/dashboard', {
      user,
    })
  }
}
