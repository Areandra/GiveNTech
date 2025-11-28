import { test } from '@japa/runner'
import User from '#models/user'

let token: string = ''
let userId: number = 0
let facilityId: number = 0

test.group('Deployment Test', () => {
  test('Create and promote test user', async ({ client, assert }) => {
    const response = await client.post('/api/v1/user').json({
      username: 'test_deploy',
      email: 'deploy_test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.exists(response.body().data.id)

    userId = response.body().data.id

    const userToPromote = await User.findOrFail(userId)
    userToPromote.role = 'admin'
    await userToPromote.save()

    assert.equal(userToPromote.role, 'admin', 'User must be promoted to admin')

    console.log(
      `✅ User test (ID: ${userId}) berhasil dibuat & dipromosikan ke Super Admin secara otomatis.`
    )
  })

  test('Login test user (super admin)', async ({ client, assert }) => {
    const response = await client.post('/auth/login').json({
      email: 'deploy_test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.exists(response.body().token.token)

    token = response.body().token.token
  })

  test('frontend route responds', async ({ client }) => {
    const res = await client.get('/')
    res.assertStatus(200)
  })

  test('Facility endpoints respond', async ({ client }) => {
    const create = await client.post('/api/v1/facility').bearerToken(token).json({
      name: 'Facility A',
      type: 'Room',
    })

    create.assertStatus(200)

    facilityId = create.body().id ?? 1

    const update = await client
      .put(`/api/v1/facility/${facilityId}`)
      .bearerToken(token)
      .json({ name: 'Facility Updated' })

    update.assertStatus(200)

  })

  test('Booking endpoints respond', async ({ client }) => {
    const create = await client.post('/api/v1/booking').bearerToken(token).json({
      idFacility: 1,
    })

    create.assertStatus(200)

    const bookingId = create.body().id ?? 1

    const update = await client
      .put(`/api/v1/booking/${bookingId}`)
      .bearerToken(token)
      .json({ returnDate: '2024-01-02T12:00:00' })

    update.assertStatus(200)

    const del = await client.delete(`/api/v1/booking/${bookingId}`).bearerToken(token)

    del.assertStatus(200)

    const delF = await client.delete(`/api/v1/facility/${facilityId}`).bearerToken(token)

    delF.assertStatus(200)
  })

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
