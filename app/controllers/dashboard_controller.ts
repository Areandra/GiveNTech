// app/controllers/dashboard_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    // Kirim data awal ke frontend
    return inertia.render('dashboard', {
      // Data initial untuk dashboard
      initialStats: {
        totalFacilities: 12,
        todayBookings: 5,
        totalBookings: 128
      },
      user: {
        name: 'Admin GivenTech',
        role: 'Administrator'
      }
    })
  }
}