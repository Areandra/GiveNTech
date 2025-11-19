import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  service = new UserService()
  validator = new UsersValidator()

  async register(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(this.validator.create)
    const data = await this.service.createUser(body, ctx)

    ctx.response.ok({
      succses: true,
      message: 'Registerd succsesfuly',
      token: data.token,
      data: data.user
    })
  }

  async login(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(this.validator.create)
    const data = await this.service.getUserByCredential(body, ctx)

    ctx.response.ok({
      succses: true,
      message: 'Registerd succsesfuly',
      token: data.token,
      data: data.user,
    })
  }

  async updateProfile(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(this.validator.create)
    await this.service.updateUser(id, body)

    ctx.response.ok({
      succses: true,
      message: 'Profile updated',
    })
  }

  async destroyAccount(ctx: HttpContext) {
    const id = ctx.params.id
    await this.service.deleteUser(id)

    ctx.response.ok({
      succses: true,
      message: 'Account deleted',
    })
  }
}
