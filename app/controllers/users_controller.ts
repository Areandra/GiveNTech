import User from '#models/user'
import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  service = new UserService()
  validator = new UsersValidator()

  private async checkUserAcsess(user: User, id: number, callback: () => void) {
    const userTarget = await this.service.getUser(id)

    const isSelf = user === userTarget
    const isSuperAdmin = user.role !== 'super_admin'

    if (!isSelf || !isSuperAdmin) {
      return callback()
    }
  }

  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const data = await this.service.listUsers(page)

    ctx.response.ok({
      succses: true,
      message: 'Users succsesfuly optained',
      data,
    })
  }

  async show(ctx: HttpContext) {
    const id = await ctx.params.id

    this.checkUserAcsess(ctx.auth.user!, id, () =>
      ctx.response.forbidden({
        succses: false,
        messege: 'You are not authorized to get this account',
      })
    )

    const data = await this.service.getUser(id)

    ctx.response.ok({
      succses: true,
      message: `User with id ${id} has found`,
      data,
    })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    this.checkUserAcsess(ctx.auth.user!, id, () =>
      ctx.response.forbidden({
        succses: false,
        messege: 'You are not authorized to delete this account',
      })
    )

    await this.service.deleteUser(id)
    ctx.response.ok({
      succses: true,
      message: 'Account deleted',
    })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(this.validator.update, {
      meta: {
        userRole: ctx.auth.user?.role || 'user',
      },
    })

    this.checkUserAcsess(ctx.auth.user!, id, () =>
      ctx.response.forbidden({
        succses: false,
        messege: 'You are not authorized to update this account',
      })
    )

    await this.service.updateUser(id, body)

    ctx.response.ok({
      succses: true,
      message: 'Profile updated',
    })
  }

  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(this.validator.create, {
      meta: {
        userRole: ctx.auth.user?.role || 'user',
      },
    })
    const data = await this.service.createUser(body, ctx)

    ctx.response.ok({
      succses: true,
      message: 'Registerd succsesfuly',
      token: data.token,
      data: data.user,
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
}
