// /*
// |--------------------------------------------------------------------------
// | Routes file
// |--------------------------------------------------------------------------
// |
// | The routes file is used for defining the HTTP routes.
// |
// */

// import router from '@adonisjs/core/services/router'
// import { middleware } from './kernel.js'
// const AuthController = () => import('#controllers/auth_controller')
// const FasilitiesController = () => import('#controllers/fasilities_controller')
// const UsersController = () => import('#controllers/users_controller')
// const BookingsController = () => import('#controllers/bookings_controller')
// router.on('/').renderInertia('home')

// router
//   .group(() => {
//     router.post('/login', [AuthController, 'login'])
//   })
//   .prefix('/auth')

// router
//   .group(() => {
//     router
//       .group(() => {
//         router
//           .resource('/facility', FasilitiesController)
//           .apiOnly()
//           .except(['index', 'show'])
//           .use('*', middleware.roleBasedAcsess(['admin']))
//         router.resource('/facility', FasilitiesController).apiOnly().only(['index', 'show'])
//         router
//           .resource('/booking', BookingsController)
//           .apiOnly()
//           .use('*', middleware.roleBasedAcsess(['admin']))
//         router
//           .resource('/user', UsersController)
//           .apiOnly()
//           .except(['store'])
//           .use('index', middleware.roleBasedAcsess(['admin']))
//       })
//       .use(middleware.auth())
//     router
//       .resource('/user', UsersController)
//       .apiOnly()
//       .only(['store'])
//       .use('store', middleware.auth({ dinamis: true }))
//   })
//   .prefix('/api/v1')

// router.get('/docs', '#controllers/open_apis_controller.html')
// router.get('/docs.json', '#controllers/open_apis_controller.json')
// router.get('/docs.yml', '#controllers/open_apis_controller.yaml')


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
const RoomsController = () => import('#controllers/rooms_controller') // Ditambahkan

router.on('/').renderInertia('home')

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

router
  .group(() => {
    // --- START: GROUP YANG MEMBUTUHKAN AUTHENTICATION (ADMIN & UMUM) ---
    router
      .group(() => {
        // --- START: ROUTES KHUSUS UNTUK ADMIN (ROLE BASED ACCESS) ---
        router
          .group(() => {
            // Fasility: CREATE, UPDATE, DELETE (HANYA ADMIN)
            router
              .resource('/facility', FasilitiesController)
              .apiOnly()
              .except(['index', 'show'])

            // Booking: CRUD (HANYA ADMIN)
            router.resource('/booking', BookingsController).apiOnly()

            // User: INDEX (HANYA ADMIN)
            router.get('/user', [UsersController, 'index'])

            // --- START: ROOMS ROUTES UNTUK ADMIN (CRUD) ---
            router.post('/rooms', [RoomsController, 'store'])
            router.put('/rooms/:id', [RoomsController, 'update'])
            router.delete('/rooms/:id', [RoomsController, 'destroy'])
            router.get('/maps', '#controllers/rooms_controller.mapData')
            // router.get('/rooms-map', [RoomsController, 'mapData']) // Untuk data map (Admin/Umum)
            // --- END: ROOMS ROUTES UNTUK ADMIN ---
          })
          .use(middleware.roleBasedAcsess(['admin']))

        // Fasility: INDEX, SHOW (UMUM/SEMUA USER TEROTENTIKASI)
        router.resource('/facility', FasilitiesController).apiOnly().only(['index', 'show'])

        // User: SHOW, UPDATE, DESTROY (CRUD user non-admin)
        router.resource('/user', UsersController).apiOnly().except(['index', 'store'])

        // --- START: ROOMS ROUTES UNTUK UMUM (INDEX & SHOW) ---
        router.get('/rooms', [RoomsController, 'index'])
        router.get('/rooms/:id', [RoomsController, 'show'])
        // --- END: ROOMS ROUTES UNTUK UMUM ---
      })
      .use(middleware.auth()) // Middleware otentikasi untuk semua route di atas
    // --- END: GROUP YANG MEMBUTUHKAN AUTHENTICATION ---

    // User: STORE (TANPA AUTH, atau dengan AUTH dinamis, seperti yang Anda tentukan)
    router
      .resource('/user', UsersController)
      .apiOnly()
      .only(['store'])
      .use('store', middleware.auth({ dinamis: true })) // Biasanya register
  })
  .prefix('/api/v1') // Prefix untuk semua API

// Open API Documentation routes
router.get('/docs', '#controllers/open_apis_controller.html')
router.get('/docs.json', '#controllers/open_apis_controller.json')
router.get('/docs.yml', '#controllers/open_apis_controller.yaml')