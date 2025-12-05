/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
const FasilitiesController = () => import('#controllers/fasilities_controller')
const UsersController = () => import('#controllers/users_controller')
const BookingsController = () => import('#controllers/bookings_controller')
const UsController = () => import('#controllers/us_controller')
const RoomsController = () => import('#controllers/rooms_controller')
router.on('/').redirect('/facilities')

router.group(() => {
  router.get('/login/oauth/google', '#controllers/auth_controller.oauth2Session')
  router.get('/login/oauth/google/callback', '#controllers/auth_controller.oauth2SessionCallback')
  router.get('/login', '#controllers/views_controller.login')
  router.get('/register', '#controllers/views_controller.register')
  router
    .group(() => {
      router.get('/facilities', '#controllers/views_controller.facility')
      router.get('/booking/:id/qr', '#controllers/views_controller.bookingQR')
      router.get('/qrReader', '#controllers/views_controller.qrReader')
    })
    .use(middleware.auth({ guards: ['web'] }))
})

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')
router.get('/oauth/google/token', [AuthController, 'oauth2'])
router.get('/oauth/google/token/callback', '#controllers/auth_controller.oauth2Callback')

router
  .group(() => {
    router
      .group(() => {
        router
          .resource('/facility', FasilitiesController)
          .apiOnly()
          .except(['index', 'show'])
          .use('*', middleware.roleBasedAcsess(['admin']))
        router.resource('/facility', FasilitiesController).apiOnly().only(['index', 'show'])

        router
          .resource('/booking', BookingsController)
          .apiOnly()
          .use('*', middleware.roleBasedAcsess(['admin']))

        router
          .resource('/user', UsersController)
          .apiOnly()
          .except(['store'])
          .use('index', middleware.roleBasedAcsess(['admin']))

        router
          .resource('/room', RoomsController)
          .apiOnly()
          .except(['index', 'show'])
          .use('*', middleware.roleBasedAcsess(['admin']))
        router.get('/room/mapData', [RoomsController, 'mapData'])
        router.resource('/room', RoomsController).apiOnly().only(['index', 'show'])

        router
          .group(() => {
            router.get('/', [UsController, 'me'])
            router.post('/', [UsController, 'updateMe'])
            router.delete('/', [UsController, 'destroyMe'])

            router.get('/booking', [UsController, 'listBookings'])
            router.post('/booking', [UsController, 'createBooking'])
            router.get('/booking/:id', [UsController, 'getBooking'])
            router.post('/booking/:id', [UsController, 'updateBooking'])
            router.delete('/booking/:id', [UsController, 'destroyBooking'])
          })
          .prefix('me')
      })
      .use(middleware.auth({ guards: ['api', 'web'] }))
    router
      .resource('/user', UsersController)
      .apiOnly()
      .only(['store'])
      .use('store', middleware.auth({ dinamis: true }))
  })
  .prefix('/api/v1')

router.get('/docs', '#controllers/open_apis_controller.html')
router.get('/docs.json', '#controllers/open_apis_controller.json')
router.get('/docs.yml', '#controllers/open_apis_controller.yaml')

router.get('/redirect/*', async ({ params, response }) => {
  const path = params['*']
  return response.redirect(`/${path}`)
})


router.get('/dashboard', '#controllers/dashboard_controller.index')

router.get('/booking', ({ inertia }) => {
  return inertia.render('booking')
})

router.get('/user-Dashboard', ({ inertia }) => {
  return inertia.render('userDashboard')
})

router.get('/user-Facility', ({ inertia }) => {
  return inertia.render('userFacility')
})

router.get('/booking-Form', ({ inertia }) => {
  return inertia.render('bookingForm')
})

router.get('/booking-History', ({ inertia }) => {
  return inertia.render('bookingHistory')
})
