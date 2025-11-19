import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class UsersValidator {
  private baseSchema = {
    username: vine.string().maxLength(50),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    role: vine.enum(['super_admin', 'admin', 'user']).optional(),
  }

  public create = vine.compile(
    vine.object({
      ...this.baseSchema,
    })
  )

  public update = vine.compile(
    vine.object({
      ...this.baseSchema,
      email: this.baseSchema.email.optional(),
      password: this.baseSchema.password.optional(),
      username: vine.string().minLength(50).optional(),
    })
  )

  public login = vine.compile(
    vine.object({
      email: this.baseSchema.email.optional(),
      username: vine.string().minLength(50).optional(),
      password: this.baseSchema.password,
    })
  )
}

vine.messagesProvider = new SimpleMessagesProvider({
  // USERNAME
  'username.required': 'Username cannot be empty',
  'username.string': 'Username must be a valid text',
  'username.maxLength': 'Username is too long (max 50 characters)',

  // EMAIL
  'email.required': 'Email cannot be empty',
  'email.email': 'Email format is invalid',

  // PASSWORD
  'password.required': 'Password is required',
  'password.minLength': 'Password must contain at least 6 characters',

  // ROLE
  'role.enum': 'Invalid role type',
})
