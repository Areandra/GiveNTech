import BookingService from '#services/booking_service'
import web_socket_service from '#services/web_socket_service'
import BookingsValidator from '#validators/booking'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'
import { ApiErrorResponses } from '#validators/global_error'

const BookingCreate = BookingsValidator.create
const BookingUpdate = BookingsValidator.update

@ApiSecurity('BearerAuth')
@ApiErrorResponses.Forbidden
@ApiErrorResponses.Unauthorized
export default class BookingsController {
  private ok(ctx: HttpContext, message: string, extra: Record<string, any> = {}) {
    return ctx.response.ok({
      success: true,
      message,
      ...extra,
    })
  }

  @ApiOperation({ summary: 'Daftar Semua Booking' })
  @ApiResponse({
    status: 200,
    description: 'Daftar booking berhasil diperoleh',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Daftar booking berhasil diperoleh' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Booking' } },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const data = await BookingService.getBookings({ page })

    return this.ok(ctx, 'Daftar booking berhasil diperoleh', { data })
  }

  @ApiOperation({ summary: 'Ambil Booking berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil ditemukan',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking dengan ID 1 berhasil ditemukan' },
        data: { $ref: '#/components/schemas/Booking' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await BookingService.getBooking(id)

    return this.ok(ctx, `Booking dengan ID ${id} berhasil ditemukan`, { data })
  }

  @ApiOperation({ summary: 'Buat Booking Baru' })
  @ApiBody({ type: () => BookingCreate })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil dibuat',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking berhasil dibuat' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(BookingCreate)
    await BookingService.createBooking(body)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Booking berhasil dibuat')
  }

  @ApiOperation({ summary: 'Perbarui Booking' })
  @ApiBody({ type: () => BookingUpdate })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil diperbarui',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking berhasil diperbarui' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(BookingUpdate, {
      meta: { userRole: ctx.auth.user?.role || 'user' },
    })
    await BookingService.updateBooking(id, body)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Booking berhasil diperbarui')
  }

  @ApiOperation({ summary: 'Hapus Booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil dihapus',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking berhasil dihapus' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    await BookingService.deleteBooking(id)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Booking berhasil dihapus')
  }
}
