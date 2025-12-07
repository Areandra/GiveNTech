import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
      dinamis?: boolean
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards)
      return next()
    } catch {
      const wantsJson = ctx.request.accepts(['json', 'html']) === 'json'
      if (options.dinamis) return next()

      if (wantsJson)
        return ctx.response.unauthorized({
          status: 403,
          success: false,
          message: 'Tidak Terautentikasi (Unauthorized).',
        })
      return ctx.response.redirect(this.redirectTo)
    }
  }
}
