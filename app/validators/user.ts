import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(1).maxLength(255),
    email: vine.string().trim().email().maxLength(255).unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8),
  })
)
createUserValidator.messagesProvider = new SimpleMessagesProvider({
  'username.required': 'Nama wajib diisi',
  'username.minLength': 'Nama minimal 1 karakter',
  'username.maxLength': 'Nama maksimal 255 karakter',

  'email.required': 'Email wajib diisi',
  'email.email': 'Email tidak valid',
  'email.maxLength': 'Email maksimal 255 karakter',
  'username.unique': 'Email sudah digunakan',

  'password.required': 'Password wajib diisi',
  'password.minLength': 'Password minimal 8 karakter',
})
