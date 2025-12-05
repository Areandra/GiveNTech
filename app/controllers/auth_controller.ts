import User from '#models/user'
import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

export default class AuthController {
  private ok(ctx: HttpContext, message: string, extra: Record<string, any> = {}) {
    return ctx.response.ok({
      success: true,
      message,
      ...extra,
    })
  }

  @ApiOperation({ summary: 'Login User (API Token)' })
  @ApiBody({ type: () => UsersValidator.login })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Login successful' },
        token: { type: 'string' },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  async login(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(UsersValidator.login)
    const data = await UserService.getUserByCredential(body, ctx)

    return this.ok(ctx, 'Login successful', {
      token: data.token,
      data: data.user,
    })
  }

  @ApiOperation({ summary: 'Login User (Session Cookies)' })
  @ApiBody({ type: () => UsersValidator.login })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        redirect: { type: 'string' },
      },
    },
  })
  async sessionLogin(ctx: HttpContext) {
    const { email, password } = await ctx.request.validateUsing(UsersValidator.login)

    const user = await User.verifyCredentials(email, password)
    await ctx.auth.use('web').login(user)

    return ctx.response.redirect('/dashboard')

    // return this.ok(ctx, 'Session login successful', {
    //   redirect: '/dashboard',
    // })
  }

  @ApiOperation({ summary: 'Register User (Session Cookies)' })
  @ApiBody({ type: () => UsersValidator.create })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/User' },
        redirect: { type: 'string' },
      },
    },
  })
  async sessionRegister(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(UsersValidator.create)

    const user = await User.create(payload)
    await ctx.auth.use('web').login(user)

    if (user!.role) {
      return ctx.response.redirect('/user/dashboard')
    }

    return this.ok(ctx, 'Registration successful', {
      data: user,
      redirect: '/dashboard',
    })
  }

  @ApiOperation({ summary: 'Google OAuth2 (API Token)' })
  oauth2(ctx: HttpContext) {
    return ctx.ally.use('google').redirect()
  }

  async oauth2Callback(ctx: HttpContext) {
    const provider = ctx.ally.use('google')
    const userData = await provider.user()

    const user = await User.firstOrCreate({ email: userData.email }, { username: userData.name })

    const token = await ctx.auth.use('api').createToken(user, [], {
      expiresIn: '7 days',
    })

    await user.refresh()

    return this.ok(ctx, 'OAuth2 login successful', {
      token: token,
      data: user,
    })
  }

  oauth2Session(ctx: HttpContext) {
    return ctx.ally.use('googleSession').redirect()
  }

  async oauth2SessionCallback(ctx: HttpContext) {
    const provider = ctx.ally.use('googleSession')
    const userData = await provider.user()

    const user = await User.firstOrCreate({ email: userData.email }, { username: userData.name })

    await ctx.auth.use('web').login(user)

    if (user!.role) {
      return ctx.response.redirect('/user/dashboard')
    }

    return ctx.response.redirect('/dashboard')
  }
}
