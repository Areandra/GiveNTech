import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleBasedAcsessMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles?: string[]) {
    const user = ctx.auth.user

    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    if (allowedRoles && !allowedRoles.includes(user.role))
      return ctx.response.forbidden({ messege: 'Forbidden' })

    const output = await next()
    return output
  }
}
