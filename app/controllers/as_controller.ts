import Booking from '#models/booking'
import Fasilitas from '#models/fasilita'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AsController {
    async dashboard({ request, inertia }: HttpContext) {
        const page = request.input('page', 1)
        return inertia.render('admin/dashboard', {
            bookings: (await Booking.query().paginate(page)).toJSON().data,
            fasilitas: (await Fasilitas.query().paginate(page)).toJSON().data,
            users: (await User.query().paginate(page)).toJSON().data,
        })
    }
    async booking({ request, inertia }: HttpContext) {
        const page = request.input('page', 1)
        return inertia.render('admin/booking', {
            bookings: (
                await Booking.query()
                    .preload('user', (userQuery) => {
                        userQuery.select(['id', 'username']) // ambil hanya kolom yang dibutuhkan
                    })
                    .paginate(page)
            ).toJSON().data,
        })
    }
    async user({ request, inertia }: HttpContext) {
        const page = request.input('page', 1)
        return inertia.render('admin/user', {
            users: (await User.query().paginate(page)).toJSON().data,
        })
    }
    async fasilitas({ request, inertia }: HttpContext) {
        const page = request.input('page', 1)
        return inertia.render('admin/fasilitas', {
            fasilitas: (await Fasilitas.query().paginate(page)).toJSON().data,
        })
    }
    // async store({ request, inertia }: HttpContext) {
    //     return Booking.create(request.all())
    // }
}
