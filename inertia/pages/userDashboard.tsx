import BottomNav from '#components/BottomNav'
import { Head, router } from '@inertiajs/react'
import {
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  History,
  User,
  LogOut,
  Projector,
  Camera,
  Speaker,
  Bell,
  Package,
  Tag,
} from 'lucide-react'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

import { Facility, Booking, BookingStatus, User as UserType } from '~/types'

interface UserDashboardProps {
  bookings: Booking[]
  user: UserType
  facilities: Facility[]
}

const UserDashboard = ({ bookings = [], user, facilities = [] }: UserDashboardProps) => {
  const userName = user.username

  useEffect(() => {
    io().on('bookingReload', () => router.reload())
    io().on('facilityReload', () => router.reload())

    io().off('bookingReload', () => router.reload())
    io().off('facilityReload', () => router.reload())
  }, [])
  const handleNewBooking = () => {
    router.visit('/user/facilities')
  }

  const handleViewBooking = (id: number) => {
    router.visit(`/booking/${id}`)
  }

  const getStatusBadge = (status: BookingStatus) => {
    const config = {
      'Pending': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-3 h-3" />,
        label: 'Menunggu',
      },
      'Confirmed': {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Disetujui',
      },
      'Picked Up': {
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="w-3 h-3" />,
        label: 'Diambil',
      },
      'Returned': {
        color: 'bg-gray-100 text-gray-800',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Dikembalikan',
      },
      'Cancelled': {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-3 h-3" />,
        label: 'Dibatalkan',
      },
      'Penalized': {
        color: 'bg-red-500 text-white',
        icon: <XCircle className="w-3 h-3" />,
        label: 'Denda',
      },
      'Done': {
        color: 'bg-teal-100 text-teal-800',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Selesai',
      },
    }

    return config[status as keyof typeof config] || config.Pending
  }

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'Ruang Pertemuan':
      case 'Laboratorium':
        return <Building className="h-5 w-5 text-red-600" />
      case 'Alat Elektronik':
        return <Projector className="h-5 w-5 text-orange-600" />
      case 'Alat Fotografi':
        return <Camera className="h-5 w-5 text-indigo-600" />
      case 'Alat Audio':
        return <Speaker className="h-5 w-5 text-teal-600" />
      default:
        return <Building className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Head title="Dashboard Pengguna" />

      {/* DESKTOP NAVBAR */}
      <nav className="bg-white shadow-sm border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <h1 className="text-xl font-bold">GivenTech</h1>
                <p className="text-sm text-gray-600">Facility Booking</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
              </div>

              <button onClick={() => router.post('/logout')} className="p-2 text-gray-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER CARD */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 md:p-8 text-white mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Selamat datang, {userName}!</h1>
          <p className="text-red-100">Booking fasilitas dengan mudah dan cepat</p>

          <button
            onClick={handleNewBooking}
            className="mt-4 bg-white text-red-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Booking Baru
          </button>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <p className="text-gray-600 text-sm">Total Booking</p>
            <h3 className="text-2xl font-bold">{bookings.length}</h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <p className="text-gray-600 text-sm">Disetujui</p>
            <h3 className="text-2xl font-bold">
              {bookings.filter((b) => b.status === 'Confirmed').length}
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <p className="text-gray-600 text-sm">Menunggu</p>
            <h3 className="text-2xl font-bold">
              {bookings.filter((b) => b.status === 'Pending').length}
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <p className="text-gray-600 text-sm">Fasilitas Tersedia</p>
            <h3 className="text-2xl font-bold">
              {facilities.filter((f) => f.status === 'Available').length}
            </h3>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* BOOKING TERBARU */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between">
                <h2 className="text-lg md:text-xl font-bold">Booking Terbaru</h2>
                <button
                  onClick={() => router.visit('/user/booking/history')}
                  className="text-red-600 font-medium"
                >
                  Lihat Semua →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] md:min-w-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fasilitas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => {
                      const statusConfig = getStatusBadge(booking.status)
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{booking.fasilitas.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {booking.fasilitas.type}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm">
                            <p>Pinjam: {booking.bookingDate.toString()}</p>
                            <p>Kembali: {booking.returnDate || '-'}</p>
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
                            <button
                              onClick={() => handleViewBooking(booking.id)}
                              className="text-red-600 font-medium text-sm"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FASILITAS TERSEDIA */}
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Fasilitas Tersedia</h2>
                <button
                  onClick={() => router.visit('/user/facilities')}
                  className="text-red-600 font-medium"
                >
                  Lihat Semua →
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities
                    .filter((f) => f.status === 'Available')
                    .slice(0, 6)
                    .map((facility) => (
                      <div
                        key={facility.id}
                        className="border rounded-xl p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getFacilityIcon(facility.type)}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold">{facility.name}</h3>
                            <p className="text-sm text-gray-600">{facility.type}</p>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {facility.status}
                              </span>

                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Update: {new Date(facility.updatedAt).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => router.visit(`/booking/create/${facility.id}`)}
                            className="text-red-600 font-medium text-sm"
                          >
                            Booking →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6 lg:pb-0 pb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4">Aksi Cepat</h3>

              <div className="space-y-3">
                <button
                  onClick={handleNewBooking}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Booking Fasilitas
                </button>

                <button
                  onClick={() => router.visit('/user/facilities')}
                  className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Building className="h-5 w-5" />
                  Lihat Fasilitas
                </button>

                <button
                  onClick={() => router.visit('/user/booking/history')}
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <History className="h-5 w-5" />
                  Riwayat Booking
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4">Booking Mendatang</h3>

              {bookings
                .filter((b) => b.status === 'Confirmed' || b.status === 'Pending')
                .slice(0, 3)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className={`border-l-4 pl-4 mb-4 ${
                      booking.status === 'Confirmed' ? 'border-red-500' : 'border-yellow-500'
                    }`}
                  >
                    <h4 className="font-medium">{booking.fasilitas.name}</h4>
                    <p className="text-sm">Pinjam: {booking.bookingDate.toString()}</p>
                    <p className="text-sm text-gray-500">
                      Kembali: {booking.returnDate?.toString() || '-'}
                    </p>

                    <div className="mt-2">
                      {booking.status === 'Confirmed' ? (
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Disetujui
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Menunggu
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-900 mb-3">Tips Cepat</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">Booking minimal 1 hari sebelumnya</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">Bawa KTM saat mengambil fasilitas</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">
                    Kembalikan tepat waktu untuk menghindari denda
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">Laporkan kerusakan segera ke admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <BottomNav />
    </div>
  )
}

export default UserDashboard
