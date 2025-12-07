import {
  createBookingSchema,
  createMeBookingSchema,
  updateBookingSchema,
} from '#schemas/booking_schema'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

class BookingsValidator {
  public create = vine.compile(createBookingSchema)
  public createMe = vine.compile(createMeBookingSchema)
  public update = vine.compile(updateBookingSchema)
}

vine.messagesProvider = new SimpleMessagesProvider({
  'idUser.number': 'User ID must be a number',
  'idUser.exists': 'User not found',

  'idFacility.required': 'Facility ID cannot be empty',
  'idFacility.number': 'Facility ID must be a number',
  'idFacility.exists': 'Facility not found',

  'idApprover.number': 'Approver ID must be a number',
  'idApprover.exists': 'Approver not found',

  'purpose.required': 'Purpose ID cannot be empty',

  'roomNumber.maxLength': 'Room number is too long (max 50 characters)',

  'returnDate.regex': 'Invalid return date format. Use YYYY-MM-DDTHH:MM:SS format.',

  'status.enum':
    'Invalid booking status. Allowed values: Pending, Confirmed, Picked Up, Returned, Cancelled, Penalized, Done.',
})

export default new BookingsValidator()
