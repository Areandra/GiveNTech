import type { HttpContext } from '@adonisjs/core/http'
import Fasilitas from '#models/fasilita'

export default class UsController {
  async dashboard({ auth, inertia }: HttpContext) {
    const user = auth.user!
    await user.load('bookings', (bookingsQuery) => {
      bookingsQuery
        .select(['id', 'id_fasilitas', 'tgl_pinjam', 'tgl_kembali', 'status'])
        .preload('fasilitas', (fasilitasQuery) => {
          fasilitasQuery.select(['id', 'nama'])
        })
    })

    return inertia.render('user/dashboard', {
      user: user.serialize(),
    })
  }
  async booking({ auth, inertia }: HttpContext) {
    const user = auth.user!
    await user.load('bookings', (bookingsQuery) => {
      bookingsQuery
        .select(['id', 'id_fasilitas', 'tgl_pinjam', 'tgl_kembali', 'status'])
        .preload('fasilitas', (fasilitasQuery) => {
          fasilitasQuery.select(['id', 'nama'])
        })
    })

    return inertia.render('user/booking', {
      user: user.serialize(),
    })
  }
  async fasilitas({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)

    return inertia.render('user/fasilitas', {
      fasilitas: (await Fasilitas.query().paginate(page)).toJSON().data,
    })
  }

  async profile({ auth, inertia }: HttpContext) {
    const user = auth.user!

    return inertia.render('user/profile', {
      user,
    })
  }
}
