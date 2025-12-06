// File: resources/js/Components/RoomForm.tsx

import React from 'react'
import { useForm } from '@inertiajs/react'
import { MapPin, Hash, Building2, Loader2 } from 'lucide-react'
import { router } from '@inertiajs/core'
import axios from 'axios'

interface RoomData {
  roomName: string
  longitude: number | ''
  latitude: number | ''
}

interface RoomFormProps {
  initialData?: RoomData & { id: number }
  isEdit: boolean
}

const FormField: React.FC<{
  id: keyof RoomData
  type: string
  label: string
  icon: React.FC<any>
  data: any
  setData: any
  errors: any
}> = ({ id, type, label, icon: Icon, data, setData, errors }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-blue-600" /> {label}
    </label>

    <input
      type={type}
      value={data[id] ?? ''}
      onChange={(e) =>
        setData(id, type === 'number' ? Number(e.target.value) : e.target.value)
      }
      required
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        errors[id] ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={`Masukkan ${label.toLowerCase()}`}
    />

    {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
  </div>
)

const RoomForm: React.FC<RoomFormProps> = ({ initialData, isEdit }) => {
  const { data, setData, processing, errors } = useForm<RoomData>(
    initialData
      ? {
          roomName: initialData.roomName,
          longitude: initialData.longitude,
          latitude: initialData.latitude,
        }
      : {
          roomName: '',
          longitude: '',
          latitude: '',
        }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit && initialData) {
      axios
        .put(`/api/v1/room/${initialData.id}`, data, { withCredentials: true })
        .then(() => router.visit('/room'))
    } else {
      axios
        .post('/api/v1/room', data, { withCredentials: true })
        .then(() => router.visit('/room'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg border p-6 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="roomName"
          type="text"
          label="Nama Ruangan"
          icon={Building2}
          data={data}
          setData={setData}
          errors={errors}
        />

        <FormField
          id="longitude"
          type="number"
          label="Longitude"
          icon={MapPin}
          data={data}
          setData={setData}
          errors={errors}
        />

        <FormField
          id="latitude"
          type="number"
          label="Latitude"
          icon={Hash}
          data={data}
          setData={setData}
          errors={errors}
        />
      </div>

      <div className="pt-4 border-t flex justify-end">
        <button
          type="submit"
          disabled={processing}
          className={`px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2 ${
            processing
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md'
          }`}
        >
          {processing && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? 'Simpan Perubahan' : 'Buat Ruangan Baru'}
        </button>
      </div>
    </form>
  )
}

export default RoomForm
