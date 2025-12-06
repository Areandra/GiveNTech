import { useEffect, useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import {
  Calendar,
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
  History as HistoryIcon,
  Package,
  Tag,
  ArrowLeft,
  QrCode,
  Home,
  Building,
  History,
} from 'lucide-react'

import { Booking, BookingStatus } from '~/types'
import { io } from 'socket.io-client'

const BottomNav = () => {
  const { url } = usePage()

  const isActive = (path: string) => url.startsWith(path)
  const base = 'flex flex-col items-center text-xs'

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around py-3">
        <button
          disabled={isActive('/user/dashboard')}
          onClick={() => router.visit('/user/dashboard')}
          className={`${base} ${isActive('/user/dashboard') ? 'text-red-600' : 'text-gray-600'}`}
        >
          <Home className="h-6 w-6" />
          <span className="mt-1">Home</span>
        </button>

        <button
          disabled={isActive('/user/facilities')}
          onClick={() => router.visit('/user/facilities')}
          className={`${base} ${isActive('/user/facilities') ? 'text-red-600' : 'text-gray-600'}`}
        >
          <Building className="h-6 w-6" />
          <span className="mt-1">Fasilitas</span>
        </button>

        <button
          disabled={isActive('/history')}
          onClick={() => router.visit('/history')}
          className={`${base} ${isActive('/history') ? 'text-red-600' : 'text-gray-600'}`}
        >
          <History className="h-6 w-6" />
          <span className="mt-1">Riwayat</span>
        </button>
      </div>
    </div>
  )
}
interface BookingHistoryProps {
  bookings: Booking[]
}

const BookingHistory = ({ bookings }: BookingHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBookings, setSelectedBookings] = useState<number[]>([])

  useEffect(() => {
    io().on('bookingReload', () => router.reload())
    io().on('facilityReload', () => router.reload())

    io().off('bookingReload', () => router.reload())
    io().off('facilityReload', () => router.reload())
  }, [])

  const safeBookings: Booking[] = bookings || []

  const handleViewBooking = (id: number) => {
    router.visit(`/bookings/${id}`)
  }

  const handleShowQrCode = (id: number) => {
    router.visit(`/booking/${id}/qr`)
  }

  const handleCancelBooking = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      console.log('Cancel booking:', id)
    }
  }

  const handleSelectAll = () => {
    const allIds = safeBookings.map((b) => b.id)
    if (selectedBookings.length === allIds.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(allIds)
    }
  }

  const handleSelectBooking = (id: number) => {
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((bookingId) => bookingId !== id) : [...prev, id]
    )
  }

  const getStatusConfig = (status: BookingStatus) => {
    const config = {
      'Pending': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-3 w-3" />,
        label: 'Menunggu',
      },
      'Confirmed': {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Disetujui',
      },
      'Picked Up': {
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="h-3 w-3" />,
        label: 'Diambil',
      },
      'Returned': {
        color: 'bg-teal-100 text-teal-800',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Dikembalikan',
      },
      'Cancelled': {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-3 w-3" />,
        label: 'Dibatalkan',
      },
      'Penalized': {
        color: 'bg-red-500 text-white',
        icon: <AlertCircle className="h-3 w-3" />,
        label: 'Denda',
      },
      'Done': {
        color: 'bg-gray-100 text-gray-800',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Selesai (Done)',
      },
    }
    return config[status] || config.Pending
  }

  const filteredBookings = safeBookings.filter((booking) => {
    const matchesSearch =
      booking.fasilitas.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.fasilitas.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: safeBookings.length,
    confirmed: safeBookings.filter((b) => b.status === 'Confirmed').length,
    pending: safeBookings.filter((b) => b.status === 'Pending').length,
    returned: safeBookings.filter((b) => b.status === 'Returned').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Head title="Riwayat Booking" />

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.visit('/user/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Riwayat Booking</h1>
              <p className="text-gray-600">Kelola dan pantau semua booking Anda</p>
            </div>
            <div className="p-2 rounded-lg">
              <HistoryIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <button
            onClick={() => router.visit('/user/facilities')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Booking Baru
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Booking</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
            </div>
            <Calendar className="h-6 w-6 text-gray-600 bg-gray-100 p-1 rounded-lg" />
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Disetujui</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.confirmed}</h3>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600 bg-green-100 p-1 rounded-lg" />
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Menunggu</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
            </div>
            <Clock className="h-6 w-6 text-yellow-600 bg-yellow-100 p-1 rounded-lg" />
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Dikembalikan</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.returned}</h3>
            </div>
            <RefreshCw className="h-6 w-6 text-teal-600 bg-teal-100 p-1 rounded-lg" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau jenis fasilitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="Confirmed">Disetujui</option>
            <option value="Pending">Menunggu</option>
            <option value="Picked Up">Diambil</option>
            <option value="Returned">Dikembalikan</option>
            <option value="Cancelled">Dibatalkan</option>
            <option value="Penalized">Denda</option>
          </select>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" /> Filter
            </button>
          </div>
        </div>

        {selectedBookings.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  {selectedBookings.length} booking dipilih
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
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

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length > 0 && selectedBookings.length === safeBookings.length
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-red-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fasilitas & Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tgl Pinjam & Kembali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dibuat Pada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status)
                const isCancellable = booking.status === 'Pending' || booking.status === 'Confirmed'

                const isQrCodeAvailable =
                  booking.status === 'Confirmed' || booking.status === 'Picked Up'
                const isCompleted =
                  booking.status === 'Returned' ||
                  booking.status === 'Done' ||
                  booking.status === 'Penalized'

                const createdDate = booking.createdAt
                  ? new Date(booking.createdAt).toLocaleDateString('id-ID')
                  : '-'
                const createdTime = booking.createdAt
                  ? new Date(booking.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'

                const bookingDateFormatted = booking.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString('id-ID')
                  : '-'
                const returnDateFormatted = booking.returnDate
                  ? new Date(booking.returnDate).toLocaleDateString('id-ID')
                  : '-'

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
                        <div className="font-medium text-gray-900">{booking.fasilitas.name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Tag className="h-3 w-3 mr-1" />
                          {booking.fasilitas.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">Pinjam: {bookingDateFormatted}</div>
                      <div className="text-sm text-gray-500">Kembali: {returnDateFormatted}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{createdDate}</div>
                      <div className="text-sm text-gray-500">{createdTime}</div>
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

                        {isQrCodeAvailable && (
                          <button
                            onClick={() => handleShowQrCode(booking.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Tampilkan QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>
                        )}

                        {isCancellable && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            title="Batalkan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}

                        {isCompleted && <div className="text-gray-400 text-sm">Selesai</div>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada booking ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        )}

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
              <li>
                • <span className="font-medium">Pending:</span> Sedang diverifikasi admin
              </li>
              <li>
                • <span className="font-medium">Confirmed:</span> Booking sudah disetujui
              </li>
              <li>
                • <span className="font-medium">Returned:</span> Fasilitas telah dikembalikan
              </li>
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

      <BottomNav />
    </div>
  )
}

export default BookingHistory
