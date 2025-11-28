import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import { checkIsAdmin } from './is_admin_rules.js'

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

const isAdminExceptRule = vine.createRule(isAdminExcept)
export default isAdminExceptRule;
