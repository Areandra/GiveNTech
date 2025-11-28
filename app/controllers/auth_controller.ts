import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

const UserLogin = UsersValidator.login

export default class AuthController {
  @ApiOperation({ summary: 'Get User Acsess Token' })
  @ApiBody({
    type: () => UserLogin,
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: 'true' },
        message: { type: 'string', example: 'Login succsesfuly' },
        token: {
          type: 'string',
          example:
            'http://localhost:3333/docs#tag/auth/post/authlogin:~:text=oat_MQ.bE1JNlJsSFJQTnBIdUVVX3p5ZEFONnQySEgzcHA1VVFCQjNscm5KUjgzNzI0MDk5Mg',
        },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  async login(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(UserLogin)
    const data = await UserService.getUserByCredential(body, ctx)

    ctx.response.ok({
      succses: true,
      message: 'Login succsesfuly',
      token: data.token,
      data: data.user,
    })
  }
}
