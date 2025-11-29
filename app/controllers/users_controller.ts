import User from '#models/user'
import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

export default class UsersController {
  @ApiOperation({ summary: 'List All User' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Users succsesfuly optained' },
        data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
      },
    },
  })
  async index(ctx: HttpContext) {
    const page = await ctx.request.input('page', 1)
    const data = await UserService.listUsers(page)

    ctx.response.ok({
      succses: true,
      message: 'Users succsesfuly optained',
      data,
    })
  }

  @ApiOperation({ summary: 'Get User by ID' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'User with id 1 has found' },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiResponse({ type: User })
  async show(ctx: HttpContext) {
    const id = await ctx.params.id
    const data = await UserService.getUser(id)

    ctx.response.ok({
      succses: true,
      message: `User with id ${id} has found`,
      data,
    })
  }

  @ApiOperation({ summary: 'Destroy User' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Account deleted' },
      },
    },
  })
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    await UserService.deleteUser(id)
    ctx.response.ok({
      succses: true,
      message: 'Account deleted',
    })
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Profile updated' },
      },
    },
  })
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const body = await ctx.request.validateUsing(UsersValidator.update, {
      meta: {
        userRole: ctx.auth.user?.role || 'user',
      },
    })

    await UserService.updateUser(id, body)

    ctx.response.ok({
      succses: true,
      message: 'Profile updated',
    })
  }

  @ApiOperation({ summary: 'Create or Register New User' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Registerd succsesfuly' },
        token: {
          type: 'string',
          example:
            'http://localhost:3333/docs#tag/auth/post/authlogin:~:text=oat_MQ.bE1JNlJsSFJQTnBIdUVVX3p5ZEFONnQySEgzcHA1VVFCQjNscm5KUjgzNzI0MDk5Mg',
        },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  async store(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(UsersValidator.create, {
      meta: {
        userRole: ctx.auth.user?.role || 'user',
      },
    })
    const data = await UserService.createUser(body, ctx)

    ctx.response.ok({
      succses: true,
      message: 'Registerd succsesfuly',
      token: data.token,
      data: data.user,
    })
  }
}
