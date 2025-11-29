import { createRoomSchema, updateRoomSchema } from '#schemas/room_schema'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

class RoomsValidator {
  /**
   * Skema kompilasi untuk validasi saat membuat Room (POST)
   */
  public create = vine.compile(createRoomSchema)
  
  /**
   * Skema kompilasi untuk validasi saat memperbarui Room (PUT/PATCH)
   */
  public update = vine.compile(updateRoomSchema)
}

// --- Pesan Kesalahan Kustom untuk Room ---
// Menggunakan SimpleMessagesProvider untuk pesan yang lebih informatif
vine.messagesProvider = new SimpleMessagesProvider({
  // Pesan untuk field roomName
  'roomName.required': 'Nama Ruangan tidak boleh kosong.',
  'roomName.string': 'Nama Ruangan harus berupa teks.',
  'roomName.maxLength': 'Nama Ruangan terlalu panjang (maksimal 100 karakter).',

  // Pesan untuk field longitude
  'longitude.required': 'Longitude tidak boleh kosong.',
  'longitude.number': 'Longitude harus berupa angka.',
  'longitude.range': 'Nilai Longitude harus antara -180 dan 180.',

  // Pesan untuk field latitude
  'latitude.required': 'Latitude tidak boleh kosong.',
  'latitude.number': 'Latitude harus berupa angka.',
  'latitude.range': 'Nilai Latitude harus antara -90 dan 90.',
})

export default new RoomsValidator()