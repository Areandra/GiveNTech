import React, { useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Calendar,
  Clock,
  Building,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MapPin,
  Package,
  User,
  XCircle,
  RefreshCw,
  QrCode,
} from 'lucide-react'
import { io } from 'socket.io-client'

interface Approver {
  username: string
}

interface Room {
  id: number
  roomName: string
  longitude: string
  latitude: string
}

interface Facility {
  id: number
  name: string
  type: string
  status: string
}

interface Booking {
  id: number
  idUser: number
  idFacility: number
  idRoom: number
  bookingDate: string
  purpose: string
  notes: string | null
  status: 'Pending' | 'Confirmed' | 'Picked Up' | 'Returned' | 'Cancelled' | 'Penalized'
  createdAt: string
  updatedAt: string
  approver?: Approver
  fasilitas: Facility
  rooms: Room
}

interface BookingDetailProps {
  booking: Booking
  user: any
}

const getStatusConfig = (status: Booking['status']) => {
  const config = {
    'Pending': {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="h-4 w-4" />,
      label: 'Menunggu Verifikasi',
    },
    'Confirmed': {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-4 w-4" />,
      label: 'Disetujui',
    },
    'Picked Up': {
      color: 'bg-blue-100 text-blue-800',
      icon: <Package className="h-4 w-4" />,
      label: 'Telah Diambil',
    },
    'Returned': {
      color: 'bg-teal-100 text-teal-800',
      icon: <RefreshCw className="h-4 w-4" />,
      label: 'Selesai (Dikembalikan)',
    },
    'Cancelled': {
      color: 'bg-red-100 text-red-800',
      icon: <XCircle className="h-4 w-4" />,
      label: 'Dibatalkan',
    },
    'Penalized': {
      color: 'bg-red-500 text-white',
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Denda (Penalti)',
    },
  }
  return config[status] || config.Pending
}

const BookingDetail = ({ booking, user }: BookingDetailProps) => {
  useEffect(() => {
    io().on('bookingReload', () => router.reload())
    io().on('facilityReload', () => router.reload())

    io().off('bookingReload', () => router.reload())
    io().off('facilityReload', () => router.reload())
  }, [])

  const statusConfig = getStatusConfig(booking.status)

  const datePart = booking.bookingDate.toString().split('T')[0]
  const timePart = booking.bookingDate.toString().split('T')[1]?.substring(0, 5) || '00:00'

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan peminjaman ini?')) {
      console.log('Membatalkan booking:', booking.id)
    }
  }

  const isCancellable = booking.status === 'Pending' || booking.status === 'Confirmed'

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Detail Booking #${booking.id}`} />

      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  router.visit(user.role === 'user' ? `/user/dashboard` : `/dashboard`)
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Peminjaman</h1>
                <p className="text-gray-600">ID: #{booking.id}</p>
              </div>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
            >
              {statusConfig.icon}
              <span className="ml-2">{statusConfig.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              Status & Tindakan
            </h2>
            <div
              className={`p-4 rounded-lg flex justify-between items-center ${statusConfig.color.replace(
                '100',
                '50'
              )} border border-current`}
            >
              <div>
                <p className="font-medium text-lg">Status Saat Ini: {statusConfig.label}</p>
                <p className="text-sm">
                  {booking.status === 'Pending' &&
                    'Permintaan Anda sedang menunggu verifikasi oleh Admin.'}
                  {booking.status === 'Confirmed' &&
                    `Booking disetujui. Silakan ambil barang pada ${datePart} pukul ${timePart}.`}
                  {booking.status === 'Cancelled' && 'Peminjaman ini telah dibatalkan.'}
                  {booking.status === 'Penalized' &&
                    'Terdapat denda terkait peminjaman ini. Hubungi Admin.'}
                </p>
              </div>
              {isCancellable && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors ml-4"
                >
                  Batalkan
                </button>
              )}
            </div>
            {booking.status === 'Confirmed' ||
              (booking.status === 'Picked Up' && (
                <button
                  onClick={() => router.visit(`/booking/${booking.id}/qr`)}
                  className="flex mt-4 justify-center w-full items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Tampilkan QR Code"
                >
                  <QrCode className="h-8 w-4" />
                  Tampilkan QR Code
                </button>
              ))}
          </div>

          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="h-5 w-5 text-red-600 mr-2" />
              Detail Barang & Lokasi
            </h2>

            <div className="space-y-4">
              <DetailRow label="Nama Fasilitas" value={booking.fasilitas.name} icon={Package} />
              <DetailRow label="Tipe" value={booking.fasilitas.type} icon={FileText} />
              <DetailRow label="Lokasi Penggunaan" value={booking.rooms.roomName} icon={Building} />
              <DetailRow
                label="Status Fasilitas"
                value={booking.fasilitas.status}
                icon={AlertCircle}
                className="text-yellow-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 text-red-600 mr-2" />
              Waktu & Tujuan
            </h2>

            <div className="space-y-4">
              <DetailRow label="Tanggal Peminjaman" value={datePart} icon={Calendar} />
              <DetailRow label="Waktu Peminjaman" value={timePart} icon={Clock} />
              <DetailRow label="Tujuan Penggunaan" value={booking.purpose} icon={FileText} />

              {booking.notes && (
                <div className="pt-4 border-t">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    Catatan Tambahan
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-wrap">
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 text-red-600 mr-2" />
              Informasi Tambahan
            </h2>

            <div className="space-y-4">
              <DetailRow
                label="Dibooking Pada"
                value={new Date(booking.createdAt).toLocaleString('id-ID')}
                icon={Calendar}
              />
              {booking.approver && (
                <DetailRow
                  label="Diverifikasi Oleh"
                  value={booking.approver.username}
                  icon={CheckCircle}
                  className="text-green-600"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string | number
  icon: React.ElementType
  className?: string
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon: Icon, className = '' }) => (
  <div className="flex justify-between items-start border-b pb-3">
    <div className="flex items-center text-gray-600">
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
    <div className={`font-medium text-right text-gray-900 ${className}`}>{value}</div>
  </div>
)

export default BookingDetail
