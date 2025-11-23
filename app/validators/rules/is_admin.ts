import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

function checkIsAdmin(role: any) {
  if (!role) {
    throw new Error(
      `[Validator Error] Rule 'isAdmin' called but 'meta.user_role' is missing.
       Check your Controller!
       Example:
       await request.validateUsing(validator, {
         meta: { user_role: user.role }
       })`
    )
  }
  return ['super_admin'].includes(role)
}

async function isAdmin(value: unknown, _: unknown, field: FieldContext) {
  if (typeof value !== 'string') return
  const userRole = field.meta?.userRole
  const allowed = checkIsAdmin(userRole)

  if (!allowed) {
    field.report('You are not authorized to set this field.', 'isAdmin', field)
  }
}

async function isAdminExcept(value: unknown, options: string[], field: FieldContext) {
  if (typeof value !== 'string') return
  const userRole = field.meta?.userRole

  const isAdminUser = checkIsAdmin(userRole)

  if (!isAdminUser && !options.includes(value)) {
    field.report(
      `You are not authorized to set this field with value "${value}". Allowed: ${options.join(', ')}`,
      'isAdminExceptValue',
      field
    )
  }
}

export const isAdminRule = vine.createRule(isAdmin)
export const isAdminExceptRule = vine.createRule(isAdminExcept)
