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
import UsersController from '#controllers/users_controller'
router.on('/').renderInertia('home')

router
  .group(() => {
    router
      .group(() => {
        router
          .resource('/facility', () => import('#controllers/fasilities_controller'))
          .apiOnly()
          .use('*', middleware.roleBasedAcsess(['admin', 'super_admin']))
          .except(['index', 'show'])
        router
          .resource('/booking', () => import('#controllers/bookings_controller'))
          .apiOnly()
          .use('*', middleware.roleBasedAcsess(['admin', 'super_admin']))
          .except(['index', 'show'])
        router
          .resource('/user', UsersController)
          .apiOnly()
          .except(['store'])
          .use('index', middleware.roleBasedAcsess(['admin', 'super_admin']))
      })
      .use(middleware.auth())

    router
      .post('/user', '#controllers/users_controller.store')
      .use(middleware.auth({ dinamis: true }))
  })
  .prefix('/api/v1')

router
  .group(() => {
    router.post('/login', '#controllers/users_controller.login')
  })
  .prefix('/auth')
