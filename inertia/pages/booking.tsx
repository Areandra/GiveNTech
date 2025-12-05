import { useState, useMemo } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Calendar,
  Search,
  CheckCircle,
  Mail,
  Eye,
  Edit,
  Package,
  AlertCircle,
  CheckSquare,
  XCircle,
  Ban,
  Loader2,
  Check,
  X as XIcon,
} from 'lucide-react'

import axios from 'axios'
import AdminLayout from '../layout/AuthenticatedLayout'
import { Booking, BookingStatus } from '~/types/index'

interface BookingManagementPageProps {
  bookingsData: Booking[]
  user: any
}

const BookingManagementPage = ({ user, bookingsData }: BookingManagementPageProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [processingAction, setProcessingAction] = useState<number | null>(null)

  const handleConfirm = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      await axios
        .put(
          '/api/v1/booking/' + bookingId,
          { status: 'Confirmed', idApprover: user.id },
          { withCredentials: true }
        )
        .then(() => router.reload())
    } catch (error) {
      console.error('Gagal mengkonfirmasi booking:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleCancel = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      await axios
        .put(
          '/api/v1/booking/' + bookingId,
          { status: 'Cancelled', idApprover: user.id },
          { withCredentials: true }
        )
        .then(() => router.reload())
    } catch (error) {
      console.error('Gagal membatalkan booking:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleMarkAsPickedUp = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      await axios
        .put(
          '/api/v1/booking/' + bookingId,
          { status: 'Picked Up', idApprover: user.id },
          { withCredentials: true }
        )
        .then(() => router.reload())
    } catch (error) {
      console.error('Gagal update status:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleMarkAsReturned = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      await axios
        .put(
          '/api/v1/booking/' + bookingId,
          { status: 'Returned', idApprover: user.id },
          { withCredentials: true }
        )
        .then(() => router.reload())
    } catch (error) {
      console.error('Gagal update status:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleMarkAsDone = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      await axios
        .put(
          '/api/v1/booking/' + bookingId,
          { status: 'Done', idApprover: user.id },
          { withCredentials: true }
        )
        .then(() => router.reload())
    } catch (error) {
      console.error('Gagal update status:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Dikonfirmasi',
        }
      case 'Pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          label: 'Menunggu',
        }
      case 'Picked Up':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <Package className="w-3 h-3 mr-1" />,
          label: 'Diambil',
        }
      case 'Returned':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: <CheckSquare className="w-3 h-3 mr-1" />,
          label: 'Dikembalikan',
        }
      case 'Cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <XCircle className="w-3 h-3 mr-1" />,
          label: 'Dibatalkan',
        }
      case 'Penalized':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: <Ban className="w-3 h-3 mr-1" />,
          label: 'Terkena Denda',
        }
      case 'Done':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Selesai',
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

  const getActionButtons = (booking: Booking) => {
    const isProcessing = processingAction === booking.id

    switch (booking.status) {
      case 'Pending':
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleConfirm(booking.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              {isProcessing ? 'Memproses...' : 'Konfirmasi'}
            </button>
            <button
              onClick={() => handleCancel(booking.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <XIcon className="w-3 h-3" />
              )}
              {isProcessing ? 'Memproses...' : 'Tolak'}
            </button>
          </div>
        )

      case 'Confirmed':
        return (
          <button
            onClick={() => handleMarkAsPickedUp(booking.id)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Package className="w-3 h-3" />
            )}
            {isProcessing ? 'Memproses...' : 'Telah Diambil'}
          </button>
        )

      case 'Picked Up':
        return (
          <button
            onClick={() => handleMarkAsReturned(booking.id)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CheckSquare className="w-3 h-3" />
            )}
            {isProcessing ? 'Memproses...' : 'Telah Dikembalikan'}
          </button>
        )

      case 'Returned':
        return (
          <button
            onClick={() => handleMarkAsDone(booking.id)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CheckCircle className="w-3 h-3" />
            )}
            {isProcessing ? 'Memproses...' : 'Tandai Selesai'}
          </button>
        )

      default:
        return null
    }
  }

  const filteredBookings = useMemo(() => {
    return bookingsData?.filter((booking) => {
      const matchesSearch =
        booking.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.fasilitas.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [bookingsData, searchQuery, statusFilter])

  const pendingCount = bookingsData?.filter((b) => b.status === 'Pending').length
  const confirmedCount = bookingsData?.filter((b) => b.status === 'Confirmed').length
  const pickedUpCount = bookingsData?.filter((b) => b.status === 'Picked Up').length

  const returnedCount = useMemo(
    () => bookingsData?.filter((b) => b.status === 'Returned').length,
    [bookingsData]
  )

  return (
    <AdminLayout user={user} activeMenu="/booking">
      <Head title="Booking Management Admin" />
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari peminjam atau fasilitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Konfirmasi ({pendingCount})</option>
            <option value="confirmed">Dikonfirmasi ({confirmedCount})</option>
            <option value="picked up">Sedang Dipinjam ({pickedUpCount})</option>
            <option value="returned">Dikembalikan ({returnedCount})</option>
            <option value="cancelled">Dibatalkan</option>
            <option value="done">Selesai</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Booking</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{bookingsData?.length || 0}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Menunggu Konfirmasi</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sedang Dipinjam</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{pickedUpCount}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Siap Diperiksa</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{returnedCount}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-purple-600" />
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
                  Peminjam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fasilitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Tidak ada data booking
                      </h3>
                      <p className="text-gray-500">Tidak ada booking yang ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status)

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.user.username}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {booking.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.fasilitas.name}</div>
                        {booking.rooms?.roomName && (
                          <div className="text-sm text-gray-500">
                            Ruang: {booking.rooms.roomName}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">ID: {booking.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {new Date(booking.bookingDate).toLocaleString('id-ID')}
                        </div>
                        {booking.returnDate && (
                          <div className="text-sm text-gray-500">
                            Kembali: {new Date(booking.returnDate).toLocaleString('id-ID')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                        {booking.approver?.username && (
                          <div className="text-xs text-gray-500 mt-1">
                            Disetujui: {booking.approver.username}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">{getActionButtons(booking)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => router.visit(`/booking/${booking.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.visit(`/booking/${booking.id}/edit`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default BookingManagementPage
