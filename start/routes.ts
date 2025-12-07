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

router.group(() => {
  router.get('/login/oauth/google', '#controllers/auth_controller.oauth2Session')
  router.get('/login/oauth/google/callback', '#controllers/auth_controller.oauth2SessionCallback')
  router.get('/login', '#controllers/views_controller.login')
  router.get('/register', '#controllers/views_controller.register')
  router.post('/login', '#controllers/auth_controller.sessionLogin')
  router.post('/register', '#controllers/auth_controller.sessionRegister')
  router.get('/forgot-password', '#controllers/views_controller.forgotPassword')
  router.post('/logout', async ({ auth, response }) => {
    await auth.use('web').logout()
    return response.redirect('/login')
  })
  router
    .group(() => {
      router.get('/dashboard', '#controllers/views_controller.dashboard')
      router.get('/booking', '#controllers/views_controller.booking')
      router.get('/booking/:bookingId/edit', '#controllers/views_controller.bookingEdit')
      router.get('/facilities', '#controllers/views_controller.facility')
      router.get('/facilities/create', '#controllers/views_controller.facilityForm')
      router.get('/facilities/:facilityId/edit', '#controllers/views_controller.facilityEdit')
      router.get('/qrScanner', '#controllers/views_controller.qrReader')
      router.get('/map', '#controllers/views_controller.map')
      router.get('/room', '#controllers/views_controller.room')
      router.get('/room/create', '#controllers/views_controller.roomForm')
      router.get('/room/:roomId/edit', '#controllers/views_controller.roomEdit')
    })
    .use(middleware.auth({ guards: ['web'] }))
    .use(middleware.roleBasedAcsess(['admin']))

  router
    .group(() => {
      router.get('/user/dashboard', '#controllers/views_controller.userDashboard')
      router.get('/user/facilities', '#controllers/views_controller.userFacilities')
      router.get('/user/booking/history', '#controllers/views_controller.userHistory')
      router.get('/booking/create/:facilityId', '#controllers/views_controller.bookingForm')
    })
    .use(middleware.auth({ guards: ['web'] }))
    .use(middleware.roleBasedAcsess(['user']))

  router
    .group(() => {
      router.get('/booking/:id/qr', '#controllers/views_controller.bookingQR')
      router.get('/booking/:id', '#controllers/views_controller.detailBooking')
    })
    .use(middleware.auth({ guards: ['web'] }))
    .use(middleware.roleBasedAcsess(['user', 'admin']))
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

router
  .get('/', (ctx) => {
    const role = ctx.auth.user?.role

    switch (role) {
      case 'admin':
        return ctx.response.redirect('/dashboard')
      case 'user':
        return ctx.response.redirect('/user/dashboard')
    }
  })
  .use(middleware.auth({ guards: ['web'] }))

router.post('/auth/forgot-password', [AuthController, 'sendOtp'])
router.put('/auth/forgot-password', [AuthController, 'verifyOtp'])
