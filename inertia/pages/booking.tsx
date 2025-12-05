import React, { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import { 
  Calendar, Building, MapPin, QrCode, Home, Menu, X, User, ChevronRight,
  Search, Plus, Filter, CheckCircle, Clock, Phone, Mail, Eye, Edit,
  Trash2, Package, AlertCircle, CheckSquare, XCircle, Ban, ThumbsUp,
  RefreshCw, Loader2, Check, X as XIcon, ShieldCheck
} from 'lucide-react'

interface Booking {
  id: number
  id_user: number
  id_approver: number | null
  id_facility: number
  id_room: number | null
  booking_date: string
  return_date: string | null
  status: 'Pending' | 'Confirmed' | 'Picked Up' | 'Returned' | 'Cancelled' | 'Penalized' | 'Done'
  created_at: string
  updated_at: string | null
  user_name: string
  user_email: string
  user_phone: string
  facility_name: string
  room_name: string | null
  approver_name: string | null
}

const booking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bookingsData, setBookingsData] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [processingAction, setProcessingAction] = useState<number | null>(null)

  // Data dummy dengan status Pending untuk testing
  useEffect(() => {
    const dummyBookings: Booking[] = [
      {
        id: 1,
        id_user: 101,
        id_approver: null,
        id_facility: 5,
        id_room: 3,
        booking_date: '2024-01-20',
        return_date: '2024-01-20',
        status: 'Pending',
        created_at: '2024-01-18T10:30:00Z',
        updated_at: null,
        user_name: 'John Doe',
        user_email: 'john@example.com',
        user_phone: '081234567890',
        facility_name: 'Aula Konferensi Utama',
        room_name: 'Ruang A',
        approver_name: null
      },
      {
        id: 2,
        id_user: 102,
        id_approver: null,
        id_facility: 3,
        id_room: 2,
        booking_date: '2024-01-21',
        return_date: null,
        status: 'Pending',
        created_at: '2024-01-19T14:20:00Z',
        updated_at: null,
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        user_phone: '081298765432',
        facility_name: 'Ruang Pelatihan B',
        room_name: 'Lab Komputer',
        approver_name: null
      },
      {
        id: 3,
        id_user: 103,
        id_approver: 1,
        id_facility: 8,
        id_room: null,
        booking_date: '2024-01-19',
        return_date: '2024-01-19',
        status: 'Confirmed',
        created_at: '2024-01-17T09:15:00Z',
        updated_at: '2024-01-18T11:00:00Z',
        user_name: 'PT. Maju Jaya',
        user_email: 'info@majujaya.com',
        user_phone: '02112345678',
        facility_name: 'Lapangan Olahraga',
        room_name: null,
        approver_name: 'Admin'
      }
    ]
    
    setTimeout(() => {
      setBookingsData(dummyBookings)
      setLoading(false)
    }, 1000)
  }, [])

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Booking Management', active: true, href: '/booking' },
    { icon: Building, label: 'Facility Management', href: '/facilities' },
    { icon: MapPin, label: 'Map View', href: '/map' },
    { icon: QrCode, label: 'QR Scanner', href: '/qr-scanner' },
  ]

  const handleMenuClick = (href: string) => {
    router.visit(href)
    setSidebarOpen(false)
  }

  // ============ ADMIN ACTIONS ============
  
  const handleConfirm = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      // API call untuk konfirmasi
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setBookingsData(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Confirmed', approver_name: 'Admin', updated_at: new Date().toISOString() }
          : booking
      ))
      
      console.log(`Booking ${bookingId} confirmed`)
    } catch (error) {
      console.error('Gagal mengkonfirmasi booking:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleCancel = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      // API call untuk cancel
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setBookingsData(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Cancelled', updated_at: new Date().toISOString() }
          : booking
      ))
      
      console.log(`Booking ${bookingId} cancelled`)
    } catch (error) {
      console.error('Gagal membatalkan booking:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleMarkAsPickedUp = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setBookingsData(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Picked Up', updated_at: new Date().toISOString() }
          : booking
      ))
      
      console.log(`Booking ${bookingId} marked as picked up`)
    } catch (error) {
      console.error('Gagal update status:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleMarkAsReturned = async (bookingId: number) => {
    setProcessingAction(bookingId)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setBookingsData(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: 'Returned', 
              return_date: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString() 
            }
          : booking
      ))
      
      console.log(`Booking ${bookingId} marked as returned`)
    } catch (error) {
      console.error('Gagal update status:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusConfig = (status: Booking['status']) => {
    switch(status) {
      case 'Confirmed': return { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3 h-3 mr-1" />, label: 'Dikonfirmasi' }
      case 'Pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <AlertCircle className="w-3 h-3 mr-1" />, label: 'Menunggu' }
      case 'Picked Up': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Package className="w-3 h-3 mr-1" />, label: 'Diambil' }
      case 'Returned': return { bg: 'bg-purple-100', text: 'text-purple-800', icon: <CheckSquare className="w-3 h-3 mr-1" />, label: 'Dikembalikan' }
      case 'Cancelled': return { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-3 h-3 mr-1" />, label: 'Dibatalkan' }
      case 'Penalized': return { bg: 'bg-orange-100', text: 'text-orange-800', icon: <Ban className="w-3 h-3 mr-1" />, label: 'Terkena Denda' }
      case 'Done': return { bg: 'bg-gray-100', text: 'text-gray-800', icon: <CheckCircle className="w-3 h-3 mr-1" />, label: 'Selesai' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: <AlertCircle className="w-3 h-3 mr-1" />, label: status }
    }
  }

  const getActionButtons = (booking: Booking) => {
    const isProcessing = processingAction === booking.id
    
    switch(booking.status) {
      case 'Pending':
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleConfirm(booking.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              {isProcessing ? 'Memproses...' : 'Konfirmasi'}
            </button>
            <button
              onClick={() => handleCancel(booking.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <XIcon className="w-3 h-3" />}
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
            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Package className="w-3 h-3" />}
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
            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckSquare className="w-3 h-3" />}
            {isProcessing ? 'Memproses...' : 'Telah Dikembalikan'}
          </button>
        )
      
      case 'Returned':
        return (
          <button
            onClick={() => console.log('Mark as Done')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            {isProcessing ? 'Memproses...' : 'Tandai Selesai'}
          </button>
        )
      
      default:
        return null
    }
  }

  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = 
      booking.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.facility_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  const pendingCount = bookingsData.filter(b => b.status === 'Pending').length
  const confirmedCount = bookingsData.filter(b => b.status === 'Confirmed').length
  const pickedUpCount = bookingsData.filter(b => b.status === 'Picked Up').length
  const returnedCount = bookingsData.filter(b => b.status === 'Returned').length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-red-700 to-red-800 text-white transition-transform duration-300 transform`}>
        <div className="p-6 border-b border-red-600">
          <h1 className="text-2xl font-bold">GivenTech</h1>
          <p className="text-red-200 text-sm mt-1">Facility Management</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-red-600 shadow-lg text-white'
                  : 'text-red-100 hover:bg-red-600/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-left">{item.label}</span>
              {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-600">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Admin GivenTech</p>
              <p className="text-red-200 text-xs">Administrator</p>
            </div>
            <ShieldCheck className="w-4 h-4 ml-auto text-green-300" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Booking Management</h1>
                <p className="text-gray-600 text-sm">Admin Panel - Kelola peminjaman fasilitas</p>
              </div>
            </div>

            <button 
              onClick={() => router.visit('/booking/create')}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Booking Baru
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <Head title="Booking Management - Admin" />

          {/* FILTER & SEARCH */}
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
                <option value="pending">Menunggu Konfirmasi</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="picked up">Sedang Dipinjam</option>
                <option value="returned">Dikembalikan</option>
                <option value="cancelled">Dibatalkan</option>
                <option value="done">Selesai</option>
              </select>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Booking</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{bookingsData.length}</h3>
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
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* BOOKINGS TABLE */}
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="flex justify-center">
                          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                        </div>
                        <p className="mt-2 text-gray-500">Memuat data booking...</p>
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data booking</h3>
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
                            <div className="font-medium text-gray-900">{booking.user_name}</div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {booking.user_email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {booking.user_phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{booking.facility_name}</div>
                            {booking.room_name && (
                              <div className="text-sm text-gray-500">Ruang: {booking.room_name}</div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">ID: {booking.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {formatDate(booking.booking_date)}
                            </div>
                            {booking.return_date && (
                              <div className="text-sm text-gray-500">
                                Kembali: {formatDate(booking.return_date)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                            {booking.approver_name && (
                              <div className="text-xs text-gray-500 mt-1">
                                Disetujui: {booking.approver_name}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {getActionButtons(booking)}
                          </td>
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
        </main>
      </div>
    </div>
  )
}

export default booking