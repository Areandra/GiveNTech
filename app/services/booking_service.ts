import Booking from '#models/booking'
import Facility from '#models/facility'
class BookingService {

  public async listBookings(page = 1) {
    return Booking.query().preload('user').preload('fasilitas').preload('rooms').paginate(page)
  }

  public async meListBookings(userId: number ,page = 1) {
    return Booking.query().where('id', userId).preload('fasilitas').paginate(page)
  }

  public async createBooking(userId: number, bookingData: any ) {
    const facility = await Facility.find(bookingData.idFacility)
    if (!facility) throw new Error('Facility not found')
    if (facility.status !== 'Available') throw new Error('Facility not available')

    const booking = await Booking.create({
      ...bookingData,
      idUser: userId,
      status: bookingData.status || 'Pending',
    })

    facility.status = 'Borrowed'
    await facility.save()

    return booking
  }

  public async updateBooking(bookingId: number, updateData: any) {
    const booking = await Booking.find(bookingId)
    if (!booking) throw new Error('Booking not found')

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
        break
      case 'Picked Up':
        facility.status = 'Borrowed'
        break
      case 'Returned':
        facility.status = 'Under Inspection'
        break
      case 'Cancelled':
      case 'Done':
        facility.status = 'Available'
        break
      case 'Penalized':
        facility.status = 'Damaged'
        break
      default:
        break
    }

    await facility.save()
    return booking
  }

  public async deleteBooking(bookingId: number) {
    const booking = await Booking.find(bookingId)
    if (!booking) throw new Error('Booking not found')

    const facility = await Facility.find(booking.idFacility)
    if (facility && ['Pending', 'Confirmed', 'Picked Up'].includes(booking.status)) {
      facility.status = 'Available'
      await facility.save()
    }

    await booking.delete()
    return booking
  }

  public async getBooking(bookingId: number) {
    const booking = await Booking.query()
      .where('id', bookingId)
      .preload('user')
      .preload('approver')
      .preload('fasilitas')
      .first()

    if (!booking) throw new Error('Booking not found')
    return booking
  }
}

export default new BookingService()
