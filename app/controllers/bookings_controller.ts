import BookingService from '#services/booking_service'
import BookingsValidator from '#validators/booking'
import type { HttpContext } from '@adonisjs/core/http'

export default class BookingsController {
  service = new BookingService()
  validator = new BookingsValidator()

  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const data = await this.service.listBookings(page)

    ctx.response.ok({
      succses: true,
      message: 'Booking succsesfuly optained',
      data,
    })
  }

  async show(ctx: HttpContext) {
    const id = await ctx.params.id
    const data = await this.service.getBooking(id)

    ctx.response.ok({
      succses: true,
      message: `Booking with id ${id} has found`,
      data,
    })
  }

  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(this.validator.create)
    await this.service.createBooking(ctx.auth.user!.id, body)

    ctx.response.ok({
      succses: true,
      message: 'Booking created',
    })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(this.validator.update)
    await this.service.updateBooking(id, {
      ...body,
    })

    ctx.response.ok({
      succses: true,
      message: 'Booking updated',
    })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    await this.service.deleteBooking(id)

    ctx.response.ok({
      succses: true,
      message: 'Booking deleted',
    })
  }
}
