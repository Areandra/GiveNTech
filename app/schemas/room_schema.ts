// app/Validators/RoomValidator.ts
import vine from '@vinejs/vine'
// import isAdminRule from '#rules/is_admin_rules' // Tidak diperlukan untuk validasi field Room dasar

// --- 1. Base Room Schema ---
// Definisi aturan validasi untuk field-field di Model Room
export const baseRoomSchema = {
  // roomName (roomName di Model.ts)
  roomName: vine
    .string()
    .maxLength(100), // Batas panjang yang wajar

  // longitude (Wajib ada, harus berupa angka)
  // Rentang Longitude: -180 sampai 180 (untuk koordinat geografis yang valid)
  longitude: vine
    .number()
    .range([-180, 180]),

  // latitude (Wajib ada, harus berupa angka)
  // Rentang Latitude: -90 sampai 90 (untuk koordinat geografis yang valid)
  latitude: vine
    .number()
    .range([-90, 90]),

  // Tambahkan field opsional lainnya jika ada di tabel, misalnya 'description'
  // description: vine.string().maxLength(255).optional(), 
}

// --- 2. Create Room Schema ---
// Digunakan saat membuat data ruangan baru. Semua field inti wajib ada.
export const createRoomSchema = vine.object({
  roomName: baseRoomSchema.roomName,
  longitude: baseRoomSchema.longitude,
  latitude: baseRoomSchema.latitude,
  // description: baseRoomSchema.description,
})

// --- 3. Update Room Schema ---
// Digunakan saat memperbarui data ruangan. Semua field harus optional.
export const updateRoomSchema = vine.object({
  roomName: baseRoomSchema.roomName.optional(),
  longitude: baseRoomSchema.longitude.optional(),
  latitude: baseRoomSchema.latitude.optional(),
  // description: baseRoomSchema.description.optional(),
})