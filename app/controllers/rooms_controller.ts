import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import Booking from '#models/booking'
import RoomsValidator from '#validators/room'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'
import web_socket_service from '#services/web_socket_service'
import { ApiErrorResponses } from '#validators/global_error'

const RoomCreate = RoomsValidator.create
const RoomUpdate = RoomsValidator.update

@ApiSecurity('BearerAuth')
@ApiErrorResponses.Unauthorized
export default class RoomsController {
  private ok(ctx: HttpContext, message: string, extra: Record<string, any> = {}) {
    return ctx.response.ok({
      success: true,
      message,
      ...extra,
    })
  }

  @ApiOperation({ summary: 'Daftar Semua Ruangan' })
  @ApiSecurity('false')
  @ApiResponse({
    status: 200,
    description: 'Daftar ruangan berhasil diperoleh',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Daftar ruangan berhasil diperoleh' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Room' } },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async index(ctx: HttpContext) {
    const data = await Room.query().preload('bookings')
    return this.ok(ctx, 'Daftar ruangan berhasil diperoleh', { data })
  }

  @ApiOperation({ summary: 'Ambil Ruangan berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Ruangan berhasil ditemukan',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ruangan dengan ID 1 berhasil ditemukan' },
        data: { $ref: '#/components/schemas/Room' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await Room.query()
      .where('id', id)
      .preload('bookings', (b) => {
        b.preload('fasilitas')
        b.preload('user')
      })
      .firstOrFail()

    return this.ok(ctx, `Ruangan dengan ID ${id} berhasil ditemukan`, { data })
  }

  @ApiOperation({ summary: 'Buat Ruangan Baru' })
  @ApiBody({ type: () => RoomCreate })
  @ApiResponse({
    status: 200,
    description: 'Ruangan berhasil dibuat',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ruangan berhasil dibuat' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(RoomCreate)
    await Room.create(payload)

    web_socket_service?.io?.emit('roomReload')

    return this.ok(ctx, 'Ruangan berhasil dibuat')
  }

  @ApiOperation({ summary: 'Perbarui Ruangan berdasarkan ID' })
  @ApiBody({ type: () => RoomUpdate })
  @ApiResponse({
    status: 200,
    description: 'Ruangan berhasil diperbarui',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ruangan berhasil diperbarui' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const payload = await ctx.request.validateUsing(RoomUpdate)

    const room = await Room.findOrFail(id)
    room.merge(payload)
    await room.save()

    web_socket_service?.io?.emit('roomReload')

    return this.ok(ctx, 'Ruangan berhasil diperbarui')
  }

  @ApiOperation({ summary: 'Hapus Ruangan berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Ruangan berhasil dihapus',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ruangan berhasil dihapus' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const room = await Room.findOrFail(id)
    await room.delete()

    web_socket_service?.io?.emit('roomReload')

    return this.ok(ctx, 'Ruangan berhasil dihapus')
  }

  @ApiOperation({ summary: 'Ambil Lokasi Booking Aktif' })
  @ApiResponse({
    status: 200,
    description: 'Data lokasi ruangan dengan booking aktif berhasil diperoleh',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Data map ruangan berhasil diperoleh' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              room_name: { type: 'string' },
              longitude: { type: 'number' },
              latitude: { type: 'number' },
              borrowed_facilities_count: { type: 'number' },
              active_bookings: {
                type: 'array',
                items: { type: 'object' },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async mapData(ctx: HttpContext) {
    const rooms = await Room.all()

    const mapData = await Promise.all(
      rooms.map(async (room) => {
        const activeBookings = await Booking.query()
          .where('id_room', room.id)
          .where('status', 'Picked Up')
          .preload('fasilitas')
          .preload('user')

        return {
          id: room.id,
          room_name: room.roomName,
          longitude: Number(room.longitude),
          latitude: Number(room.latitude),
          borrowed_facilities_count: activeBookings.length,
          active_bookings: activeBookings,
        }
      })
    )

    return this.ok(ctx, 'Data map ruangan berhasil diperoleh', { data: mapData })
  }
}
