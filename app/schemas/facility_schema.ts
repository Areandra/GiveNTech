import vine from '@vinejs/vine'

export const baseFacilitySchema = {
  name: vine.string().minLength(1).maxLength(100),
  type: vine.string().minLength(1).maxLength(100),
  status: vine
    .enum(['Available', 'Booked', 'Borrowed', 'Under Inspection', 'Maintenance', 'Damaged'])
    .optional(),
}

export const createFacilitySchema = vine.object({
  ...baseFacilitySchema,
})

export const updateFacilitySchema = vine.object({
  name: baseFacilitySchema.name.optional(),
  type: baseFacilitySchema.type.optional(),
  status: baseFacilitySchema.status.optional(),
})
