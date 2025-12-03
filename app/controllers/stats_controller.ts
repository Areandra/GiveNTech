// app/controllers/stats_controller.ts
import { HttpContext } from '@adonisjs/core/http'

export default class StatsController {
  async index({ response }: HttpContext) {
    // DATA KOSONG
    return response.json({
      totalFacilities: 0,
      todayBookings: 0,
      activeFacilities: 0,
      message: 'No facilities data yet',
      timestamp: new Date().toISOString()
    })
  }
  
  async facilities({ response }: HttpContext) {
    // KOSONG - array kosong
    return response.json([])
  }
}