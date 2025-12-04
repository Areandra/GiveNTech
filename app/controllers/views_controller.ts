import booking_service from '#services/booking_service'
// import FacilityService from '#services/fasility_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ViewsController {
  async login(ctx: HttpContext) {
    return ctx.inertia.render('auth/login')
  }
  async register(ctx: HttpContext) {
    return ctx.inertia.render('auth/register')
  }

  async facility(ctx: HttpContext) {
    // const page = await ctx.request.input('page', 1)
    // const data = await FacilityService.listFacilities(page)
    return ctx.inertia.render('facility')
  }

  async bookingQR(ctx: HttpContext) {
    const id = ctx.params.id

    const data = await booking_service.getBooking(id)

    return ctx.inertia.render('qrcode', {
      idBooking: data.id,
      status: data.status,
    })
  }

  async qrReader({ inertia }: HttpContext) {
    return inertia.render('qrcodeReader')
  }
}

