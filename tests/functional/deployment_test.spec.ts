import { test } from '@japa/runner'
import User from '#models/user'

let adminToken: string = ''
let userToken: string = ''
let adminId: number = 0
let userId: number = 0
let facilityId: number = 0
let roomID: number = 0
let bookingId: number = 0

test.group('Admin Test', (group) => {
  group.setup(async () => {})

  test('Create and promote test admin', async ({ client, assert }) => {
    const response = await client.post('/api/v1/user').json({
      username: 'admin_test',
      email: 'admin_test@example.com',
      password: 'password123',
    })

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
    const response = await client.post('/api/v1/user').json({
      username: 'user_test',
      email: 'user_test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertAgainstApiSpec()

    assert.exists(response.body().data.id)
    userId = response.body().data.id
  })

  test('Login test admin', async ({ client, assert }) => {
    const response = await client.post('/auth/login').json({
      email: 'admin_test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertAgainstApiSpec()

    assert.exists(response.body().token)
    adminToken = response.body().token
  })

  test('Room CRUD endpoints', async ({ client, assert }) => {
    const createRes = await client
      .post('/api/v1/room')
      .bearerToken(adminToken)
      .json({
        roomName: 'Test Room',
        longitude: Number(120.123),
        latitude: Number(-8.543),
      })

    createRes.assertStatus(200)
    createRes.assertAgainstApiSpec()

    roomID = createRes.body().data?.id ?? createRes.body().id ?? 1
    assert.exists(roomID)

    const showRes = await client.get(`/api/v1/room/${roomID}`).bearerToken(adminToken)

    showRes.assertStatus(200)
    showRes.assertAgainstApiSpec()

    const updateRes = await client.put(`/api/v1/room/${roomID}`).bearerToken(adminToken).json({
      roomName: 'Updated Room Name',
    })

    updateRes.assertStatus(200)
    updateRes.assertAgainstApiSpec()

    const listRes = await client.get('/api/v1/room').bearerToken(adminToken)
    listRes.assertStatus(200)
    listRes.assertAgainstApiSpec()

    const mapRes = await client.get('/api/v1/room/mapData').bearerToken(adminToken)
    mapRes.assertStatus(200)
    mapRes.assertAgainstApiSpec()
  })

  test('Facility CRUD endpoints', async ({ client }) => {
    const createRes = await client
      .post('/api/v1/facility')
      .bearerToken(adminToken)
      .json({ name: 'Facility A', type: 'Room' })
    createRes.assertStatus(200)
    createRes.assertAgainstApiSpec()
    facilityId = createRes.body().id ?? 1
  })

  test('Booking CRUD endpoints', async ({ client, assert }) => {
    const createRes = await client.post('/api/v1/booking').bearerToken(adminToken).json({
      idUser: userId,
      idFacility: facilityId,
      idRoom: roomID,
      purpose: 'Testing booking system',
      notes: 'This is test booking',
      bookingDate: '2025-01-01T10:00:00',
    })

    createRes.assertStatus(200)
    createRes.assertAgainstApiSpec()

    bookingId = createRes.body().id ?? createRes.body().data?.id ?? 1
    assert.exists(bookingId)

    const updateRes = await client
      .put(`/api/v1/booking/${bookingId}`)
      .bearerToken(adminToken)
      .json({
        returnDate: '2025-01-02T12:00:00',
        status: 'Confirmed',
        notes: 'Updated notes',
      })

    updateRes.assertStatus(200)
    updateRes.assertAgainstApiSpec()

    const delBooking = await client.delete(`/api/v1/booking/${bookingId}`).bearerToken(adminToken)

    delBooking.assertStatus(200)
    delBooking.assertAgainstApiSpec()

    const updateResF = await client
      .put(`/api/v1/facility/${facilityId}`)
      .bearerToken(adminToken)
      .json({ name: 'Facility Updated', status: 'Available' })
    updateResF.assertStatus(200)
    updateResF.assertAgainstApiSpec()
  })

  test('User list, show, update', async ({ client }) => {
    const listRes = await client.get('/api/v1/user').bearerToken(adminToken)
    listRes.assertStatus(200)
    listRes.assertAgainstApiSpec()

    const showRes = await client.get(`/api/v1/user/${adminId}`).bearerToken(adminToken)
    showRes.assertStatus(200)
    showRes.assertAgainstApiSpec()

    const updateRes = await client
      .put(`/api/v1/user/${adminId}`)
      .bearerToken(adminToken)
      .json({ name: 'Updated Name' })
    updateRes.assertStatus(200)
    updateRes.assertAgainstApiSpec()
  })
})

test.group('User Self (Me) Endpoints', () => {
  test('Login test user', async ({ client, assert }) => {
    const response = await client.post('/auth/login').json({
      email: 'user_test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertAgainstApiSpec()

    assert.exists(response.body().token)
    userToken = response.body().token
  })

  test('Get current user profile (me)', async ({ client, assert }) => {
    const res = await client.get('/api/v1/me').bearerToken(userToken)
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.equal(res.body().data.id, userId)
  })

  test('Update current user profile (me)', async ({ client, assert }) => {
    const res = await client.post('/api/v1/me').bearerToken(userToken).json({
      username: 'UpdatedAdminTest',
    })
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.equal(res.body().message, 'Profile updated')
  })

  test('List current user bookings', async ({ client, assert }) => {
    const res = await client.get('/api/v1/me/booking').bearerToken(userToken)
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.isArray(res.body().data)
  })

  test('Create a booking for current user', async ({ client, assert }) => {
    const res = await client.post('/api/v1/me/booking').bearerToken(userToken).json({
      idFacility: facilityId,
      idRoom: roomID,
      purpose: 'Test booking via me endpoint',
      notes: 'Testing notes',
      bookingDate: '2025-01-03T10:00:00',
    })
    res.assertStatus(200)
    res.assertAgainstApiSpec()
    assert.exists(res.body())
    bookingId = 2
  })

  test('Get current user booking by ID', async ({ client, assert }) => {
    const res = await client.get(`/api/v1/me/booking/${bookingId}`).bearerToken(userToken)

    res.assertStatus(200)

    assert.equal(res.body().data.id, bookingId)
  })

  test('Update current user booking', async ({ client, assert }) => {
    const res = await client.post(`/api/v1/me/booking/${bookingId}`).bearerToken(userToken).json({
      notes: 'Updated via me endpoint',
    })

    res.assertStatus(200)

    res.assertAgainstApiSpec()

    assert.equal(res.body().message, 'Booking updated')
  })

  test('Delete current user booking', async ({ client, assert }) => {
    const res = await client.delete(`/api/v1/me/booking/${bookingId}`).bearerToken(userToken)

    res.assertStatus(200)

    res.assertAgainstApiSpec()

    assert.equal(res.body().message, 'Booking deleted')
  })

  test('Delete current user account', async ({ client, assert }) => {
    const res = await client.delete('/api/v1/me').bearerToken(userToken)

    res.assertStatus(200)

    res.assertAgainstApiSpec()

    assert.equal(res.body().message, 'Account deleted')
  })

  test('Clear Reast Of all data', async ({ client }) => {
    const delFacility = await client
      .delete(`/api/v1/facility/${facilityId}`)
      .bearerToken(adminToken)

    delFacility.assertStatus(200)
    delFacility.assertAgainstApiSpec()

    const delRoom = await client.delete(`/api/v1/room/${roomID}`).bearerToken(adminToken)

    delRoom.assertStatus(200)
    delRoom.assertAgainstApiSpec()
  })
})
