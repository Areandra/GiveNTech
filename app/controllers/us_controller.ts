import User from '#models/user'
import BookingService from '#services/booking_service'
import UserService from '#services/user_service'
import web_socket_service from '#services/web_socket_service'
import BookingsValidator from '#validators/booking'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'

const MeCreateBooking = BookingsValidator.createMe
const BookingUpdate = BookingsValidator.update
@ApiSecurity('BearerAuth')
export default class UsController {
  @ApiOperation({ summary: 'Get ME' })
  @ApiResponse({ type: User })
  async me(ctx: HttpContext) {
    const user = ctx.auth.user!

    const data = await UserService.getUserByCredential({ email: user.email }, ctx, false)

    ctx.response.ok({
      succses: true,
      message: `This is ur Bio`,
      data,
    })
  }

  @ApiOperation({ summary: 'Destroy Me' })
  @ApiResponse({ type: [User] })
  async destroyMe(ctx: HttpContext) {
    const id = ctx.auth.user!.id

    await UserService.deleteUser(id)
    ctx.response.ok({
      succses: true,
      message: 'Account deleted',
    })
  }

  @ApiOperation({ summary: 'Update Me' })
  async updateMe(ctx: HttpContext) {
    const id = ctx.auth.user!.id
    const body = await ctx.request.validateUsing(UsersValidator.update, {
      meta: {
        userRole: ctx.auth.user?.role || 'user',
      },
    })

    await UserService.updateUser(id, body)

    ctx.response.ok({
      succses: true,
      message: 'Profile updated',
    })
  }

  @ApiOperation({ summary: 'List Me Bookings' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Booking' } },
      },
    },
  })
  async listBookings(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const userId = ctx.auth.user!.id
    const data = await BookingService.getBookings({ userId: userId, page })

    return ctx.response.ok({
      succses: true,
      message: 'List of ur bookings',
      data,
    })
  }

  @ApiOperation({ summary: 'Get Booking with id' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/Booking' },
      },
    },
  })
  async getBooking(ctx: HttpContext) {
    const id = await ctx.params.id

    const data = await BookingService.getBooking(id, ctx.auth.user!.id)

    return ctx.response.ok({
      succses: true,
      message: `Booking with id ${id} has found`,
      data,
    })
  }

  @ApiOperation({ summary: 'Create Booking' })
  @ApiBody({ type: () => MeCreateBooking })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  succses: true,
  message: 'Booking Created',
}`,
    },
  })
  async createBooking(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(BookingsValidator.create)
    await BookingService.createBooking(body, ctx.auth.user!.id)

    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')

    ctx.response.ok({
      succses: true,
      message: 'Booking created',
    })
  }

  @ApiOperation({ summary: 'Update Booking' })
  @ApiBody({ type: () => BookingUpdate })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  succses: true,
  message: 'Booking Updated',
}`,
    },
  })
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
    ctx.response.ok({
      succses: true,
      message: 'Booking updated',
    })
  }

  @ApiOperation({ summary: 'Booking Deleted' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  succses: true,
  message: 'Booking Deleted',
}`,
    },
  })
  async destroyBooking(ctx: HttpContext) {
    const id = ctx.params.id
    await BookingService.deleteBooking(id, ctx.auth.user!.id)
    web_socket_service?.io?.emit('bookingReload')
    web_socket_service?.io?.emit('facilityReload')
    ctx.response.ok({
      succses: true,
      message: 'Booking deleted',
    })
  }
}
