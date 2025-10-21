import Booking from '#models/booking'
import Fasilitas from '#models/fasilita'
import { createBookingsValidator } from '#validators/booking'
import type { HttpContext } from '@adonisjs/core/http'

export default class BookingsController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    return Booking.query().paginate(page)
  }

  async store({ request, auth, response }: HttpContext) {
    const validData = await request.validateUsing(createBookingsValidator)
    const users = auth.user

    if (!users?.id) {
      return response.unauthorized({ message: 'User belum login' })
    }

    Fasilitas.findOrFail(validData.id_fasilitas).then(async (fasilitas) => {
      if (fasilitas.status !== 'Tersedia') {
        return response.badRequest({ message: 'Fasilitas tidak tersedia untuk dipinjam' })
      } else {
        fasilitas.status = 'Di Reservasi'
        await fasilitas.save()
      }
    })

    return Booking.create({ ...validData, id_user: users?.id })
  }

  async update({ request, params, response }: HttpContext) {
    const bookingId = params.id

    const booking = await Booking.findOrFail(bookingId)

    booking.merge(request.only(['no_ruang', 'tanggal_kembali', 'status']))
    await booking.save()

    return response.ok({
      message: 'booking updated successfully',
      data: booking,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const bookingId = decodeURI(params.id)

    const booking = await Booking.findOrFail(bookingId)

    const deletedBooking = booking

    booking.delete()

    return response.ok({
      message: 'booking delete successfully',
      data: deletedBooking,
    })
  }

  async show({ params }: HttpContext) {
    return Booking.findOrFail(params.id)
  }
}
