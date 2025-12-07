import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => inertia.render('errors/not_found', { error }),
    '500..599': (error, { inertia }) => inertia.render('errors/server_error', { error }),
  }

  /**
   * Helper function to standardize JSON error response structure.
   */
  private formatJsonError(status: number, message: string, errors: any = null) {
    const errorResponse: { status: number; success: boolean; message: string; errors?: any } = {
      status,
      success: false,
      message,
    }
    if (errors) {
      errorResponse.errors = errors
    }
    return errorResponse
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    const isInertia = ctx.request.header('X-Inertia')
    const wantsJson = ctx.request.accepts(['json', 'html']) === 'json'
    const status = error.status || 500

    if (isInertia) {
      return ctx.inertia.render('errors/server_error', {
        error: {
          message: error.message,
          status: status,
        },
      })
    }

    if (!wantsJson) {
      return super.handle(error, ctx)
    }

    if (error.code === 'E_VALIDATION_ERROR') {
      return ctx.response
        .status(422)
        .send(this.formatJsonError(422, 'Kesalahan Validasi. Periksa input Anda.', error.messages))
    }

    if (status === 404) {
      return ctx.response
        .status(404)
        .send(this.formatJsonError(404, 'Endpoint atau Sumber Daya Tidak Ditemukan.'))
    }

    if (status === 401) {
      return ctx.response
        .status(401)
        .send(this.formatJsonError(401, error.message || 'Tidak Terautentikasi (Unauthorized).'))
    }

    if (status === 403) {
      return ctx.response
        .status(403)
        .send(this.formatJsonError(403, error.message || 'Dilarang Mengakses (Forbidden).'))
    }

    return ctx.response
      .status(status)
      .send(
        this.formatJsonError(
          status,
          this.debug ? error.message : 'Terjadi Kesalahan Server Internal.'
        )
      )
  }

  /**
   * The method is used to report error... (Keep as is)
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
