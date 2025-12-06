// File: resources/js/Components/FacilityForm.tsx (Revisi)

import React from 'react'
import { useForm } from '@inertiajs/react'
import { Building, Tag, Wrench, Loader2, AlertTriangle } from 'lucide-react'
import { router } from '@inertiajs/core'
import axios from 'axios'

// Interface untuk data fasilitas (sesuai dengan skema VineJS)
interface FacilityData {
  name: string
  type: string
  status?: 'Available' | 'Booked' | 'Borrowed' | 'Under Inspection' | 'Maintenance' | 'Damaged'
}

// Props untuk komponen formulir
interface FacilityFormProps {
  initialData?: FacilityData & { id: number } // Tambahkan ID untuk rute PUT
  isEdit: boolean // Menandakan apakah ini mode edit atau create
}

const FormField: React.FC<{
  id: keyof FacilityData
  label: string
  icon: React.FC<any>
  isSelect?: boolean
  options?: string[]
  isDisabled?: boolean
  data: any
  setData: any
  errors: any
  isEdit: boolean
}> = ({
  id,
  label,
  icon: Icon,
  isSelect = false,
  options,
  isDisabled = false,
  data,
  setData,
  errors,
  isEdit,
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-red-600" />
      {label}
    </label>
    {isSelect && options ? (
      <select
        id={id}
        value={data[id as 'type'] || data[id as 'status']}
        onChange={(e) => setData(id as any, e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white ${
          isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
        required
        disabled={isDisabled}
      >
        <option value="" disabled>
          Pilih {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        id={id}
        type="text"
        value={data[id as 'name']}
        onChange={(e) => setData(id as 'name', e.target.value as any)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
          errors[id] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={`Masukkan ${label.toLowerCase()}`}
        required={!isEdit || id === 'name'} // name wajib di create, optional di update
      />
    )}
    {errors[id] && <p className="text-sm text-red-500 mt-1">{errors[id]}</p>}
  </div>
)

const FacilityForm: React.FC<FacilityFormProps> = ({ initialData, isEdit }) => {
  const { data, setData, processing, errors } = useForm<FacilityData>(
    initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          status: initialData.status || 'Available', // Set status default jika di edit
        }
      : {
          name: '',
          type: '',
          // Status tidak dimasukkan di mode create, sesuai skema createFacilitySchema
        }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit && initialData) {
      // Mengirim semua bidang yang dapat diubah ke rute PUT
      axios
        .put(`/api/v1/facility/${initialData.id}`, data, { withCredentials: true })
        .then(() => router.visit('/facilities'))
      // put(`/api/v1/facility/${initialData.id}`, {
      //   onSuccess: () => router.visit('/facilities'),
      //   onError: (err) => {
      //     console.error(err)
      //     alert('Gagal memperbarui fasilitas.')
      //   },
      // })
    } else {
      // Mengirim hanya name dan type ke rute POST (sesuai createFacilitySchema)
      axios
        .post('/api/v1/facility', data, { withCredentials: true })
        .then(() => router.visit('/facilities'))
      // post('/api/v1/facility', {
      //   onSuccess: () => {
      //     alert('Fasilitas baru berhasil ditambahkan!')
      //     setData({ name: '', type: '' })
      //   },
      //   onError: (err) => {
      //     console.error(err)
      //     alert('Gagal menambahkan fasilitas.')
      //   },
      // })
    }
  }

  const facilityTypes = [
    'Ruang Rapat',
    'Auditorium',
    'Laboratorium',
    'Kendaraan',
    'Peralatan IT',
    'Lain-lain',
  ]

  // Opsi Status (sesuai enum VineJS)
  const statusOptions = [
    'Available',
    'Booked',
    'Borrowed',
    'Under Inspection',
    'Maintenance',
    'Damaged',
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6"
    >
      {/* Kolom Fasilitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="name"
          label="Nama Fasilitas"
          icon={Building}
          isEdit={isEdit}
          data={data}
          errors={errors}
          setData={setData}
        />
        <FormField
          id="type"
          label="Tipe Fasilitas"
          icon={Tag}
          isSelect
          options={facilityTypes}
          isEdit={isEdit}
          data={data}
          errors={errors}
          setData={setData}
        />
      </div>

      {/* Bidang Status (Hanya Muncul di Mode Edit) */}
      {isEdit && (
        <div className="md:w-1/2">
          <FormField
            isEdit={isEdit}
            data={data}
            errors={errors}
            setData={setData}
            id="status"
            label="Status Fasilitas"
            icon={Wrench}
            isSelect
            options={statusOptions}
            // Status harus selalu ada di mode edit berdasarkan skema update (jika ada)
          />
        </div>
      )}

      {/* Catatan untuk Status */}
      {isEdit && (
        <div className="p-3 text-sm text-gray-700 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="w-4 h-4 inline mr-2 text-red-600" />
          Perubahan status harus dilakukan dengan hati-hati. Status yang dipilih mempengaruhi
          ketersediaan fasilitas.
        </div>
      )}

      {/* Tombol Submit */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={processing}
          className={`px-6 py-3 flex items-center gap-2 rounded-lg font-semibold text-white transition-colors duration-200
            ${
              processing
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'
            }`}
        >
          {processing && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? 'Simpan Perubahan' : 'Buat Fasilitas Baru'}
        </button>
      </div>
    </form>
  )
}

export default FacilityForm
