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
router.on('/').renderInertia('home')

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

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
      })
      .use(middleware.auth())
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
