import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import RoleBasedAcsessMiddleware from './role_based_acsess_middleware.js'

export default class GraphQlAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const wantsJson = ctx.request.accepts(['json', 'html']) === 'json'

    if (ctx.request.url() !== '/graphql') {
      return next()
    }

    try {
      await ctx.auth.authenticateUsing(['api', 'web'])
    } catch (error) {
      if (wantsJson)
        return ctx.response.unauthorized({
          status: 403,
          success: false,
          message: 'Tidak Terautentikasi (Unauthorized).',
        })
      return ctx.response.redirect('/login')
    }

    const roleBasedAcsess = new RoleBasedAcsessMiddleware()

    const output = await roleBasedAcsess.handle(ctx, next, ['admin'])

    return output
  }
}
