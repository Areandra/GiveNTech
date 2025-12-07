import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import { ApiErrorResponses } from '#validators/global_error'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity } from '@foadonis/openapi/decorators'

const UsersCreate = UsersValidator.create
const UsersUpdate = UsersValidator.update

@ApiSecurity('BearerAuth')
@ApiErrorResponses.Forbidden
@ApiErrorResponses.Unauthorized
export default class UsersController {
  private ok(ctx: HttpContext, message: string, extra: Record<string, any> = {}) {
    return ctx.response.ok({
      success: true,
      message,
      ...extra,
    })
  }

  @ApiOperation({ summary: 'Daftar Semua Pengguna' })
  @ApiResponse({
    status: 200,
    description: 'Daftar pengguna berhasil diperoleh',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Users successfully obtained' },
        data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  async index(ctx: HttpContext) {
    const data = await UserService.listUsers()

    return this.ok(ctx, 'Users successfully obtained', { data })
  }

  @ApiOperation({ summary: 'Ambil Pengguna berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Pengguna berhasil ditemukan',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User with id 1 has found' },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await UserService.getUser(id)

    return this.ok(ctx, `User with id ${id} has found`, { data })
  }

  @ApiOperation({ summary: 'Hapus Pengguna' })
  @ApiResponse({
    status: 200,
    description: 'Akun pengguna berhasil dihapus',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Account deleted' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    await UserService.deleteUser(id)

    return this.ok(ctx, 'Account deleted')
  }

  @ApiOperation({ summary: 'Perbarui Pengguna' })
  @ApiBody({ type: () => UsersUpdate })
  @ApiResponse({
    status: 200,
    description: 'Profil pengguna berhasil diperbarui',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Profile updated' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(UsersUpdate, {
      meta: {
        userRole: ctx.auth.user?.role || 'user',
      },
    })

    await UserService.updateUser(id, body)

    return this.ok(ctx, 'Profile updated')
  }

  @ApiOperation({ summary: 'Buat atau Registrasi Pengguna Baru' })
  @ApiBody({ type: () => UsersCreate })
  @ApiResponse({
    status: 200,
    description: 'Registrasi berhasil',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Registered successfully' },
        token: {
          type: 'string',
          description: 'Access token untuk pengguna yang baru terdaftar.',
          example: 'oat_MQ.bE1JNlJsSFJQTnBIdUVVX3p5ZEFONnQySEgzcHA1VVFCQjNscm5KUjgzNzI0MDk5Mg',
        },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InternalServerError
  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(UsersCreate)
    const data = await UserService.createUser(body, ctx)

    return this.ok(ctx, 'Access token untuk pengguna yang baru terdaftar', {
      token: data.token,
      data: data.user,
    })
  }
}
