import { createUserSchema, loginUserSchema, updateUserSchema } from '#schemas/user_schema'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

class UsersValidator {
  public create = vine.compile(createUserSchema)
  public update = vine.compile(updateUserSchema)
  public login = vine.compile(loginUserSchema)
}

vine.messagesProvider = new SimpleMessagesProvider({
  'username.required': 'Username cannot be empty',
  'username.string': 'Username must be a valid text',
  'username.maxLength': 'Username is too long (max 50 characters)',

  'email.required': 'Email cannot be empty',
  'email.email': 'Email format is invalid',

  'password.required': 'Password is required',
  'password.minLength': 'Password must contain at least 6 characters',

  'role.enum': 'Invalid role type',
})

export default new UsersValidator()
