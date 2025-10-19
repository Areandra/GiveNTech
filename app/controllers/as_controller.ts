import Booking from '#models/booking'
import type { HttpContext } from '@adonisjs/core/http'

export default class AsController {
    async index({ request, inertia }: HttpContext) {
        const page = request.input('page', 1)
        return inertia.render('admin/dashboard', {
            booking: (await Booking.query().paginate(page)).toJSON().data
        })
    }
}