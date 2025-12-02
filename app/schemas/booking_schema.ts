import isAdminExceptRule from '#rules/is_admin_except_rules'
import isAdminRule from '#rules/is_admin_rules'
import vine from '@vinejs/vine'

export const baseBookingSchema = {
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
    .use(isAdminRule())
    .optional(),

  // roomNumber: vine.string().maxLength(50).optional(),
  idRoom: vine.number().exists({
    table: 'rooms',
    column: 'id',
  }),

  bookingDate: vine
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    .optional(),

  returnDate: vine
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    .use(isAdminRule())
    .optional(),

  status: vine
    .enum(['Pending', 'Confirmed', 'Picked Up', 'Returned', 'Cancelled', 'Penalized', 'Done'])
    .use(isAdminExceptRule(['Pending', 'Cancelled']))
    .optional(),
}

export const createBookingSchema = vine.object({
  idUser: baseBookingSchema.idUser.optional(),
  idRoom: baseBookingSchema.idRoom.optional(),
  idFacility: baseBookingSchema.idFacility,
})

export const createMeBookingSchema = vine.object({
  idFacility: baseBookingSchema.idFacility,
  idRoom: baseBookingSchema.idRoom,
})

export const updateBookingSchema = vine.object({
  idFacility: baseBookingSchema.idFacility.use(isAdminRule()).optional(),

  idApprover: baseBookingSchema.idApprover,
  returnDate: baseBookingSchema.returnDate,
  status: baseBookingSchema.status,

  idRoom: baseBookingSchema.idRoom,
})
