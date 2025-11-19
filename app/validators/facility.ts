import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class FacilityValidator {
  private baseSchema = {
    name: vine.string().minLength(1).maxLength(100),
    type: vine.string().minLength(1).maxLength(100),
    status: vine
      .enum(['Available', 'Booked', 'Borrowed', 'Under Inspection', 'Maintenance', 'Damaged'])
      .optional(),
  }

  public create = vine.compile(
    vine.object({
      ...this.baseSchema,
    })
  )

  public update = vine.compile(
    vine.object({
      name: this.baseSchema.name.optional(),
      status: this.baseSchema.status.optional(),
    })
  )
}

vine.messagesProvider = new SimpleMessagesProvider({
  // Name
  'name.required': 'Facility name is required',
  'name.string': 'Facility name must be a valid string',
  'name.minLength': 'Facility name cannot be empty',
  'name.maxLength': 'Facility name is too long',

  //type
  'type.required': 'Facility name is required',
  'type.string': 'Facility name must be a valid string',
  'type.minLength': 'Facility name cannot be empty',
  'type.maxLength': 'Facility name is too long',

  // Status
  'status.enum': 'Status is invalid',
})
