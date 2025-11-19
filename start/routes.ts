/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
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
        router.resource('/facility', FasilitiesController).apiOnly()
        router.resource('/booking', BookingsController).apiOnly()
        router.resource('/user', UsersController).apiOnly()
      })
      .prefix('/v1')
  })
  .prefix('/api')
  .use(middleware.auth())
  .use(middleware.roleBasedAcsess(['user', 'admin', 'super_admin']))

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/update', [AuthController, 'updateProfile'])
    router.delete('/:id', [AuthController, 'destroyAccount'])
  })
  .prefix('/auth')
