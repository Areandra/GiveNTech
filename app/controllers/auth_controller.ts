import User from '#models/user'
import UserService from '#services/user_service'
import UsersValidator from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiExtraModels, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import mail from '@adonisjs/mail/services/main'
import redis from '@adonisjs/redis/services/main'
import SendOtpMail from '../mailers/send_otp.js'
import { ApiErrorResponses } from '#validators/global_error'
import Booking from '#models/booking'
import Room from '#models/room'
import Facility from '#models/facility'

const OTP_EXPIRY_SECONDS = 300
const REDIS_KEY_PREFIX = 'otp:'

const UsersCreate = UsersValidator.create
const UsersLogin = UsersValidator.login

export default class AuthController {
  // @ts-ignore
  @ApiExtraModels(User)
  // @ts-ignore
  @ApiExtraModels(Facility)
  // @ts-ignore
  @ApiExtraModels(Room)
  // @ts-ignore
  @ApiExtraModels(Booking)
  private ok(ctx: HttpContext, message: string, extra: Record<string, any> = {}) {
    return ctx.response.ok({
      success: true,
      message,
      ...extra,
    })
  }

  @ApiOperation({ summary: 'Login User (API Token)' })
  @ApiBody({ type: () => UsersLogin })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Login berhasil' },
        token: { type: 'string', example: 'api_token_here' },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InvalidCredential
  @ApiErrorResponses.InternalServerError
  async login(ctx: HttpContext) {
    const body = await ctx.request.validateUsing(UsersLogin)
    const data = await UserService.getUserByCredential(body, ctx)

    return this.ok(ctx, 'Login berhasil', {
      token: data.token,
      data: data.user,
    })
  }

  @ApiOperation({ summary: 'Login User via Session (Web)' })
  @ApiBody({ type: () => UsersLogin })
  @ApiErrorResponses.Unauthorized
  @ApiErrorResponses.ValidationError
  async sessionLogin(ctx: HttpContext) {
    const { email, password } = await ctx.request.validateUsing(UsersLogin)
    const user = await User.verifyCredentials(email, password)
    await ctx.auth.use('web').login(user)

    if (user?.role === 'user') {
      return ctx.response.redirect('/user/dashboard')
    }
    return ctx.response.redirect('/dashboard')
  }

  @ApiOperation({ summary: 'Register User via Session (Web)' })
  @ApiBody({ type: () => UsersCreate })
  @ApiErrorResponses.ValidationError
  async sessionRegister(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(UsersCreate)
    const user = await User.create(payload)
    await ctx.auth.use('web').login(user)
    return ctx.response.redirect('/user/dashboard')
  }

  @ApiOperation({ summary: 'Login dengan Google OAuth2 (API Token)' })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Login berhasil' },
        token: { type: 'string', example: 'api_token_here' },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiErrorResponses.InternalServerError
  oauth2(ctx: HttpContext) {
    return ctx.ally.use('google').redirect()
  }

  @ApiOperation({ summary: 'Callback Google OAuth2 (API Token)' })
  @ApiErrorResponses.InternalServerError
  async oauth2Callback(ctx: HttpContext) {
    const provider = ctx.ally.use('google')
    const userData = await provider.user()

    const user = await User.firstOrCreate({ email: userData.email }, { username: userData.name })

    const token = await ctx.auth.use('api').createToken(user, [], {
      expiresIn: '7 days',
    })

    await user.refresh()

    return this.ok(ctx, 'Login OAuth2 berhasil', {
      token: token,
      data: user,
    })
  }

  @ApiOperation({ summary: 'Login dengan Google OAuth2 (Web Session)' })
  oauth2Session(ctx: HttpContext) {
    return ctx.ally.use('googleSession').redirect()
  }

  @ApiOperation({ summary: 'Callback Google OAuth2 Session (Web)' })
  @ApiErrorResponses.InternalServerError
  async oauth2SessionCallback(ctx: HttpContext) {
    const provider = ctx.ally.use('googleSession')
    const userData = await provider.user()

    const user = await User.firstOrCreate({ email: userData.email }, { username: userData.name })

    await ctx.auth.use('web').login(user)
    await user.refresh()

    if (user?.role === 'user') {
      return ctx.response.redirect('/user/dashboard')
    }
    return ctx.response.redirect('/login/phoneNumber')
  }

  @ApiOperation({ summary: 'Kirim Kode OTP untuk Lupa Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Kode OTP berhasil dikirim',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Kode OTP telah dikirim ke email Anda.' },
      },
    },
  })
  @ApiErrorResponses.NotFound
  @ApiErrorResponses.InternalServerError
  @ApiErrorResponses.ValidationError
  async sendOtp({ request, response }: HttpContext) {
    const { email } = request.only(['email'])
    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'Email tidak ditemukan.' })
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const redisKey = `${REDIS_KEY_PREFIX}${user.email}`
    await redis.set(redisKey, otpCode, 'EX', OTP_EXPIRY_SECONDS)

    try {
      await mail.send(new SendOtpMail(user, otpCode))
      return response.ok({ message: 'Kode OTP telah dikirim ke email Anda.' })
    } catch (error) {
      console.error('Gagal mengirim email OTP:', error)
      return response.internalServerError({
        message: 'Gagal mengirim kode OTP. Silakan coba lagi.',
      })
    }
  }

  @ApiOperation({ summary: 'Verifikasi Kode OTP dan Ganti Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@example.com' },
        otp: { type: 'string', example: '263177' },
        newPassword: { type: 'string', example: 'password_baru' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password berhasil diubah',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password Berhasil di Ganti!' },
      },
    },
  })
  @ApiErrorResponses.Unauthorized
  @ApiErrorResponses.InternalServerError
  @ApiErrorResponses.ValidationError
  @ApiErrorResponses.InvalidCredential
  async verifyOtp({ request, response }: HttpContext) {
    const { email, otp, newPassword } = request.only(['email', 'otp', 'newPassword'])
    const user = await User.findBy('email', email)
    if (!user) {
      return response.unauthorized({ message: 'Verifikasi gagal.' })
    }

    const redisKey = `${REDIS_KEY_PREFIX}${user.email}`
    const storedOtp = await redis.get(redisKey)

    if (!storedOtp || storedOtp !== otp) {
      return response.unauthorized({ message: 'Kode OTP tidak valid atau telah kadaluarsa.' })
    }

    await redis.del(redisKey)
    user.password = newPassword
    await user.save()

    return response.ok({ message: 'Password Berhasil di Ganti!' })
  }
}
