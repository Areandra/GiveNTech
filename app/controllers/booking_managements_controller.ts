import type { HttpContext } from '@adonisjs/core/http'

export default class BookingManagementController {
  async index({ inertia }: HttpContext) {
    console.log('=== BOOKING PAGE ACCESSED ===')
    return inertia.render('booking_management')
  }
}