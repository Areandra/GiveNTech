import { Head, router } from '@inertiajs/react'
import {
  Calendar,
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
  Home,
  Bell,
  Package,
  Tag,
} from 'lucide-react'

import { Facility, Booking, BookingStatus, User as UserType } from '~/types'

interface UserDashboardProps {
  bookings: Booking[]
  user: UserType
  facilities: Facility[]
}

const UserDashboard = ({ bookings = [], user, facilities = [] }: UserDashboardProps) => {
  const userName = user.username

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
    <div className="min-h-screen bg-gray-50">
      <Head title="Dashboard Pengguna" />

      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900">GivenTech</h1>
                <p className="text-sm text-gray-600">Facility Booking</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  router.post('/logout')
                }}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Selamat datang, {userName}!</h1>
              <p className="text-red-100">Booking fasilitas dengan mudah dan cepat</p>
            </div>
            <button
              onClick={handleNewBooking}
              className="mt-4 md:mt-0 bg-white text-red-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl flex items-center space-x-2 transition duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Booking Baru</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Booking</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{bookings.length}</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Disetujui</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {bookings.filter((b) => b.status === 'Confirmed').length}
                </h3>
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
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {bookings.filter((b) => b.status === 'Pending').length}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Fasilitas Tersedia</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {facilities.filter((f) => f.status === 'Available').length}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Booking Terbaru</h2>
                  <button
                    onClick={() => router.visit('/user/booking/history')}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Lihat Semua →
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fasilitas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tgl Pinjam & Kembali
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
                            <div className="font-medium text-gray-900">
                              {booking.fasilitas.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {booking.fasilitas.type}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-900">
                              Pinjam: {booking.bookingDate.toString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              Kembali: {booking.returnDate || '-'}
                            </div>
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
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
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

            <div className="bg-white rounded-xl shadow mt-8">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Fasilitas Tersedia</h2>
                  <button
                    onClick={() => router.visit('/user/facilities')}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Lihat Semua →
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities
                    .filter((f) => f.status === 'Available')
                    .slice(0, 6)
                    .map((facility) => (
                      <div
                        key={facility.id}
                        className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getFacilityIcon(facility.type)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{facility.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{facility.type}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {facility.status}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Update: {new Date(facility.updatedAt).toLocaleDateString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => router.visit(`/booking/create/${facility.id}`)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap"
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

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button
                  onClick={handleNewBooking}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Booking Fasilitas
                </button>
                <button
                  onClick={() => router.visit('/user/facilities')}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-lg transition-colors"
                >
                  <Building className="h-5 w-5" />
                  Lihat Fasilitas
                </button>
                <button
                  onClick={() => router.visit('/user/booking/history')}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg transition-colors"
                >
                  <History className="h-5 w-5" />
                  Riwayat Booking
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Booking Mendatang</h3>
              <div className="space-y-4">
                {bookings
                  .filter((b) => b.status === 'Confirmed' || b.status === 'Pending')
                  .slice(0, 3)
                  .map((booking) => {
                    const isConfirmed = booking.status === 'Confirmed'
                    return (
                      <div
                        key={booking.id}
                        className={`border-l-4 ${isConfirmed ? 'border-red-500' : 'border-yellow-500'} pl-4`}
                      >
                        <h4 className="font-medium text-gray-900">{booking.fasilitas.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Pinjam: {booking.bookingDate.toString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Kembali: {booking.returnDate?.toString() || '-'}
                        </p>
                        <div className="mt-2">
                          {isConfirmed ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Disetujui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Menunggu
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
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

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around py-3">
          <button className={`flex flex-col items-center text-gray-600`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => router.visit('/facilities')}
            className="flex flex-col items-center text-gray-600"
          >
            <Building className="h-6 w-6" />
            <span className="text-xs mt-1">Fasilitas</span>
          </button>
          <button onClick={handleNewBooking} className="flex flex-col items-center text-gray-600">
            <Plus className="h-6 w-6" />
            <span className="text-xs mt-1">Booking</span>
          </button>
          <button
            onClick={() => router.visit('/history')}
            className="flex flex-col items-center text-gray-600"
          >
            <History className="h-6 w-6" />
            <span className="text-xs mt-1">Riwayat</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
