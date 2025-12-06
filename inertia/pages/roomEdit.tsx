// File: resources/js/Pages/Rooms/EditRoom.tsx

import React from 'react'
import { Head, router } from '@inertiajs/react'
import { Edit, ArrowLeft } from 'lucide-react'
import AdminLayout from '#layout/AuthenticatedLayout'
import RoomForm from '#components/RoomForm'

interface Room {
  id: number
  roomName: string
  longitude: number
  latitude: number
}

interface EditRoomProps {
  room: Room
  user: any
}

const EditRoom: React.FC<EditRoomProps> = ({ room, user }) => {
  return (
    <AdminLayout user={user} activeMenu="/rooms">
      <Head title={`Edit Ruangan: ${room.roomName}`} />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Edit className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Ruangan: {room.roomName}
          </h1>
        </div>

        <button
          onClick={() => router.visit('/rooms')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      <RoomForm
        isEdit={true}
        initialData={{
          id: room.id,
          roomName: room.roomName,
          longitude: room.longitude,
          latitude: room.latitude,
        }}
      />

      <div className="mt-6 p-4 bg-gray-100 border rounded-xl text-sm text-gray-700">
        <p className="font-semibold">Informasi Sistem:</p>
        <p>ID Ruangan: <span className="font-mono">ROOM-{room.id}</span></p>
        <p>Koordinat: {room.latitude}, {room.longitude}</p>
      </div>
    </AdminLayout>
  )
}

export default EditRoom
