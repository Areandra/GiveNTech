import { Head, router } from '@inertiajs/react'
import { Building2, ArrowLeft } from 'lucide-react'
import AdminLayout from '../layout/AuthenticatedLayout'
import RoomForm from '#components/RoomForm'

const CreateRoom = ({ user }: any) => {
  return (
    <AdminLayout user={user} activeMenu="/rooms">
      <Head title="Tambah Ruangan Baru" />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Buat Ruangan Baru</h1>
        </div>
        <button
          onClick={() => router.visit('/room')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      <RoomForm isEdit={false} />
    </AdminLayout>
  )
}

export default CreateRoom
