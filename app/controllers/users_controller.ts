import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  service = new UserService()
  validator = new UsersValidator()

  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const data = await this.service.listUsers(page)

    ctx.response.ok({
      succses: true,
      message: 'Facilities succsesfuly optained',
      data,
    })
  }

  async show(ctx: HttpContext) {
    const id = await ctx.params.id
    const data = await this.service.getUser(id)

    ctx.response.ok({
      succses: true,
      message: `Facility with id ${id} has found`,
      data,
    })
  }
}
