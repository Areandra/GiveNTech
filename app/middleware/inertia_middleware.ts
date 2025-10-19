import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InertiaMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const token = ctx.request.header('Authorization')
    const user = ctx.auth.user

    ctx.inertia.share({
      auth: {
        user: user ? user.serialize() : null,
        token: token ?? null,
      },
    })

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
