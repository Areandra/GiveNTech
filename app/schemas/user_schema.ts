import vine from '@vinejs/vine'

export const baseUserSchema = {
  username: vine.string().maxLength(50),
  phoneNumber: vine.number().positive(),
  email: vine.string().email(),
  password: vine.string().minLength(6),
}

export const createUserSchema = vine.object({
  ...baseUserSchema,
})

export const updateUserSchema = vine.object({
  ...baseUserSchema,
  email: baseUserSchema.email.optional(),
  password: baseUserSchema.password.optional(),
  username: vine.string().maxLength(50).optional(),
  phoneNumber: vine.string().maxLength(15).optional(),
})

export const loginUserSchema = vine.object({
  email: baseUserSchema.email,
  password: baseUserSchema.password,
})
