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
const ViewsController = () => import('#controllers/views_controller')
router.on('/home').renderInertia('home')

router.group(() => {
  router.get('/login/oauth/google', [AuthController, 'oauth2Session'])
  router.get('/login/oauth/google/callback', [AuthController, 'oauth2SessionCallback'])
  router.get('/login', [ViewsController, 'login'])
  router.get('/register', [ViewsController, 'register'])
  router.get('/facilities', [ViewsController, 'facility'])
})

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')
router.get('/oauth/google/token', [AuthController, 'oauth2'])
router.get('/oauth/google/token/callback', [AuthController, 'oauth2Callback'])

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

router.get('/booking/:id/qr', '#controllers/views_controller.bookingQR')
router.get('/qrReader', '#controllers/views_controller.qrReader')

router.on('/').renderInertia('home')
