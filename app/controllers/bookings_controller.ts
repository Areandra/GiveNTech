import BookingService from '#services/booking_service'
import BookingsValidator from '#validators/booking'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'

const BookingCreate = BookingsValidator.create
const BookingUpdate = BookingsValidator.update
@ApiSecurity('BearerAuth')
export default class BookingsController {
  @ApiOperation({ summary: 'List all Bookings' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Booking succsesfuly optained' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Booking' } },
      },
    },
  })
  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const data = await BookingService.getBookings({ page })

    ctx.response.ok({
      succses: true,
      message: 'Booking succsesfuly optained',
      data,
    })
  }

  @ApiOperation({ summary: 'Get Booking with id' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Booking with id 1 has found' },
        data: { $ref: '#/components/schemas/Booking' },
      },
    },
  })
  async show(ctx: HttpContext) {
    const id = await ctx.params.id
    const data = await BookingService.getBooking(id)

    ctx.response.ok({
      succses: true,
      message: `Booking with id ${id} has found`,
      data,
    })
  }

  @ApiOperation({ summary: 'Create Booking' })
  @ApiBody({ type: () => BookingCreate })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Booking Created' },
      },
      example: `{
  succses: true,
  message: 'Booking Created',
}`,
    },
  })
  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(BookingCreate)
    await BookingService.createBooking(body)

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
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Booking Updated' },
      },
      example: `{
  succses: true,
  message: 'Booking Updated',
}`,
    },
  })
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(BookingUpdate, {
      meta: { userRole: ctx.auth.user?.role || "user" },
    })
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
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Booking Deleted' },
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

  // @ApiOperation({ summary: 'Get Booking with id' })
  // @ApiResponse({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       success: { type: 'boolean', example: 'true' },
  //       message: { type: 'string', example: 'Booking with id 1 has found' },
  //       data: { $ref: '#/components/schemas/Booking' },
  //     },
  //   },
  // })
  // async qr(ctx: HttpContext) {
  //   const id = await ctx.params.id
  //   const data = await BookingService.getBooking(id)

  //   ctx.response.ok({
  //     succses: true,
  //     message: `Booking with id ${id} has found`,
  //     data,
  //   })
  // }
}
