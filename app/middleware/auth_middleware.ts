import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class AuthMiddleware {

  redirectTo = '/auth/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    args: string | undefined,

    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    if (args === 'frontend') {
      try {
        await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
        return next()
      } catch (error) {
        return ctx.response.redirect().toPath('/login')
      }
    } else {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      return next()
    }
  }
}
