import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Building,
  Search,
  Calendar,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Wrench,
  CheckCircle,
  XCircle,
  Tag,
  Hash,
} from 'lucide-react'

export interface Facility {
  id: number
  name: string
  type: string
  createdAt: string
  updatedAt: string
  status: 'Available' | 'Booked' | 'Maintenance' | 'Damaged'
}

const UserFacilityList = ({ facilities = [{} as any] }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const handleBookFacility = (facilityId: number) => {
    router.visit(`/booking/create/${facilityId}/`)
  }

  const handleViewDetail = (facilityId: number) => {
    router.visit(`/facilities/${facilityId}`)
  }

  const getFacilityIcon = (type: string) => {
    const primaryColor = 'text-red-600'
    const secondaryColor = 'text-gray-600'

    if (type.includes('Ruang')) return <Building className={`h-5 w-5 ${primaryColor}`} />
    if (type.includes('Alat') || type.includes('Proyektor'))
      return <Tag className={`h-5 w-5 ${secondaryColor}`} />
    return <Building className={`h-5 w-5 ${secondaryColor}`} />
  }

  const getStatusConfig = (status: Facility['status']) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Tersedia' }
      case 'Booked':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Calendar, label: 'Dipesan' }
      case 'Maintenance':
        return { bg: 'bg-orange-100', text: 'text-orange-800', icon: Wrench, label: 'Perawatan' }
      case 'Damaged':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rusak' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Tidak Diketahui' }
    }
  }

  const filteredFacilities = facilities
    .filter((facility) => {
      const matchesSearch =
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || facility.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'type') return a.type.localeCompare(b.type)
      return 0
    })

  const uniqueTypes = Array.from(new Set(facilities.map((f) => f.type)))

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Daftar Fasilitas" />

      <div className="bg-white shadow border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.visit('/user/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Daftar Fasilitas</h1>
                <p className="text-gray-600 text-sm">Pilih dan pinjam fasilitas yang tersedia</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau jenis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Semua Jenis</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="name">Sortir: Nama</option>
              <option value="type">Sortir: Jenis</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => {
            const statusConfig = getStatusConfig(facility.status)
            const isAvailable = facility.status === 'Available'

            return (
              <div
                key={facility.id}
                className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden transition-shadow duration-300"
              >
                <div
                  className={`p-4 flex items-center justify-between ${statusConfig.bg} border-b border-gray-200`}
                >
                  <div className={`flex items-center text-sm font-semibold ${statusConfig.text}`}>
                    <statusConfig.icon className="h-4 w-4 mr-2" />
                    {statusConfig.label}
                  </div>
                  <span className={`text-xs font-medium text-gray-600 flex items-center`}>
                    <Hash className="w-3 h-3 mr-1" /> ID: {facility.id}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                      {getFacilityIcon(facility.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
                      <span className="text-sm font-medium text-gray-600">{facility.type}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 border-t pt-3">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-sm">
                        Dibuat: {new Date(facility.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs">
                        Update: {new Date(facility.updatedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewDetail(facility.id)}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      Lihat Detail
                    </button>
                    <button
                      onClick={() => handleBookFacility(facility.id)}
                      disabled={!isAvailable}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        isAvailable
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Pinjam
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
            <Building className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada fasilitas ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        )}

        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">
                {facilities.filter((f) => f.status === 'Available').length}
              </div>
              <p className="text-red-800 font-medium">Fasilitas Tersedia</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">{facilities.length}</div>
              <p className="text-red-800 font-medium">Total Fasilitas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">{uniqueTypes.length}</div>
              <p className="text-red-800 font-medium">Jenis Fasilitas</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-red-600" />
              </div>
              <h4 className="font-bold text-red-900">Cara Meminjam</h4>
            </div>
            <ul className="text-red-800 text-sm space-y-2 list-disc pl-5">
              <li>Pilih fasilitas yang tersedia</li>
              <li>Isi formulir peminjaman</li>
              <li>Tunggu verifikasi admin</li>
              <li>Ambil fasilitas di lokasi</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-bold text-green-900">Durasi Peminjaman</h4>
            </div>
            <ul className="text-green-800 text-sm space-y-2 list-disc pl-5">
              <li>Maksimal 7 hari untuk alat</li>
              <li>Maksimal 1 hari untuk ruangan</li>
              <li>Dapat diperpanjang jika tersedia</li>
              <li>Kembalikan tepat waktu</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <h4 className="font-bold text-yellow-900">Perhatian</h4>
            </div>
            <ul className="text-yellow-800 text-sm space-y-2 list-disc pl-5">
              <li>Jaga kebersihan fasilitas</li>
              <li>Laporkan kerusakan segera</li>
              <li>Denda keterlambatan berlaku</li>
              <li>Bawa KTM saat mengambil</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserFacilityList
