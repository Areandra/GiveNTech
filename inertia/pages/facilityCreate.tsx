import { Head, router } from '@inertiajs/react'
import { Building, ArrowLeft } from 'lucide-react'
import AdminLayout from '../layout/AuthenticatedLayout'
import FacilityForm from '#components/FacilityForm'

const CreateFacility = ({ user }: any) => {
  return (
    <AdminLayout user={user} activeMenu="/facilities">
      <Head title="Tambah Fasilitas Baru" />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="w-7 h-7 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Buat Fasilitas Baru</h1>
        </div>
        <button
          onClick={() => router.visit('/facilities')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar
        </button>
      </div>

      <FacilityForm isEdit={false} />
    </AdminLayout>
  )
}

export default CreateFacility
