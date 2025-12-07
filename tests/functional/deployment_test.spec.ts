import { test } from '@japa/runner'
import User from '#models/user'

let adminToken: string = ''
let userToken: string = ''
let adminId: number = 0
let userId: number = 0
let facilityId: number = 0
let roomID: number = 0
let bookingId: number = 0

// -------------------
// ADMIN TEST
// -------------------
test.group('Admin Test', (group) => {
  group.setup(async () => {})

  test('Create and promote test admin', async ({ client, assert }) => {
    const reqData = {
      username: 'admin_test',
      email: 'admin_test@example.com',
      password: 'password123',
      phoneNumber: '62812112121',
    }
    console.log('📤 Request Create Admin:', reqData)

    const response = await client.post('/api/v1/user').json(reqData)
    console.log('📥 Response:', response.body())

    response.assertStatus(200)
    response.assertAgainstApiSpec()

    assert.exists(response.body().data.id)
    adminId = response.body().data.id

    const user = await User.findOrFail(adminId)
    user.role = 'admin'
    await user.save()

    assert.equal(user.role, 'admin')
  })

  test('Create test user', async ({ client, assert }) => {
    const reqData = {
      username: 'user_test',
      email: 'user_test@example.com',
      password: 'password123',
      phoneNumber: '62812132212',
    }
    console.log('📤 Request Create User:', reqData)

    const response = await client.post('/api/v1/user').json(reqData)
    console.log('📥 Response:', response.body())

    response.assertStatus(200)
    response.assertAgainstApiSpec()

    assert.exists(response.body().data.id)
    userId = response.body().data.id
  })

  test('Login test admin', async ({ client, assert }) => {
    const reqData = { email: 'admin_test@example.com', password: 'password123' }
    console.log('📤 Request Login Admin:', reqData)

    const response = await client.post('/auth/login').json(reqData)
    console.log('📥 Response:', response.body())

    response.assertStatus(200)
    response.assertAgainstApiSpec()
    assert.exists(response.body().token)
    adminToken = response.body().token
  })

  test('Room CRUD endpoints', async ({ client, assert }) => {
    const createReq = { roomName: 'Test Room', longitude: 120.123, latitude: -8.543 }
    console.log('📤 Create Room Request:', createReq)

    const createRes = await client.post('/api/v1/room').bearerToken(adminToken).json(createReq)
    console.log('📥 Create Room Response:', createRes.body())

    createRes.assertStatus(200)
    createRes.assertAgainstApiSpec()

    roomID = createRes.body().data?.id ?? createRes.body().id ?? 1
    assert.exists(roomID)

    const showRes = await client.get(`/api/v1/room/${roomID}`).bearerToken(adminToken)
    console.log('📥 Show Room Response:', showRes.body())
    showRes.assertStatus(200)
    showRes.assertAgainstApiSpec()

    const updateReq = { roomName: 'Updated Room Name' }
    console.log('📤 Update Room Request:', updateReq)

    const updateRes = await client
      .put(`/api/v1/room/${roomID}`)
      .bearerToken(adminToken)
      .json(updateReq)
    console.log('📥 Update Room Response:', updateRes.body())
    updateRes.assertStatus(200)
    updateRes.assertAgainstApiSpec()

    const listRes = await client.get('/api/v1/room').bearerToken(adminToken)
    console.log('📥 List Rooms Response:', listRes.body())
    listRes.assertStatus(200)
    listRes.assertAgainstApiSpec()

    const mapRes = await client.get('/api/v1/room/mapData').bearerToken(adminToken)
    console.log('📥 Map Data Response:', mapRes.body())
    mapRes.assertStatus(200)
    mapRes.assertAgainstApiSpec()
  })

  test('Facility CRUD endpoints', async ({ client }) => {
    const createReq = { name: 'Facility A', type: 'Room' }
    console.log('📤 Create Facility Request:', createReq)

    const createRes = await client.post('/api/v1/facility').bearerToken(adminToken).json(createReq)
    console.log('📥 Create Facility Response:', createRes.body())
    createRes.assertStatus(200)
    createRes.assertAgainstApiSpec()

    facilityId = createRes.body().id ?? 1
  })

  test('Booking CRUD endpoints', async ({ client, assert }) => {
    const createReq = {
      idUser: userId,
      idFacility: facilityId,
      idRoom: roomID,
      purpose: 'Testing booking system',
      notes: 'This is test booking',
      bookingDate: '2025-01-01T10:00:00',
    }
    console.log('📤 Create Booking Request:', createReq)

    const createRes = await client.post('/api/v1/booking').bearerToken(adminToken).json(createReq)
    console.log('📥 Create Booking Response:', createRes.body())
    createRes.assertStatus(200)
    createRes.assertAgainstApiSpec()

    bookingId = createRes.body().id ?? createRes.body().data?.id ?? 1
    assert.exists(bookingId)

    const updateReq = {
      returnDate: '2025-01-02T12:00:00',
      status: 'Confirmed',
      notes: 'Updated notes',
    }
    console.log('📤 Update Booking Request:', updateReq)

    const updateRes = await client
      .put(`/api/v1/booking/${bookingId}`)
      .bearerToken(adminToken)
      .json(updateReq)
    console.log('📥 Update Booking Response:', updateRes.body())
    updateRes.assertStatus(200)
    updateRes.assertAgainstApiSpec()

    const delBooking = await client.delete(`/api/v1/booking/${bookingId}`).bearerToken(adminToken)
    console.log('📥 Delete Booking Response:', delBooking.body())
    delBooking.assertStatus(200)
    delBooking.assertAgainstApiSpec()

    const updateResF = await client
      .put(`/api/v1/facility/${facilityId}`)
      .bearerToken(adminToken)
      .json({ name: 'Facility Updated', status: 'Available' })
    console.log('📤 Update Facility Request:', { name: 'Facility Updated', status: 'Available' })
    console.log('📥 Update Facility Response:', updateResF.body())
    updateResF.assertStatus(200)
    updateResF.assertAgainstApiSpec()
  })

  test('User list, show, update', async ({ client }) => {
    const listRes = await client.get('/api/v1/user').bearerToken(adminToken)
    console.log('📥 List Users Response:', listRes.body())
    listRes.assertStatus(200)
    listRes.assertAgainstApiSpec()

    const showRes = await client.get(`/api/v1/user/${adminId}`).bearerToken(adminToken)
    console.log('📥 Show Admin Response:', showRes.body())
    showRes.assertStatus(200)
    showRes.assertAgainstApiSpec()

    const updateReq = { name: 'Updated Name' }
    console.log('📤 Update Admin Request:', updateReq)
    const updateRes = await client
      .put(`/api/v1/user/${adminId}`)
      .bearerToken(adminToken)
      .json(updateReq)
    console.log('📥 Update Admin Response:', updateRes.body())
    updateRes.assertStatus(200)
    updateRes.assertAgainstApiSpec()
  })
})

// -------------------
// USER SELF (ME) TESTS
// -------------------
test.group('User Self (Me) Endpoints', () => {
  test('Login test user', async ({ client, assert }) => {
    const reqData = { email: 'user_test@example.com', password: 'password123' }
    console.log('📤 Login User Request:', reqData)
    const response = await client.post('/auth/login').json(reqData)
    console.log('📥 Response:', response.body())
    response.assertStatus(200)
    response.assertAgainstApiSpec()
    assert.exists(response.body().token)
    userToken = response.body().token
  })

  test('Get current user profile (me)', async ({ client, assert }) => {
    const res = await client.get('/api/v1/me').bearerToken(userToken)
    console.log('📥 Get Me Response:', res.body())
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.equal(res.body().data.id, userId)
  })

  test('Update current user profile (me)', async ({ client, assert }) => {
    const reqData = { username: 'UpdatedAdminTest' }
    console.log('📤 Update Me Request:', reqData)
    const res = await client.post('/api/v1/me').bearerToken(userToken).json(reqData)
    console.log('📥 Update Me Response:', res.body())
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.equal(res.body().message, 'Profile updated')
  })

  test('List current user bookings', async ({ client, assert }) => {
    const res = await client.get('/api/v1/me/booking').bearerToken(userToken)
    console.log('📥 List Bookings Response:', res.body())
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.isArray(res.body().data)
  })

  test('Create a booking for current user', async ({ client, assert }) => {
    const reqData = {
      idFacility: facilityId,
      idRoom: roomID,
      purpose: 'Test booking via me endpoint',
      notes: 'Testing notes',
      bookingDate: '2025-01-03T10:00:00',
    }
    console.log('📤 Create Booking (Me) Request:', reqData)
    const res = await client.post('/api/v1/me/booking').bearerToken(userToken).json(reqData)
    console.log('📥 Response:', res.body())
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.exists(res.body())
    bookingId = 2
  })

  test('Get current user booking by ID', async ({ client, assert }) => {
    const res = await client.get(`/api/v1/me/booking/${bookingId}`).bearerToken(userToken)
    console.log('📥 Get Booking (Me) Response:', res.body())
    res.assertStatus(200)
    assert.equal(res.body().data.id, bookingId)
  })

  test('Update current user booking', async ({ client, assert }) => {
    const reqData = { notes: 'Updated via me endpoint' }
    console.log('📤 Update Booking (Me) Request:', reqData)
    const res = await client
      .post(`/api/v1/me/booking/${bookingId}`)
      .bearerToken(userToken)
      .json(reqData)
    console.log('📥 Response:', res.body())
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.equal(res.body().message, 'Booking updated')
  })

  test('Delete current user booking', async ({ client, assert }) => {
    const res = await client.delete(`/api/v1/me/booking/${bookingId}`).bearerToken(userToken)
    console.log('📥 Delete Booking (Me) Response:', res.body())
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.equal(res.body().message, 'Booking deleted')
  })

  test('Delete current user account', async ({ client, assert }) => {
    const res = await client.delete('/api/v1/me').bearerToken(userToken)
    console.log('📥 Delete Me Response:', res.body())
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.equal(res.body().message, 'Account deleted')
  })

  test('Clear Remaining Data', async ({ client }) => {
    const delFacility = await client
      .delete(`/api/v1/facility/${facilityId}`)
      .bearerToken(adminToken)
    console.log('📥 Delete Facility Response:', delFacility.body())
    delFacility.assertStatus(200)
    delFacility.assertAgainstApiSpec()

    const delRoom = await client.delete(`/api/v1/room/${roomID}`).bearerToken(adminToken)
    console.log('📥 Delete Room Response:', delRoom.body())
    delRoom.assertStatus(200)
    delRoom.assertAgainstApiSpec()
  })
})
