import React, { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import { 
  Building, 
  MapPin, 
  QrCode,
  Search,
  Plus,
  Menu,
  X,
  User,
  ChevronRight,
  Home,
  Calendar,
  Bell,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Wrench,
  Clock
} from 'lucide-react'

interface Facility {
  id: number
  name: string
  location: string
  status: 'Available' | 'Booked' | 'Maintenance' | 'Damaged'
  lastUpdated: string
  bookedBy?: string
  bookedTime?: string
}

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    totalFacilities: 0,
    availableFacilities: 0,
    bookedFacilities: 0,
    maintenanceFacilities: 0
  })
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)

  // Data dummy untuk development
  useEffect(() => {
    // Simulasi fetch data
    setTimeout(() => {
      const dummyFacilities: Facility[] = [
        {
          id: 1,
          name: 'Aula Konferensi Utama',
          location: 'Gedung A, Lantai 3',
          status: 'Booked',
          lastUpdated: '2024-01-20T10:30:00Z',
          bookedBy: 'John Doe',
          bookedTime: 'Hari ini, 14:00-16:00'
        },
        {
          id: 2,
          name: 'Ruang Pelatihan B',
          location: 'Gedung B, Lantai 1',
          status: 'Maintenance',
          lastUpdated: '2024-01-19T15:45:00Z',
          bookedBy: undefined,
          bookedTime: undefined
        },
        {
          id: 3,
          name: 'Lapangan Olahraga',
          location: 'Area Outdoor, Sayap Utara',
          status: 'Damaged',
          lastUpdated: '2024-01-18T09:20:00Z',
          bookedBy: undefined,
          bookedTime: undefined
        },
        {
          id: 4,
          name: 'Ruang Rapat C',
          location: 'Gedung C, Lantai 2',
          status: 'Available',
          lastUpdated: '2024-01-20T08:15:00Z',
          bookedBy: 'Tim Marketing',
          bookedTime: 'Besok'
        },
        {
          id: 5,
          name: 'Laboratorium Komputer',
          location: 'Gedung D, Lantai 2',
          status: 'Available',
          lastUpdated: '2024-01-19T14:30:00Z',
          bookedBy: undefined,
          bookedTime: undefined
        },
        {
          id: 6,
          name: 'Studio Musik',
          location: 'Gedung E, Lantai 1',
          status: 'Booked',
          lastUpdated: '2024-01-20T16:20:00Z',
          bookedBy: 'Klub Musik',
          bookedTime: 'Hari ini, 18:00-20:00'
        },
        {
          id: 7,
          name: 'Perpustakaan',
          location: 'Gedung Utama, Lantai 1',
          status: 'Available',
          lastUpdated: '2024-01-19T11:10:00Z',
          bookedBy: undefined,
          bookedTime: undefined
        },
        {
          id: 8,
          name: 'Kantin Utama',
          location: 'Gedung Utama, Lantai 1',
          status: 'Maintenance',
          lastUpdated: '2024-01-20T13:25:00Z',
          bookedBy: undefined,
          bookedTime: undefined
        }
      ]

      setFacilities(dummyFacilities)
      
      // Hitung statistik
      const total = dummyFacilities.length
      const available = dummyFacilities.filter(f => f.status === 'Available').length
      const booked = dummyFacilities.filter(f => f.status === 'Booked').length
      const maintenance = dummyFacilities.filter(f => f.status === 'Maintenance' || f.status === 'Damaged').length
      
      setStats({
        totalFacilities: total,
        availableFacilities: available,
        bookedFacilities: booked,
        maintenanceFacilities: maintenance
      })
      
      setLoading(false)
    }, 1000)
  }, [])

  // Menu sidebar (sama seperti facility)
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true, href: '/dashboard' },
    { icon: Calendar, label: 'Booking Management', href: '/booking' },
    { icon: Building, label: 'Facility Management', href: '/facilities' },
    { icon: MapPin, label: 'Map View', href: '/map' },
    { icon: QrCode, label: 'QR Scanner', href: '/qr-scanner' },
  ]

  const handleMenuClick = (href: string) => {
    router.visit(href)
    setSidebarOpen(false)
  }

  const handleAddFacility = () => {
    router.visit('/facilities/create')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Status badge
  const getStatusConfig = (status: Facility['status']) => {
    switch(status) {
      case 'Available':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Tersedia'
        }
      case 'Booked':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <Calendar className="w-3 h-3 mr-1" />,
          label: 'Dipesan'
        }
      case 'Maintenance':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Wrench className="w-3 h-3 mr-1" />,
          label: 'Perbaikan'
        }
      case 'Damaged':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <XCircle className="w-3 h-3 mr-1" />,
          label: 'Rusak'
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: status
        }
    }
  }

  // Filter facilities
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = 
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      facility.status.toLowerCase() === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR - KIRI (FIXED, SAMA SEPERTI FACILITY) */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-red-700 to-red-800 text-white transition-transform duration-300 transform`}>
        {/* Logo Header */}
        <div className="p-6 border-b border-red-600">
          <h1 className="text-2xl font-bold">GivenTech</h1>
          <p className="text-red-200 text-sm mt-1">Facility Management</p>
        </div>

        {/* Navigation Menu */}
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
              {item.active && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-600">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Admin GivenTech</p>
              <p className="text-red-200 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* TOP HEADER */}
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
                <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 text-sm">Ringkasan dan monitoring fasilitas</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 bg-gray-50">
          <Head title="Dashboard" />

          {/* FILTER & SEARCH (SAMA SEPERTI FACILITY) */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
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

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="available">Tersedia</option>
                  <option value="booked">Dipesan</option>
                  <option value="maintenance">Perbaikan</option>
                  <option value="damaged">Rusak</option>
                </select>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Fasilitas</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalFacilities}</h3>
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
                    {stats.availableFacilities}
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
                  <p className="text-gray-600 text-sm">Dipesan</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.bookedFacilities}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Perawatan</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.maintenanceFacilities}
                  </h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* FACILITIES TABLE - TANPA TIPE DAN KAPASITAS */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Fasilitas Terbaru</h2>
                  <p className="text-gray-600 text-sm">Kelola dan pantau semua fasilitas</p>
                </div>
                <button 
                  onClick={handleAddFacility}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Fasilitas
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fasilitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terakhir Diupdate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        </div>
                        <p className="mt-2 text-gray-500">Memuat data fasilitas...</p>
                      </td>
                    </tr>
                  ) : filteredFacilities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Tidak ada fasilitas yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredFacilities.map((facility) => {
                      const statusConfig = getStatusConfig(facility.status)
                      
                      return (
                        <tr key={facility.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <Building className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{facility.name}</div>
                                <div className="text-xs text-gray-500">ID: FAC-{facility.id.toString().padStart(3, '0')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-gray-700">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              {facility.location}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                              {facility.bookedBy && facility.status === 'Booked' && (
                                <div className="text-xs text-gray-500 mt-1">
                                  <div className="font-medium">Oleh: {facility.bookedBy}</div>
                                  {facility.bookedTime && (
                                    <div className="flex items-center mt-1">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {facility.bookedTime}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">{formatDate(facility.lastUpdated)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <button 
                                onClick={() => router.visit(`/facilities/${facility.id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
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
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                  Menampilkan <span className="font-medium">{filteredFacilities.length}</span> dari <span className="font-medium">{facilities.length}</span> fasilitas
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Sebelumnya
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100 font-medium">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard