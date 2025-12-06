import { useEffect, useState } from 'react'
import { Head } from '@inertiajs/react'
import { Building, Search, CheckCircle, Wrench, Calendar } from 'lucide-react'
import AdminLayout from '../layout/AuthenticatedLayout'
import { io } from 'socket.io-client'
import { router } from '@inertiajs/core'

interface DashboardProps {
  grafik: any
  stats: {
    totalFacilities: number
    availableFacilities: number
    bookedFacilities: number
    maintenanceFacilities: number
  }
  user: any
}

const DashboardPage = ({ user, stats, grafik }: DashboardProps) => {
  useEffect(() => {
    io().on('bookingReload', () => router.reload())
    io().on('facilityReload', () => router.reload())

    io().off('bookingReload', () => router.reload())
    io().off('facilityReload', () => router.reload())
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  return (
    <AdminLayout user={user} activeMenu="/dashboard">
      <Head title="Dashboard" />

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari fasilitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="booked">Dipesan</option>
              <option value="maintenance">Perbaikan</option>
              <option value="damaged">Rusak</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Fasilitas</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalFacilities}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tersedia</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.availableFacilities}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Dipesan</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.bookedFacilities}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Perawatan</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.maintenanceFacilities}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Wrench className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl justify-center shadow border border-gray-200 overflow-hidden">
        <img src={`data:image/png;base64,${grafik}`} alt="Revenue Chart" className="m-3" />
      </div>
    </AdminLayout>
  )
}

export default DashboardPage
