import { createFacilitySchema, updateFacilitySchema } from '#schemas/facility_schema'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

class FacilityValidator {
  public create = vine.compile(createFacilitySchema)
  public update = vine.compile(updateFacilitySchema)
}

vine.messagesProvider = new SimpleMessagesProvider({
  'name.required': 'Facility name is required',
  'name.string': 'Facility name must be a valid string',
  'name.minLength': 'Facility name cannot be empty',
  'name.maxLength': 'Facility name is too long (max 100 characters)',

  'type.required': 'Facility type is required',
  'type.string': 'Facility type must be a valid string',
  'type.minLength': 'Facility type cannot be empty',
  'type.maxLength': 'Facility type is too long (max 100 characters)',

  'status.enum':
    'Status is invalid. Allowed values: Available, Booked, Borrowed, Under Inspection, Maintenance, Damaged',
})

export default new FacilityValidator()
