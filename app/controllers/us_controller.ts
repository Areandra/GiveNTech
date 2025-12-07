import BookingService from '#services/booking_service'
import UserService from '#services/user_service'
import web_socket_service from '#services/web_socket_service'
import BookingsValidator from '#validators/booking'
import { ApiErrorResponses } from '#validators/global_error'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'

const MeCreateBooking = BookingsValidator.createMe
const BookingUpdate = BookingsValidator.update

@ApiSecurity('BearerAuth')
@ApiErrorResponses.Forbidden
@ApiErrorResponses.Unauthorized
export default class UsController {
  private ok(ctx: HttpContext, message: string, extra: Record<string, any> = {}) {
    return ctx.response.ok({
      success: true,
      message,
      ...extra,
    })
  }

  @ApiOperation({ summary: 'Ambil Detail Pengguna Saat Ini (Me)' })
  @ApiResponse({
    status: 200,
    description: 'Detail pengguna berhasil diperoleh',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'This is ur Bio' },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async me(ctx: HttpContext) {
    const user = ctx.auth.user!
    const data = await UserService.getUserByCredential({ email: user.email }, ctx, false)

    return this.ok(ctx, `This is ur Bio`, { data: data.user })
  }

  @ApiOperation({ summary: 'Hapus Akun Pengguna Saat Ini' })
  @ApiResponse({
    status: 200,
    description: 'Akun berhasil dihapus',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Account deleted' },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async destroyMe(ctx: HttpContext) {
    const id = ctx.auth.user!.id

    await UserService.deleteUser(id)

    return this.ok(ctx, 'Account deleted')
  }

  @ApiOperation({ summary: 'Perbarui Profil Pengguna Saat Ini' })
  @ApiBody({ type: () => UsersValidator.update })
  @ApiResponse({
    status: 200,
    description: 'Profil berhasil diperbarui',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Profile updated' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async updateMe(ctx: HttpContext) {
    const id = ctx.auth.user!.id
    const body = await ctx.request.validateUsing(UsersValidator.update, {
      meta: {
        userRole: ctx.auth.user?.role || 'user',
      },
    })

    await UserService.updateUser(id, body)

    return this.ok(ctx, 'Profile updated')
  }

  @ApiOperation({ summary: 'Daftar Booking Saya' })
  @ApiResponse({
    status: 200,
    description: 'Daftar booking berhasil diperoleh',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'List of ur bookings' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Booking' } },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async listBookings(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const userId = ctx.auth.user!.id
    const data = await BookingService.getBookings({ userId: userId, page })

    return this.ok(ctx, 'List of ur bookings', { data })
  }

  @ApiOperation({ summary: 'Ambil Booking Saya berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil ditemukan',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking with id 1 has found' },
        data: { $ref: '#/components/schemas/Booking' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async getBooking(ctx: HttpContext) {
    const id = ctx.params.id

    const data = await BookingService.getBooking(id, ctx.auth.user!.id)

    return this.ok(ctx, `Booking with id ${id} has found`, { data })
  }

  @ApiOperation({ summary: 'Buat Booking Baru (Saya)' })
  @ApiBody({ type: () => MeCreateBooking })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil dibuat',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking created' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async createBooking(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(BookingsValidator.create)
    await BookingService.createBooking(body, ctx.auth.user!.id)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Booking created')
  }

  @ApiOperation({ summary: 'Perbarui Booking Saya' })
  @ApiBody({ type: () => BookingUpdate })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil diperbarui',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking updated' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async updateBooking(ctx: HttpContext) {
    const id = ctx.params.id

    const body = await ctx.request.validateUsing(BookingUpdate)
    await BookingService.updateBooking(
      id,
      {
        ...body,
      },
      ctx.auth.user!.id
    )

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Booking updated')
  }

  @ApiOperation({ summary: 'Hapus Booking Saya' })
  @ApiResponse({
    status: 200,
    description: 'Booking berhasil dihapus',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Booking deleted' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async destroyBooking(ctx: HttpContext) {
    const id = ctx.params.id

    await BookingService.deleteBooking(id, ctx.auth.user!.id)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    return this.ok(ctx, 'Booking deleted')
  }
}
