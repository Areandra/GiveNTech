import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Building,
  MapPin,
  Navigation,
  Menu,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Map,
  Calendar,
  Globe,
  ChevronRight,
  User,
} from 'lucide-react'
import AdminLayout from '#layout/AuthenticatedLayout'
import { io } from 'socket.io-client'

interface Room {
  id: number
  roomName: string
  longitude: number
  latitude: number
  createdAt: string
  updatedAt: string
  _count?: {
    bookings: number
  }
}

const rooms = ({ user, rooms }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  useEffect(() => {
    io().on('roomReload', () => router.reload())
    io().off('roomReload', () => router.reload())
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  const openGoogleMapsDirection = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
  }

  const filteredRooms = rooms.filter((room: Room) => {
    return room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleDeleteRoom = async (roomId: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
      try {
        await router.delete(`/room/${roomId}`)
      } catch (error) {
        console.error('Gagal menghapus ruangan:', error)
      }
    }
  }

  return (
    <AdminLayout user={user} activeMenu="/room">
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
              <h1 className="text-xl font-bold text-gray-900">Room Management</h1>
              <p className="text-gray-600 text-sm">Kelola semua ruangan dan lokasi</p>
            </div>
          </div>

          <button
            onClick={() => router.visit('/room/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ruangan Baru
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 bg-gray-50">
        <Head title="Room Management" />

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari ruangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Ruangan</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{rooms.length}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Booking</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {rooms.reduce((sum: number, room: Room) => sum + (room._count?.bookings || 0), 0)}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Koordinat GPS</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{rooms.length}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rata-rata Booking</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {rooms.length > 0
                    ? Math.round(
                        rooms.reduce(
                          (sum: number, room: Room) => sum + (room._count?.bookings || 0),
                          0
                        ) / rooms.length
                      )
                    : 0}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <User className="w-6 h-6 text-red-600" />
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
                    Ruangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Koordinat GPS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Navigasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRooms.map((room: Room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedRoom(room)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{room.roomName}</div>
                          <div className="text-xs text-gray-500">
                            ID: ROOM-{room.id.toString().padStart(3, '0')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Lat:</span>
                          <span className="font-mono text-sm text-gray-900">
                            {Number(room.latitude).toFixed(6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Long:</span>
                          <span className="font-mono text-sm text-gray-900">
                            {Number(room.longitude).toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {room._count?.bookings || 0}
                        </span>
                        <span className="text-xs text-gray-500">booking</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{formatDate(room.createdAt)}</div>
                      <div className="text-xs text-gray-500">
                        Diperbarui: {formatDate(room.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openGoogleMaps(room.latitude, room.longitude)
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          <Map className="w-3 h-3" />
                          Lihat di Maps
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openGoogleMapsDirection(room.latitude, room.longitude)
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          <Navigation className="w-3 h-3" />
                          Rute ke Sini
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="flex items-center space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => router.visit(`/room/${room.id}/edit`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.visit(`/room/${room.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Detail"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Detail Ruangan</h3>
                  <p className="text-gray-600 text-sm">Informasi lengkap ruangan</p>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Informasi Ruangan</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600">Nama Ruangan</div>
                        <div className="font-medium text-gray-900">{selectedRoom.roomName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">ID Ruangan</div>
                        <div className="font-mono text-gray-900">
                          ROOM-{selectedRoom.id.toString().padStart(3, '0')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Dibuat Pada</div>
                        <div className="text-gray-900">{formatDate(selectedRoom.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Diperbarui Pada</div>
                        <div className="text-gray-900">{formatDate(selectedRoom.updatedAt)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Koordinat GPS</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Latitude</div>
                            <div className="font-mono text-lg font-bold text-gray-900">
                              {Number(selectedRoom.latitude).toFixed(6)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Longitude</div>
                            <div className="font-mono text-lg font-bold text-gray-900">
                              {Number(selectedRoom.longitude).toFixed(6)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            openGoogleMaps(selectedRoom.latitude, selectedRoom.longitude)
                          }
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Map className="w-5 h-5" />
                          Buka di Google Maps
                        </button>
                        <button
                          onClick={() =>
                            openGoogleMapsDirection(selectedRoom.latitude, selectedRoom.longitude)
                          }
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Navigation className="w-5 h-5" />
                          Dapatkan Rute
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-bold text-gray-900 mb-4">Statistik Booking</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600">Total Booking</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedRoom._count?.bookings || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => router.visit(`/room/${selectedRoom.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Ruangan
                    </button>
                    <button
                      onClick={() => selectedRoom.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                      Hapus Ruangan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-blue-900">Manajemen Lokasi</h4>
            </div>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Kelola semua ruangan dengan koordinat GPS</li>
              <li>• Integrasi langsung dengan Google Maps</li>
              <li>• Navigasi mudah ke lokasi ruangan</li>
              <li>• Pantau penggunaan ruangan</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Navigation className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-bold text-green-900">Navigasi Mudah</h4>
            </div>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• Lihat langsung di Google Maps</li>
              <li>• Dapatkan rute navigasi</li>
              <li>• Koordinat akurat untuk pencarian</li>
              <li>• Share lokasi dengan mudah</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-bold text-purple-900">Tracking Booking</h4>
            </div>
            <ul className="text-purple-800 text-sm space-y-2">
              <li>• Pantau jumlah booking per ruangan</li>
              <li>• Analisis penggunaan ruangan</li>
              <li>• Optimalkan penjadwalan</li>
              <li>• Identifikasi ruangan populer</li>
            </ul>
          </div>
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada ruangan</h3>
            <p className="text-gray-500 mb-6">Belum ada ruangan yang terdaftar</p>
            <button
              onClick={() => router.visit('/room/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
              Tambah Ruangan Pertama
            </button>
          </div>
        )}
      </main>
    </AdminLayout>
  )
}

export default rooms
