/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import BookingsController from '#controllers/bookings_controller'
import FasilitiesController from '#controllers/fasilities_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
router.on('/').renderInertia('home')

router
  .group(() => {
    router
      .group(() => {
        router
          .resource('/facility', FasilitiesController)
          .apiOnly()
          .use('*', middleware.roleBasedAcsess(['admin', 'super_admin']))
          .except(['index', 'show'])
        router
          .resource('/booking', BookingsController)
          .apiOnly()
          .use('*', middleware.roleBasedAcsess(['admin', 'super_admin']))
          .except(['index', 'show'])
        router
          .resource('/user', UsersController)
          .apiOnly().except(['store'])
          .use('index', middleware.roleBasedAcsess(['admin', 'super_admin']))
      })
      .use(middleware.auth())

    router.post('/user', [UsersController, 'store']).use(middleware.auth({ dinamis: true }))
  })
  .prefix('/api/v1')

router
  .group(() => {
    router.post('/login', [UsersController, 'login'])
  })
  .prefix('/auth')
