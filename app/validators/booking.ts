import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createBookingsValidator = vine.compile(
  vine.object({
    id_fasilitas: vine.number().positive(),
    no_ruang: vine.string().maxLength(50),
  })
)
createBookingsValidator.messagesProvider = new SimpleMessagesProvider({
  'id_users.required': 'Nama wajib diisi',
  'id_fasilitas.positive': 'fk wajib postive',
  'no_ruang.maxLength': 'Nama maksimal 50 karakter',
  'no_ruang.string': 'Nama wajib string',
})
