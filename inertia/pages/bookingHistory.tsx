import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { 
  Calendar, 
  Building, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  History as HistoryIcon
} from 'lucide-react'

const BookingHistory = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBookings, setSelectedBookings] = useState<number[]>([])

  const bookings = [
    {
      id: 1,
      facilityName: 'Ruang Meeting A',
      facilityType: 'Meeting Room',
      date: '2024-01-25',
      time: '09:00 - 11:00',
      status: 'approved',
      bookingDate: '2024-01-20 10:30',
      location: 'Gedung Utama Lt. 3',
      participants: 10,
      purpose: 'Meeting Tim Marketing'
    },
    {
      id: 2,
      facilityName: 'Laboratorium Komputer',
      facilityType: 'Laboratory',
      date: '2024-01-26',
      time: '13:00 - 15:00',
      status: 'pending',
      bookingDate: '2024-01-21 14:20',
      location: 'Gedung Teknik Lt. 2',
      participants: 25,
      purpose: 'Praktikum Mahasiswa'
    },
    {
      id: 3,
      facilityName: 'Lapangan Basket',
      facilityType: 'Sports Facility',
      date: '2024-01-24',
      time: '16:00 - 18:00',
      status: 'completed',
      bookingDate: '2024-01-19 09:15',
      location: 'Area Olahraga',
      participants: 15,
      purpose: 'Latihan Tim Basket'
    },
    {
      id: 4,
      facilityName: 'Auditorium',
      facilityType: 'Auditorium',
      date: '2024-01-23',
      time: '10:00 - 12:00',
      status: 'rejected',
      bookingDate: '2024-01-18 16:45',
      location: 'Gedung Utama Lt. 1',
      participants: 150,
      purpose: 'Seminar Nasional'
    },
    {
      id: 5,
      facilityName: 'Studio Musik',
      facilityType: 'Studio',
      date: '2024-01-22',
      time: '14:00 - 16:00',
      status: 'approved',
      bookingDate: '2024-01-17 11:30',
      location: 'Gedung Seni Lt. 1',
      participants: 8,
      purpose: 'Rekaman Band'
    },
    {
      id: 6,
      facilityName: 'Perpustakaan',
      facilityType: 'Library',
      date: '2024-01-21',
      time: '08:00 - 12:00',
      status: 'cancelled',
      bookingDate: '2024-01-16 13:20',
      location: 'Gedung Pusat Lt. 2',
      participants: 5,
      purpose: 'Studi Kelompok'
    }
  ]

  const handleViewBooking = (id: number) => {
    router.visit(`/bookings/${id}`)
  }

  const handleCancelBooking = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      // Cancel logic here
      console.log('Cancel booking:', id)
    }
  }

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(bookings.map(b => b.id))
    }
  }

  const handleSelectBooking = (id: number) => {
    setSelectedBookings(prev => 
      prev.includes(id) 
        ? prev.filter(bookingId => bookingId !== id)
        : [...prev, id]
    )
  }

  const getStatusConfig = (status: string) => {
    const config: any = {
      approved: { 
        color: 'bg-green-100 text-green-800', 
        icon: <CheckCircle className="h-3 w-3" />, 
        label: 'Disetujui',
        badgeColor: 'border-green-200 bg-green-50'
      },
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <Clock className="h-3 w-3" />, 
        label: 'Menunggu',
        badgeColor: 'border-yellow-200 bg-yellow-50'
      },
      completed: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <CheckCircle className="h-3 w-3" />, 
        label: 'Selesai',
        badgeColor: 'border-blue-200 bg-blue-50'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800', 
        icon: <XCircle className="h-3 w-3" />, 
        label: 'Ditolak',
        badgeColor: 'border-red-200 bg-red-50'
      },
      cancelled: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: <XCircle className="h-3 w-3" />, 
        label: 'Dibatalkan',
        badgeColor: 'border-gray-200 bg-gray-50'
      }
    }
    return config[status] || config.pending
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: bookings.length,
    approved: bookings.filter(b => b.status === 'approved').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Riwayat Booking" />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <HistoryIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Riwayat Booking</h1>
                <p className="text-gray-600">Kelola dan pantau semua booking Anda</p>
              </div>
            </div>
            <button 
              onClick={() => router.visit('/facilities')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Booking Baru
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Booking</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Disetujui</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.approved}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Menunggu</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Selesai</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari booking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="approved">Disetujui</option>
              <option value="pending">Menunggu</option>
              <option value="completed">Selesai</option>
              <option value="rejected">Ditolak</option>
              <option value="cancelled">Dibatalkan</option>
            </select>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBookings.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    {selectedBookings.length} booking dipilih
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-lg">
                    Batalkan Selected
                  </button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                    Download Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === bookings.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-red-600 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fasilitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal & Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibooking Pada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status)
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={() => handleSelectBooking(booking.id)}
                          className="h-4 w-4 text-red-600 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.facilityName}</div>
                          <div className="text-sm text-gray-500">{booking.facilityType}</div>
                          <div className="text-xs text-gray-400 mt-1">{booking.purpose}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{booking.date}</div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                        <div className="text-xs text-gray-400 mt-1">{booking.participants} peserta</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{booking.bookingDate.split(' ')[0]}</div>
                        <div className="text-sm text-gray-500">{booking.bookingDate.split(' ')[1]}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleViewBooking(booking.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {(booking.status === 'pending' || booking.status === 'approved') && (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Batalkan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          {booking.status === 'completed' && (
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* No Results */}
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada booking ditemukan</h3>
              <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
            </div>
          )}

          {/* Table Footer */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Menampilkan <span className="font-medium">{filteredBookings.length}</span> dari <span className="font-medium">{bookings.length}</span> booking
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">←</button>
                <button className="px-3 py-1 border rounded text-sm bg-gray-100 font-medium">1</button>
                <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">→</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2">Tips Booking</h4>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Booking minimal 1 hari sebelum penggunaan</li>
              <li>• Pastikan data booking sudah benar</li>
              <li>• Batalkan booking jika tidak jadi digunakan</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-2">Status Booking</h4>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• <span className="font-medium">Menunggu:</span> Sedang diverifikasi admin</li>
              <li>• <span className="font-medium">Disetujui:</span> Booking sudah dikonfirmasi</li>
              <li>• <span className="font-medium">Selesai:</span> Fasilitas sudah digunakan</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-2">Perhatian</h4>
            <ul className="text-red-800 text-sm space-y-2">
              <li>• Batalkan booking minimal 2 jam sebelumnya</li>
              <li>• Tidak hadir 3x = blokir sementara</li>
              <li>• Laporkan masalah segera ke admin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingHistory