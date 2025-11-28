import Booking from '#models/booking'
import User from '#models/user'
import BookingService from '#services/booking_service'
import UserService from '#services/user_service'
import BookingsValidator from '#validators/booking'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

export default class UsController {
  private async checkUserAcsess(user: User, id: number, callback: () => void) {
    const userTarget = await UserService.getUser(id)

    const isSelf = user === userTarget
    const isSuperAdmin = user.role !== 'admin'

    if (!isSelf || !isSuperAdmin) {
      return callback()
    }
  }

  @ApiOperation({ summary: 'Get User by ID' })
  @ApiResponse({ type: User })
  async me(ctx: HttpContext) {
    const id = ctx.auth.user!.id

    const data = await UserService.getUser(id)

    ctx.response.ok({
      succses: true,
      message: `This is ur Bio`,
      data,
    })
  }

  @ApiOperation({ summary: 'List all Bookings' })
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
    const data = await BookingService.meListBookings(userId, page)

    ctx.response.ok({
      succses: true,
      message: 'List of ur bookings',
      data,
    })
  }

  @ApiOperation({ summary: 'Get Booking with id' })
  @ApiResponse({ type: Booking })
  async show(ctx: HttpContext) {
    const id = await ctx.params.id

    this.checkUserAcsess(ctx.auth.user!, id, () =>
      ctx.response.forbidden({
        succses: false,
        messege: 'You are not authorized to see this booking',
      })
    )
    const data = await BookingService.getBooking(id)

    ctx.response.ok({
      succses: true,
      message: `Booking with id ${id} has found`,
      data,
    })
  }

  @ApiOperation({ summary: 'Create Booking' })
  @ApiBody({ type: () => BookingsValidator.create })
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
  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(BookingsValidator.create)
    await BookingService.createBooking(ctx.auth.user!.id, body)

    ctx.response.ok({
      succses: true,
      message: 'Booking created',
    })
  }

  @ApiOperation({ summary: 'Update Booking' })
  @ApiBody({ type: () => BookingsValidator.update })
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
  async update(ctx: HttpContext) {
    const id = ctx.params.id

    const body = await ctx.request.validateUsing(BookingsValidator.update)
    await BookingService.updateBooking(id, {
      ...body,
    })

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
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    await BookingService.deleteBooking(id)

    ctx.response.ok({
      succses: true,
      message: 'Booking deleted',
    })
  }
}
