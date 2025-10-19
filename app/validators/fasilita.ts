import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createFasilitasValidator = vine.compile(
  vine.object({
    nama: vine.string().maxLength(100),
  })
)
createFasilitasValidator.messagesProvider = new SimpleMessagesProvider({
  'nama.required': 'Nama wajib diisi',
  'nama.maxLength': 'Nama maksimal 100 karakter',
})
