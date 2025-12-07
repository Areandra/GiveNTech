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

    // --- Inertia Handling (Keep as is) ---
    if (isInertia) {
      // ... (logic as before)
      return ctx.inertia.render('errors/server_error', {
        error: {
          message: error.message,
          status: status,
        },
      })
    }

    // --- HTML/Status Page Handling (Keep as is) ---
    if (!wantsJson) {
      return super.handle(error, ctx)
    }

    // ==========================================================
    // 💡 FOCUSED JSON API ERROR HANDLING
    // ==========================================================

    // 1. Validation Error (status 422 - `E_VALIDATION_ERROR`)
    if (error.code === 'E_VALIDATION_ERROR') {
      return ctx.response
        .status(422)
        .send(this.formatJsonError(422, 'Kesalahan Validasi. Periksa input Anda.', error.messages))
    }

    // 2. Not Found Error (status 404)
    if (status === 404) {
      return ctx.response
        .status(404)
        .send(this.formatJsonError(404, 'Endpoint atau Sumber Daya Tidak Ditemukan.'))
    }

    // 3. Authentication & Authorization Errors (401, 403)
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

    // 4. General/Internal Server Error (Default fallback)
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
