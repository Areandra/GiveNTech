import AsController from '#controllers/as_controller'
import UsController from '#controllers/us_controller'
import BookingsController from '#controllers/bookings_controller'
import FasilitasController from '#controllers/fasilitas_controller'
import UserController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from './kernel.js'

router.on('/').redirectToPath('/login')
router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.get('/users', [UserController, 'index'])
            router
              .group(() => {
                router.post('/', [FasilitasController, 'store'])
                router.put('/:id', [FasilitasController, 'update'])
                router.delete('/:id', [FasilitasController, 'delete'])
              })
              .prefix('/fasilitas')
            router
              .group(() => {
                router.put('/:id', [BookingsController, 'update'])
                router.delete('/:id', [BookingsController, 'destroy'])
              })
              .prefix('/bookings')
          })
          .use(middleware.roleBasedAcsess(['admin', 'super_admin']))

        router
          .group(() => {
            router
              .group(() => {
                router.get('/:username/provide', [UserController, 'provide'])
                router.get('/:username/revoke', [UserController, 'revoke'])
              })
              .use(middleware.roleBasedAcsess(['super_admin']))
            router.get('/:username', [UserController, 'show'])
            router.put('/:username', [UserController, 'update'])
          })
          .prefix('/users')
        router.post('/bookings', [BookingsController, 'store'])
      })
      .use(middleware.auth())

    router.get('/fasilitas', [FasilitasController, 'index'])

    router.get('/fasilitas/:id', [FasilitasController, 'show'])

    router.get('/bookings', [BookingsController, 'index'])

    router.get('/bookings/:id', [BookingsController, 'show'])
  })
  .prefix('/api')

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])

    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout'])
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('/google', [AuthController, 'oauth'])

    router.get('/google/callback', [AuthController, 'oauthCallback'])
  })
  .prefix('/oauth')

router.group(() => {
  router
    .group(() => {
      router.get('/dashboard', [AsController, 'dashboard'])
      router.get('/booking', [AsController, 'booking'])
      router.get('/users', [AsController, 'user'])
      router.get('/fasilitas', [AsController, 'fasilitas'])
    })
    .prefix('/admin')
    .use(middleware.auth('frontend'))
    .use(middleware.roleBasedAcsess(['admin', 'super_admin']))

  router
    .group(() => {
      router.get('/index', [UsController, 'dashboard'])
      router.get('/booking', [UsController, 'booking'])
      router.get('/fasilitas', [UsController, 'fasilitas'])
      router.get('/profile', [UsController, 'profile'])
    })
    .prefix('/user')
    .use(middleware.auth('frontend'))
    .use(middleware.roleBasedAcsess(['user']))
})

router.on('/login').renderInertia('auth/login')
router.on('/register').renderInertia('auth/register')
