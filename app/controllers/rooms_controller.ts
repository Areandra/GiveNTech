// import type { HttpContext } from '@adonisjs/core/http'
// import Room from '#models/room'
// import Booking from '#models/booking'
// import RoomsValidator from '#validators/room' // Asumsi path ke RoomsValidator Anda
// import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'

// // Ambil skema kompilasi dari RoomsValidator
// const RoomCreate = RoomsValidator.create
// const RoomUpdate = RoomsValidator.update

// @ApiSecurity('BearerAuth') // Mengikuti referensi FacilityController
// @ApiResponse({ status: 404, description: 'Not Found' })
// export default class RoomsController {
//   // ==============================
//   // GET: /rooms
//   // ==============================
//   @ApiOperation({ summary: 'List all Rooms' })
//   @ApiSecurity('false') // Jika endpoint index/show bisa diakses publik/tanpa auth (sesuaikan dengan routes Anda)
//   @ApiResponse({
//     status: 200,
//     schema: {
//       type: 'object',
//       properties: {
//         success: { type: 'boolean' },
//         message: { type: 'string' },
//         data: { type: 'array', items: { $ref: '#/components/schemas/Room' } },
//       },
//     },
//   })
//   async index(ctx: HttpContext) {
//     const page = await ctx.request.input('page', 1)
//     // Menggunakan paginate untuk konsistensi dengan FacilityController
//     const data = await Room.query().preload('bookings').paginate(page, 10)

//     ctx.response.ok({
//       success: true,
//       message: 'Rooms successfully obtained',
//       data,
//     })
//   }

//   // ==============================
//   // GET: /rooms/:id
//   // ==============================
//   @ApiOperation({ summary: 'Get Room by ID' })
//   @ApiResponse({
//     status: 200,
//     schema: {
//       type: 'object',
//       properties: {
//         success: { type: 'boolean' },
//         message: { type: 'string' },
//         data: { $ref: '#/components/schemas/Room' },
//       },
//     },
//   })
//   async show(ctx: HttpContext) {
//     const id = ctx.params.id
//     const data = await Room.query()
//       .where('id', id)
//       .preload('bookings', (b) => {
//         b.preload('fasilitas') // Asumsi relasi 'fasilitas' ada
//         b.preload('user')
//       })
//       .firstOrFail()

//     ctx.response.ok({
//       success: true,
//       message: `Room with id ${id} has been found`,
//       data,
//     })
//   }

//   // ==============================
//   // POST: /rooms (Hanya Admin)
//   // ==============================
//   @ApiOperation({ summary: 'Create a new Room' })
//   @ApiBody({ type: () => RoomCreate })
//   @ApiResponse({
//     status: 201, // Menggunakan 201 Created untuk POST
//     schema: {
//       type: 'object',
//       properties: {
//         success: { type: 'boolean' },
//         message: { type: 'string' },
//       },
//       example: `{
//   "success": true,
//   "message": "Room created successfully"
// }`,
//     },
//   })
//   async store(ctx: HttpContext) {
//     // 1. Validasi Input menggunakan Validator
//     const payload = await ctx.request.validateUsing(RoomCreate)

//     // 2. Buat Room baru
//     await Room.create(payload)

//     ctx.response.created({
//       // Menggunakan .created()
//       success: true,
//       message: 'Room created successfully',
//     })
//   }

//   // ==============================
//   // PUT/PATCH: /rooms/:id (Hanya Admin)
//   // ==============================
//   @ApiOperation({ summary: 'Update Room by ID' })
//   @ApiBody({ type: () => RoomUpdate })
//   @ApiResponse({
//     status: 200,
//     schema: {
//       type: 'object',
//       properties: {
//         success: { type: 'boolean' },
//         message: { type: 'string' },
//       },
//       example: `{
//   "success": true,
//   "message": "Room updated successfully"
// }`,
//     },
//   })
//   async update(ctx: HttpContext) {
//     const id = ctx.params.id
//     // 1. Validasi Input menggunakan Validator
//     const payload = await ctx.request.validateUsing(RoomUpdate)

//     // 2. Cari dan Perbarui Room
//     const room = await Room.findOrFail(id)
//     room.merge(payload)
//     await room.save()

//     ctx.response.ok({
//       success: true,
//       message: 'Room updated successfully',
//     })
//   }

//   // ==============================
//   // DELETE: /rooms/:id (Hanya Admin)
//   // ==============================
//   @ApiOperation({ summary: 'Delete Room by ID' })
//   @ApiResponse({
//     status: 200,
//     schema: {
//       type: 'object',
//       properties: {
//         success: { type: 'boolean' },
//         message: { type: 'string' },
//       },
//       example: `{
//   "success": true,
//   "message": "Room deleted successfully"
// }`,
//     },
//   })
//   async destroy(ctx: HttpContext) {
//     const id = ctx.params.id
//     const room = await Room.findOrFail(id)
//     await room.delete()

//     ctx.response.ok({
//       success: true,
//       message: 'Room deleted successfully',
//     })
//   }

//   // ==============================
//   // GET: /rooms-map (Data Map Admin/Umum)
//   // ==============================
//   @ApiOperation({ summary: 'Get active booking location' })
//   @ApiResponse({
//     status: 200,
//     // ... (skema API Response)
//   })
//   async mapData(ctx: HttpContext) {
//     const rooms = await Room.all()

//     const mapData = await Promise.all(
//       rooms.map(async (room) => {
//         // Query hanya booking aktif ('Picked Up')
//         const activeBookings = await Booking.query()
//           .where('id_room', room.id)
//           .where('status', 'Picked Up') // KUNCI MARKER
//           .preload('fasilitas')
//           .preload('user')

//         // PERBAIKAN KRITIS: Convert String/Decimal dari DB ke Number untuk Frontend
//         const longitude = Number(room.longitude)
//         const latitude = Number(room.latitude)

//         return {
//           id: room.id,
//           room_name: room.roomName,
//           // Menggunakan nilai yang sudah di-cast
//           longitude: longitude,
//           latitude: latitude,
//           borrowed_facilities_count: activeBookings.length,
//           // Memformat active_bookings agar sesuai tipe data frontend
//           active_bookings: activeBookings.map(b => ({
//             id: b.id,
//             status: b.status,
//             fasilitas: { name: b.fasilitas.name, type: b.fasilitas.type },
//             user: { username: b.user.username }
//           })),
//         }
//       })
//     )

//     // Logika filter frontend akan menyaring yang count > 0, jadi kita kirim semua data Room
//     ctx.response.ok({
//       success: true,
//       message: 'Active room map data successfully obtained',
//       data: mapData,
//     })
//   }
// }

import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import Booking from '#models/booking'
import RoomsValidator from '#validators/room' // Asumsi path ke RoomsValidator Anda
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'
import web_socket_service from '#services/web_socket_service'

// Ambil skema kompilasi dari RoomsValidator
const RoomCreate = RoomsValidator.create
const RoomUpdate = RoomsValidator.update

@ApiSecurity('BearerAuth') // Mengikuti referensi FacilityController
@ApiResponse({ status: 404, description: 'Not Found' })
export default class RoomsController {
  // ==============================
  // GET: /rooms
  // ==============================
  @ApiOperation({ summary: 'List all Rooms' })
  @ApiSecurity('false') // Jika endpoint index/show bisa diakses publik/tanpa auth (sesuaikan dengan routes Anda)
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Room' } },
      },
    },
  })
  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    // Menggunakan paginate untuk konsistensi dengan FacilityController
    const data = await Room.query().preload('bookings').paginate(page, 10)

    ctx.response.ok({
      success: true,
      message: 'Rooms successfully obtained',
      data,
    })
  }

  // ==============================
  // GET: /rooms/:id
  // ==============================
  @ApiOperation({ summary: 'Get Room by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/Room' },
      },
    },
  })
  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await Room.query()
      .where('id', id)
      .preload('bookings', (b) => {
        b.preload('fasilitas') // Asumsi relasi 'fasilitas' ada
        b.preload('user')
      })
      .firstOrFail()

    ctx.response.ok({
      success: true,
      message: `Room with id ${id} has been found`,
      data,
    })
  }

  // ==============================
  // POST: /rooms (Hanya Admin)
  // ==============================
  @ApiOperation({ summary: 'Create a new Room' })
  @ApiBody({ type: () => RoomCreate })
  @ApiResponse({
    status: 201, // Menggunakan 201 Created untuk POST
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  "success": true,
  "message": "Room created successfully"
}`,
    },
  })
  async store(ctx: HttpContext) {
    // 1. Validasi Input menggunakan Validator
    const payload = await ctx.request.validateUsing(RoomCreate)

    // 2. Buat Room baru
    await Room.create(payload)

    web_socket_service?.io?.emit('roomReload')

    ctx.response.created({
      // Menggunakan .created()
      success: true,
      message: 'Room created successfully',
    })
  }

  // ==============================
  // PUT/PATCH: /rooms/:id (Hanya Admin)
  // ==============================
  @ApiOperation({ summary: 'Update Room by ID' })
  @ApiBody({ type: () => RoomUpdate })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  "success": true,
  "message": "Room updated successfully"
}`,
    },
  })
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    // 1. Validasi Input menggunakan Validator
    const payload = await ctx.request.validateUsing(RoomUpdate)

    // 2. Cari dan Perbarui Room
    const room = await Room.findOrFail(id)
    room.merge(payload)
    await room.save()

    web_socket_service?.io?.emit('roomReload')

    ctx.response.ok({
      success: true,
      message: 'Room updated successfully',
    })
  }

  // ==============================
  // DELETE: /rooms/:id (Hanya Admin)
  // ==============================
  @ApiOperation({ summary: 'Delete Room by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
      example: `{
  "success": true,
  "message": "Room deleted successfully"
}`,
    },
  })
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const room = await Room.findOrFail(id)
    await room.delete()

    web_socket_service?.io?.emit('roomReload')

    ctx.response.ok({
      success: true,
      message: 'Room deleted successfully',
    })
  }

  // ==============================
  // GET: /rooms-map (Data Map Admin/Umum)
  // ==============================
  @ApiOperation({ summary: 'Get active booking location' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
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
              // ... detail booking aktif
            },
          },
        },
      },
    },
  })
  async mapData(ctx: HttpContext) {
    const rooms = await Room.all()

    const mapData = await Promise.all(
      rooms.map(async (room) => {
        // Query hanya booking aktif ('Borrowed', disesuaikan jika status Anda berbeda)
        const activeBookings = await Booking.query()
          .where('id_room', room.id)
          .where('status', 'Picked Up') // Menggunakan 'Picked Up' (sesuai lifecycle umum) atau 'Borrowed'
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

    ctx.response.ok({
      success: true,
      message: 'Active room map data successfully obtained',
      data: mapData,
    })
  }
}
