import User from '#models/user'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async register({ auth, request, inertia }: HttpContext) {
    const validateData = await request.validateUsing(createUserValidator)
    const user = await User.create(validateData)
    const token = await auth.use('api').createToken(user, [], {
      expiresIn: '7 days',
    })

    await user.refresh()
    await user.save()

    return inertia.render('auth/tokens_validate', {
      token: token.toJSON().token,
      user: user.serialize(),
    })

    // return response.status(201).json({
    //   token,
    //   user,
    // })
  }

  public async login({ auth, request, inertia }: HttpContext) {
    const { email, password } = request.all()

    try {
      const user = await User.verifyCredentials(email, password)

      const token = await auth.use('api').createToken(user, [], {
        expiresIn: '7 days',
      })

      return inertia.render('auth/tokens_validate', {
        token: token.toJSON().token,
        user: user.serialize(),
      })

      // return response.status(200).json({
      //   token,
      //   user,
      // })
    } catch (e) {
      // return response.status(401).json({ message: 'Invalid credentials' })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    auth.use('api').invalidateToken()
    response.redirect('/login')
  }

  public oauth = ({ ally }: HttpContext) => ally.use('google').redirect()

  public async oauthCallback({ ally, auth, inertia }: HttpContext) {
    const provider = ally.use('google')
    const userData = await provider.user()
    const user = await User.firstOrCreate({ email: userData.email, username: userData.name })
    const token = await auth.use('api').createToken(user, [], {
      expiresIn: '7 days',
    })

    await user.refresh()
    await user.save()

    return inertia.render('auth/tokens_validate', {
      token: token.toJSON().token,
      user: user.serialize(),
    })
  }
}
