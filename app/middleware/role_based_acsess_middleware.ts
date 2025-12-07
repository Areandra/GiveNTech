import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleBasedAcsessMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles?: string[]) {
    const user = ctx.auth.user
    const wantsJson = ctx.request.accepts(['json', 'html']) === 'json'

    if (!user) {
      return ctx.response.unauthorized({ message: 'Unauthorized' })
    }

    if (allowedRoles && !allowedRoles.includes(user.role as string)) {
      if (wantsJson) {
        return ctx.response.forbidden({
          message: 'Dilarang Mengakses (Forbidden).',
        })
      } else {
        return ctx.response.redirect('/forbidden')
      }
    }

    const output = await next()
    return output
  }
}
