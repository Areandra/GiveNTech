// File: resources/js/Pages/Facilities/EditFacility.tsx (Revisi)

import React from 'react'
import { Head, router } from '@inertiajs/react'
import { ArrowLeft, Edit } from 'lucide-react'
import FacilityForm from '#components/FacilityForm'
import AdminLayout from '#layout/AuthenticatedLayout'

// Tipe data fasilitas (sesuai dengan skema VineJS + ID)
interface Facility {
  id: number
  name: string
  type: string
  status: 'Available' | 'Booked' | 'Borrowed' | 'Under Inspection' | 'Maintenance' | 'Damaged'
  // Tidak ada location dan capacity lagi
}

interface EditFacilityProps {
  facility: Facility
  user: any
}

const EditFacility: React.FC<EditFacilityProps> = ({ facility, user }) => {
  return (
    <AdminLayout user={user} activeMenu="/facilities">
      <Head title={`Edit Fasilitas: ${facility.name}`} />

      {/* Header Halaman */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Edit className="w-7 h-7 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Fasilitas: {facility.name}</h1>
        </div>
        <button
          onClick={() => router.visit('/facilities')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar
        </button>
      </div>

      {/* Konten Formulir */}
      <FacilityForm
        isEdit={true}
        initialData={{
          id: facility.id,
          name: facility.name,
          type: facility.type,
          status: facility.status,
        }}
      />

      {/* Detail Tambahan (Contoh) */}
      <div className="mt-6 p-4 bg-gray-100 rounded-xl border border-gray-200 text-sm text-gray-600">
        <p className="font-semibold text-gray-700 mb-1">Informasi Sistem:</p>
        <p>
          ID Fasilitas: <span className="font-mono text-gray-800">FAC-{facility.id}</span>
        </p>
        <p>
          Status Aktif: <span className="font-medium text-red-600">{facility.status}</span>
        </p>
      </div>
    </AdminLayout>
  )
}

export default EditFacility
