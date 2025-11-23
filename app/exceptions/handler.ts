import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => inertia.render('errors/not_found', { error }),
    '500..599': (error, { inertia }) => inertia.render('errors/server_error', { error }),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    const isInertia = ctx.request.header('X-Inertia')
    const wantsJson = ctx.request.accepts(['json', 'html']) === 'json'

    /**
     * 1. If request is an Inertia request → return inertia error page
     */
    if (isInertia) {
      return ctx.inertia.render('errors/server_error', {
        error: {
          message: error.message,
          status: error.status || 500,
        },
      })
    }

    /**
     * 2. If client does NOT want JSON (usually browser wants HTML)
     * → fallback to status pages or default HTML error
     */
    if (!wantsJson) {
      return super.handle(error, ctx)
    }

    /**
     * 3. Default fallback → return structured JSON error
     */
    return ctx.response.status(error.status || 500).send({
      success: false,
      ...error,
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
