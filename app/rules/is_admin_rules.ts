import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

export function checkIsAdmin(role: any) {
  if (!role) {
    throw new Error(
      `[Validator Error] Rule 'isAdmin' called but 'meta.user_role' is missing.
       Check your Controller!
       Example:
       await request.validateUsing(validator, {
         meta: { userRole: user.role }
       })`
    )
  }
  return ['admin'].includes(role)
}

async function isAdmin(value: unknown, _: unknown, field: FieldContext) {
  if (typeof value !== 'string') return
  const userRole = field.meta?.userRole
  const allowed = checkIsAdmin(userRole)

  if (!allowed) {
    field.report('You are not authorized to set this field.', 'isAdmin', field)
  }
}

const isAdminRule = vine.createRule(isAdmin)
export default isAdminRule
