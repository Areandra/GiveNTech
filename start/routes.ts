/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import BookingsController from '#controllers/bookings_controller'
import FasilitasController from '#controllers/fasilitas_controller'
import UserController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/users', [UserController, 'index'])

router.get('/users/:id', [UserController, 'show'])

router.post('/users', [UserController, 'store'])

router.get('/fasilitas', [FasilitasController, 'index'])

router.get('/fasilitas/:id', [FasilitasController, 'show'])

router.post('/fasilitas', [FasilitasController, 'store'])

router.get('/bookings', [BookingsController, 'index'])

router.get('/bookings/:id', [BookingsController, 'show'])

router.post('/bookings', [BookingsController, 'store'])
