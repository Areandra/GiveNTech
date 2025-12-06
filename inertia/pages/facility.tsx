import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Building,
  Calendar,
  Menu,
  X,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Wrench,
  Edit,
  Trash2,
  Package,
  AlertCircle,
} from 'lucide-react'
import AdminLayout from '#layout/AuthenticatedLayout'

interface Facility {
  id: number
  name: string
  type: string
  status: 'Available' | 'Booked' | 'Borrowed' | 'Under Inspection' | 'Maintenance' | 'Damaged'
  createdAt: string
  updatedAt: string
}

const facilities = ({ user, facilities }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusConfig = (status: Facility['status']) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Tersedia',
        }
      case 'Booked':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <Calendar className="w-3 h-3 mr-1" />,
          label: 'Dipesan',
        }
      case 'Borrowed':
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          icon: <Package className="w-3 h-3 mr-1" />,
          label: 'Dipinjam',
        }
      case 'Under Inspection':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          label: 'Inspeksi',
        }
      case 'Maintenance':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: <Wrench className="w-3 h-3 mr-1" />,
          label: 'Perbaikan',
        }
      case 'Damaged':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <XCircle className="w-3 h-3 mr-1" />,
          label: 'Rusak',
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          label: status,
        }
    }
  }

  const PerformanceBar = ({ status }: { status: Facility['status'] }) => {
    const map: Record<Facility['status'], { label: string; color: string; width: string }> = {
      'Available': { label: 'Good', color: 'bg-green-500', width: '70%' },
      'Booked': { label: 'Booked', color: 'bg-blue-500', width: '50%' },
      'Borrowed': { label: 'Borrowed', color: 'bg-indigo-500', width: '40%' },
      'Under Inspection': { label: 'Inspection', color: 'bg-yellow-500', width: '35%' },
      'Maintenance': { label: 'Maintenance', color: 'bg-orange-500', width: '30%' },
      'Damaged': { label: 'Damaged', color: 'bg-red-500', width: '20%' },
    }
    const info = map[status]

    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full">
          <div className={`h-full rounded-full ${info.color}`} style={{ width: info.width }} />
        </div>
        <span className="text-xs font-medium text-gray-700">{info.label}</span>
      </div>
    )
  }

  const filteredFacilities = facilities.filter((facility: Facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && facility.status === 'Available') ||
      (statusFilter === 'booked' && facility.status === 'Booked') ||
      (statusFilter === 'borrowed' && facility.status === 'Borrowed') ||
      (statusFilter === 'inspection' && facility.status === 'Under Inspection') ||
      (statusFilter === 'maintenance' && facility.status === 'Maintenance') ||
      (statusFilter === 'damaged' && facility.status === 'Damaged')

    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout user={user} activeMenu="/facilities">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Facility Management</h1>
              <p className="text-gray-600 text-sm">Kelola semua fasilitas</p>
            </div>
          </div>

          <button
            onClick={() => router.visit('/facilities/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Fasilitas Baru
          </button>
        </div>
      </header>

      <main className="flex-1 mt-6 bg-gray-50">
        <Head title="Facility Management" />

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
                <option value="borrowed">Dipinjam</option>
                <option value="inspection">Inspeksi</option>
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
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{facilities.length}</h3>
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
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {facilities.filter((f: Facility) => f.status === 'Available').length}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Perbaikan</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {facilities.filter((f: Facility) => f.status === 'Maintenance').length}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tidak Tersedia</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {facilities.filter((f: Facility) => f.status === 'Damaged').length}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fasilitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFacilities.map((facility: Facility) => {
                  const statusConfig = getStatusConfig(facility.status)

                  return (
                    <tr key={facility.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{facility.name}</div>
                            <div className="text-xs text-gray-500">
                              ID: FAC-{facility.id.toString().padStart(3, '0')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{facility.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <PerformanceBar status={facility.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">{formatDate(facility.createdAt)}</div>
                        <div className="text-xs text-gray-500">
                          Diperbarui: {formatDate(facility.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => router.visit(`/facilities/${facility.id}/edit`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AdminLayout>
  )
}

export default facilities
