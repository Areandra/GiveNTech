import isAdminRule from '#rules/is_admin_rules'
import vine from '@vinejs/vine'

export const baseUserSchema = {
  username: vine.string().maxLength(50),
  email: vine.string().email(),
  password: vine.string().minLength(6),
  role: vine.enum(['admin', 'user']).use(isAdminRule()).optional(),
}

export const createUserSchema = vine.object({
  ...baseUserSchema,
})

export const updateUserSchema = vine.object({
  ...baseUserSchema,
  email: baseUserSchema.email.optional(),
  password: baseUserSchema.password.optional(),
  username: vine.string().maxLength(50).optional(),
})

export const loginUserSchema = vine.object({
  email: baseUserSchema.email.optional(),
  username: vine.string().maxLength(50).optional(),
  password: baseUserSchema.password,
})
