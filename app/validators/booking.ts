import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { isAdminExceptRule } from './rules/is_admin.js'

export default class BookingsValidator {
  private baseSchema = {
    idUser: vine
      .number()
      .exists({
        table: 'users',
        column: 'id',
      })
      .optional(),

    idFacility: vine.number().exists({
      table: 'facilities',
      column: 'id',
    }),

    idApprover: vine
      .number()
      .exists({
        table: 'users',
        column: 'id',
      })
      .optional(),

    roomNumber: vine.string().maxLength(50).optional(),

    bookingDate: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
      .optional(),

    returnDate: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
      .optional(),

    status: vine
      .enum(['Pending', 'Confirmed', 'Picked Up', 'Returned', 'Cancelled', 'Penalized', 'Done'])
      .use(isAdminExceptRule(['Pending', 'Cancelled']))
      .optional(),
  }

  public create = vine.compile(vine.object({ idFacility: this.baseSchema.idFacility }))

  public update = vine.compile(
    vine.object({
      idApprover: this.baseSchema.idApprover.optional(),
      roomNumber: this.baseSchema.roomNumber.optional(),
      returnDate: this.baseSchema.returnDate.optional(),
      status: this.baseSchema.status.optional(),
    })
  )
}

vine.messagesProvider = new SimpleMessagesProvider({
  'idUser.number': 'User ID must be a number',
  'idUser.exists': 'User not found',

  'idFacility.required': 'Facility ID cannot be empty',
  'idFacility.number': 'Facility ID must be a number',
  'idFacility.exists': 'Facility not found',

  'idApprover.number': 'Approver ID must be a number',
  'idApprover.exists': 'Approver not found',

  'roomNumber.maxLength': 'Room number is too long (max 50 characters)',

  'bookingDate.regex': 'Invalid booking date format',
  'returnDate.regex': 'Invalid return date format',

  'status.enum': 'Invalid booking status',
})
