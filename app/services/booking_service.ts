import Booking from '#models/booking'
import Facility from '#models/facility'

export default class BookingService {
  /**
   * List paginated bookings
   */
  public async listBookings(page = 1) {
    return Booking.query().preload('user').preload('fasilitas').paginate(page)
  }

  /**
   * Create a new booking
   */
  public async createBooking(userId: number, bookingData: Partial<Booking>) {
    const facility = await Facility.find(bookingData.idFacility)
    if (!facility) throw new Error('Facility not found')
    if (facility.status !== 'Available') throw new Error('Facility not available')

    // Set booking status & facility status
    const booking = await Booking.create({
      ...bookingData,
      idUser: userId,
      status: bookingData.status || 'Pending',
    })

    // Update facility status: Pending → Borrowed/Booked
    facility.status = 'Borrowed'
    await facility.save()

    return booking
  }

  /**
   * Update booking with automatic facility status
   */
  public async updateBooking(bookingId: number, updateData: Partial<Booking>) {
    const booking = await Booking.find(bookingId)
    if (!booking) throw new Error('Booking not found')

    const facility = await Facility.find(booking.idFacility)
    if (!facility) throw new Error('Facility not found')

    const oldStatus = booking.status
    const newStatus = updateData.status || oldStatus

    booking.merge(updateData)
    await booking.save()

    // Update facility based on new booking status
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

  /**
   * Delete booking and reset facility if necessary
   */
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

  /**
   * Get single booking with relations
   */
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
