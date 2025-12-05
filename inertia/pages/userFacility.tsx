import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { 
  Building, 
  Search, 
  Filter, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Calendar,
  ArrowLeft,
  Projector,
  Camera,
  Music,
  Wifi,
  Monitor,
  Printer,
  Microscope,
  Speaker
} from 'lucide-react'

const UserFacilityList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const facilities = [
    {
      id: 1,
      name: 'Proyektor HD',
      type: 'Alat Elektronik',
      location: 'Gudang Peralatan Lt. 1',
      status: 'available',
      description: 'Proyektor resolusi tinggi dengan koneksi HDMI dan VGA',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Kamera DSLR',
      type: 'Alat Fotografi',
      location: 'Studio Multimedia',
      status: 'available',
      description: 'Kamera profesional dengan lensa kit 18-55mm',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Sound System Portable',
      type: 'Alat Audio',
      location: 'Ruang Audio',
      status: 'unavailable',
      description: 'Speaker Bluetooth dengan mic wireless',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Ruang Meeting A',
      type: 'Ruang Pertemuan',
      location: 'Gedung Utama Lt. 3',
      status: 'available',
      description: 'Ruang meeting dengan AC, whiteboard, dan meja rapat',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Laboratorium Komputer',
      type: 'Laboratorium',
      location: 'Gedung Teknik Lt. 2',
      status: 'available',
      description: 'Lab dengan 20 PC dan internet cepat',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Printer Laser',
      type: 'Alat Kantor',
      location: 'Ruang Administrasi',
      status: 'available',
      description: 'Printer warna dengan scanner dan copier',
      image: 'https://images.unsplash.com/photo-1499951850378-5fcf521d7145?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Monitor 27"',
      type: 'Alat Elektronik',
      location: 'Gudang IT',
      status: 'available',
      description: 'Monitor LED full HD untuk presentasi',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Microphone Wireless',
      type: 'Alat Audio',
      location: 'Ruang Audio',
      status: 'available',
      description: 'Mic handheld dengan receiver',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
    },
    {
      id: 9,
      name: 'Studio Musik',
      type: 'Studio',
      location: 'Gedung Seni Lt. 1',
      status: 'available',
      description: 'Studio dengan alat musik dan recording',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop'
    },
    {
      id: 10,
      name: 'Mikroskop Digital',
      type: 'Alat Laboratorium',
      location: 'Lab Biologi',
      status: 'available',
      description: 'Mikroskop dengan kamera digital',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop'
    },
    {
      id: 11,
      name: 'WiFi Hotspot',
      type: 'Fasilitas Digital',
      location: 'Area Umum',
      status: 'available',
      description: 'Akses internet nirkabel kecepatan tinggi',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
    },
    {
      id: 12,
      name: 'Lapangan Olahraga',
      type: 'Fasilitas Outdoor',
      location: 'Area Outdoor',
      status: 'available',
      description: 'Lapangan serbaguna untuk berbagai olahraga',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop'
    }
  ]

  const handleBookFacility = (facilityId: number) => {
    router.visit(`/facilities/${facilityId}/book`)
  }

  const handleViewDetail = (facilityId: number) => {
    router.visit(`/facilities/${facilityId}`)
  }

  const getFacilityIcon = (type: string) => {
    switch(type) {
      case 'Alat Elektronik':
        return <Projector className="h-5 w-5 text-blue-600" />
      case 'Alat Fotografi':
        return <Camera className="h-5 w-5 text-purple-600" />
      case 'Alat Audio':
        return <Speaker className="h-5 w-5 text-green-600" />
      case 'Ruang Pertemuan':
        return <Building className="h-5 w-5 text-red-600" />
      case 'Laboratorium':
        return <Microscope className="h-5 w-5 text-indigo-600" />
      case 'Alat Kantor':
        return <Printer className="h-5 w-5 text-orange-600" />
      case 'Studio':
        return <Music className="h-5 w-5 text-pink-600" />
      case 'Fasilitas Digital':
        return <Wifi className="h-5 w-5 text-teal-600" />
      case 'Fasilitas Outdoor':
        return <Building className="h-5 w-5 text-emerald-600" />
      default:
        return <Building className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || facility.type === selectedType
    return matchesSearch && matchesType
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'type') return a.type.localeCompare(b.type)
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Daftar Fasilitas" />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.visit('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Daftar Fasilitas</h1>
                <p className="text-gray-600">Pilih dan pinjam fasilitas yang tersedia</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari fasilitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Jenis</option>
              <option value="Alat Elektronik">Alat Elektronik</option>
              <option value="Alat Fotografi">Alat Fotografi</option>
              <option value="Alat Audio">Alat Audio</option>
              <option value="Ruang Pertemuan">Ruang Pertemuan</option>
              <option value="Laboratorium">Laboratorium</option>
              <option value="Alat Kantor">Alat Kantor</option>
              <option value="Studio">Studio</option>
              <option value="Fasilitas Digital">Fasilitas Digital</option>
              <option value="Fasilitas Outdoor">Fasilitas Outdoor</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="name">Sortir: Nama</option>
              <option value="type">Sortir: Jenis</option>
            </select>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
              {/* Facility Image */}
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={facility.image} 
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    facility.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {facility.status === 'available' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {facility.status === 'available' ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                </div>
              </div>

              {/* Facility Info */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getFacilityIcon(facility.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-gray-600">{facility.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{facility.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{facility.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleViewDetail(facility.id)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Lihat Detail
                  </button>
                  <button 
                    onClick={() => handleBookFacility(facility.id)}
                    disabled={facility.status !== 'available'}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      facility.status === 'available'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
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
          ))}
        </div>

        {/* No Results */}
        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada fasilitas ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        )}

        {/* Stats Info */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">
                {facilities.filter(f => f.status === 'available').length}
              </div>
              <p className="text-red-800 font-medium">Fasilitas Tersedia</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">
                {facilities.length}
              </div>
              <p className="text-red-800 font-medium">Total Fasilitas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">
                {Array.from(new Set(facilities.map(f => f.type))).length}
              </div>
              <p className="text-red-800 font-medium">Jenis Fasilitas</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-blue-900">Cara Meminjam</h4>
            </div>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>1. Pilih fasilitas yang tersedia</li>
              <li>2. Isi formulir peminjaman</li>
              <li>3. Tunggu verifikasi admin</li>
              <li>4. Ambil fasilitas di lokasi</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-bold text-green-900">Durasi Peminjaman</h4>
            </div>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• Maksimal 7 hari untuk alat</li>
              <li>• Maksimal 1 hari untuk ruangan</li>
              <li>• Dapat diperpanjang jika tersedia</li>
              <li>• Kembalikan tepat waktu</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
              </div>
              <h4 className="font-bold text-yellow-900">Perhatian</h4>
            </div>
            <ul className="text-yellow-800 text-sm space-y-2">
              <li>• Jaga kebersihan fasilitas</li>
              <li>• Laporkan kerusakan segera</li>
              <li>• Denda keterlambatan berlaku</li>
              <li>• Bawa KTM saat mengambil</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserFacilityList