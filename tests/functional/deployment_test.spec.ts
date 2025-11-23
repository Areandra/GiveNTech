import { test } from '@japa/runner'
import User from '#models/user'

let token: string = ''
let userId: number = 0
let facilityId: number = 0

test.group('Deployment Test', () => {
  /**
   * 1️⃣ Create user dan langsung promote ke super admin menggunakan Model
   */
  test('Create and promote test user', async ({ client, assert }) => {
    const response = await client.post('/api/v1/user').json({
      username: 'test_deploy',
      email: 'deploy_test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.exists(response.body().data.id)

    userId = response.body().data.id

    // 2. Update role ke 'super_admin'
    const userToPromote = await User.findOrFail(userId)
    userToPromote.role = 'super_admin'
    await userToPromote.save()

    assert.equal(userToPromote.role, 'super_admin', 'User must be promoted to super_admin')

    console.log(
      `✅ User test (ID: ${userId}) berhasil dibuat & dipromosikan ke Super Admin secara otomatis.`
    )
  })

  /**
   * 2️⃣ Login setelah user dipromote
   */
  test('Login test user (super admin)', async ({ client, assert }) => {
    const response = await client.post('/auth/login').json({
      email: 'deploy_test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.exists(response.body().token.token)

    token = response.body().token.token
  })

  /**
   * 3️⃣ Root route
   */
  test('frontend route responds', async ({ client }) => {
    const res = await client.get('/')
    res.assertStatus(200)
  })

  /**
   * 4️⃣ Facility endpoints
   */
  test('Facility endpoints respond', async ({ client }) => {
    // Create
    const create = await client.post('/api/v1/facility').bearerToken(token).json({
      name: 'Facility A',
      type: 'Room', // <-- Wajib ada di sini
    })

    create.assertStatus(200)

    facilityId = create.body().id ?? 1

    // Update
    const update = await client
      .put(`/api/v1/facility/${facilityId}`)
      .bearerToken(token)
      .json({ name: 'Facility Updated' })

    update.assertStatus(200)

    // Delete
  })

  /**
   * 5️⃣ Booking endpoints
   */
  test('Booking endpoints respond', async ({ client }) => {
    const create = await client.post('/api/v1/booking').bearerToken(token).json({
      idFacility: 1,
    })

    create.assertStatus(200)

    const bookingId = create.body().id ?? 1

    // Update
    const update = await client
      .put(`/api/v1/booking/${bookingId}`)
      .bearerToken(token)
      .json({ returnDate: '2024-01-02T12:00:00' })

    update.assertStatus(200)

    // Delete
    const del = await client.delete(`/api/v1/booking/${bookingId}`).bearerToken(token)

    del.assertStatus(200)

    const delF = await client.delete(`/api/v1/facility/${facilityId}`).bearerToken(token)

    delF.assertStatus(200)
  })

  /**
   * 6️⃣ User endpoint
   */
  test('User list responds', async ({ client }) => {
    const res = await client.get('/api/v1/user').bearerToken(token)
    res.assertStatus(200)
  })

  test('User show responds', async ({ client }) => {
    const res = await client.get(`/api/v1/user/${userId}`).bearerToken(token)

    res.assertStatus(200)
  })

  test('User update responds', async ({ client }) => {
    const res = await client
      .put(`/api/v1/user/${userId}`)
      .bearerToken(token)
      .json({ name: 'Updated Name' })

    res.assertStatus(200)
  })
})
