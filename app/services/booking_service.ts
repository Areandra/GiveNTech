import Booking from '#models/booking'
import Facility from '#models/facility'
import User from '#models/user'
import sendMessege from './whatsapp_cloud_api_service.js'

class BookingService {
  private bookingQuery(userId?: number) {
    let query = Booking.query()
      .preload('user')
      .preload('fasilitas')
      .preload('approver')
      .preload('rooms')
    if (userId) query = query.where('idUser', userId)
    return query
  }

  public async getBookings(options: { userId?: number; page?: number } = {}) {
    return this.bookingQuery(options.userId)
  }

  public async createBooking(bookingData: any, userId?: number) {
    const facility = await Facility.find(bookingData.idFacility)
    if (!facility) throw new Error('Facility not found')
    if (facility.status !== 'Available') throw new Error('Facility not available')

    const booking = await Booking.create({
      ...bookingData,
      idUser: userId || bookingData.idUser,
      status: bookingData.status || 'Pending',
    })

    const admins = await User.query().where('role', 'admin')

    const messagePromises = admins.map((admin) => {
      return sendMessege(
        admin.phoneNumber,
        `Ada Booking baru nih min Cek Apps untuk melanjutkan konfirmasi`
      )
    })

    await Promise.all(messagePromises)

    facility.status = 'Booked'
    await facility.save()

    return booking
  }

  public async updateBooking(bookingId: number, updateData: any, userId?: number) {
    const booking = await Booking.find(bookingId)
    if (!booking) throw new Error('Booking not found')
    await booking?.load('user')
    await booking?.load('fasilitas')
    const user = await User.findOrFail(booking!.idUser)

    if (userId && booking.idUser !== userId) throw new Error('Unauthorized')

    const facility = await Facility.find(booking.idFacility)
    if (!facility) throw new Error('Facility not found')

    const oldStatus = booking.status
    const newStatus = updateData.status || oldStatus

    booking.merge(updateData)
    await booking.save()

    switch (newStatus) {
      case 'Pending':
      case 'Confirmed':
        facility.status = 'Booked'
        await sendMessege(
          user.phoneNumber,
          `Booking Kamu dengan nama fasilitas: ${booking.fasilitas.name} sudah di konfirmasi admin silahkan ambil barang anda (QRCode Tersedia di Halaman Booking anda)`
        )
        break
      case 'Picked Up':
        facility.status = 'Borrowed'
        break
      case 'Returned':
        facility.status = 'Under Inspection'
        break
      case 'Cancelled':
        await sendMessege(
          user.phoneNumber,
          `Booking Kamu dengan nama fasilitas: ${booking.fasilitas.name} di tolak admin silahkan coba booking fasilitas lain`
        )
        facility.status = 'Available'
        break
      case 'Done':
        facility.status = 'Available'
        break
      case 'Penalized':
        facility.status = 'Damaged'
        break
    }

    await facility.save()
    return booking
  }

  public async deleteBooking(bookingId: number, userId?: number) {
    const booking = await Booking.find(bookingId)
    if (!booking) throw new Error('Booking not found')

    if (userId && booking.idUser !== userId) throw new Error('Unauthorized')

    const facility = await Facility.find(booking.idFacility)
    if (facility && ['Pending', 'Confirmed', 'Picked Up'].includes(booking.status)) {
      facility.status = 'Available'
      await facility.save()
    }

    await booking.delete()
    return booking
  }

  public async getBooking(bookingId: number, userId?: number) {
    const booking = await this.bookingQuery(userId).where('id', bookingId).first()
    if (!booking) throw new Error('Booking not found')
    return booking
  }
}

export default new BookingService()
