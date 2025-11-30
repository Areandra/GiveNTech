import React, { useEffect, useState, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '#layout/AuthenticatedLayout'
import axios from 'axios'
import { Loader2, AlertTriangle, MapPin, Package } from 'lucide-react'

// ======================================
// 1. Tipe Data
// ======================================
interface ActiveBooking {
    id: number
    status: string
    fasilitas: {
        name: string
        type: string
    }
    user: {
        username: string
    }
}

interface RoomMapData {
    id: number
    room_name: string
    longitude: number
    latitude: number
    borrowed_facilities_count: number
    active_bookings: ActiveBooking[]
}

// Koordinat default (diletakkan di luar komponen agar tidak perlu dihitung ulang)
const defaultCenter: [number, number] = [-0.8416396128141402, 119.89278946944664]

// ======================================
// 2. Komponen Peta Dinamis (SSR Safe)
// ======================================
// Komponen ini harus diimpor secara dinamis karena mengandung Leaflet/DOM logic
const DynamicMap: React.FC<{ validMarkers: RoomMapData[]; mapCenter: [number, number] }> = ({
  validMarkers,
  mapCenter,
}) => {
  // PENTING: Import komponen Leaflet di sini agar kode ini hanya dijalankan di sisi klien
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet')
  const L = require('leaflet')
  require('leaflet/dist/leaflet.css')
  
  // Custom Marker Icon: Didefinisikan di dalam komponen klien
  const customIcon = (count: number) => {
    return L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="bg-indigo-600 text-white rounded-full p-2 shadow-lg flex flex-col items-center justify-center font-bold text-xs ring-4 ring-indigo-300 w-10 h-10">
              <span class="text-xs">${count}</span>
              <span class="text-[8px] leading-none">items</span>
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -30],
    })
  }
  
  return (
    <MapContainer
      center={mapCenter}
      zoom={15}
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl"
      // Key memastikan MapContainer di-render ulang jika center berubah
      key={mapCenter.toString()}
    >
      {/* Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers for Active Rooms */}
      {validMarkers.map((room) => (
        <Marker
          key={room.id}
          position={[room.latitude, room.longitude]}
          icon={customIcon(room.borrowed_facilities_count)}
        >
          <Popup className="max-w-xs">
            <div className="font-semibold text-lg text-indigo-700 mb-2">{room.room_name}</div>
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <MapPin className="inline w-4 h-4 mr-1 text-red-500" />
              Koordinat: ({room.latitude.toFixed(6)}, {room.longitude.toFixed(6)})
            </p>
            <p className="text-sm font-medium text-gray-800 flex items-center">
              <Package className="inline w-4 h-4 mr-1 text-green-600" />
              Total Item Dipinjam: <span className="ml-1 font-bold">{room.borrowed_facilities_count}</span>
            </p>

            {room.active_bookings.length > 0 && (
              <div className="mt-3 border-t pt-2 max-h-32 overflow-y-auto">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Detail Peminjaman Aktif:</h4>
                <ul className="space-y-1">
                  {room.active_bookings.map((booking, index) => (
                    <li key={index} className="text-xs p-1 bg-gray-50 rounded">
                      <span className="font-semibold">{booking.fasilitas.name}</span>
                      <span className="text-gray-500"> ({booking.fasilitas.type})</span>
                      <br />
                      <span className="italic text-indigo-500">by {booking.user.username}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

// ======================================
// 3. Komponen Peta Utama (Wrapper)
// ======================================
export default function MapPage() {
    const [mapData, setMapData] = useState<RoomMapData[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isClient, setIsClient] = useState(false); // State untuk menandai sisi klien
    
    // Aktifkan mode klien setelah komponen terpasang
    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchMapData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get('/api/v1/room/mapData', {
                withCredentials: true,
            })
            // Akses data dengan aman
            setMapData(response.data.data) 
        } catch (err: any) {
            console.error('Error fetching map data:', err)
            setError(err.response?.data?.message || 'Gagal memuat data peta. Pastikan API berjalan.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Hanya fetch data jika di sisi klien
        if (isClient) {
            fetchMapData()
        }
    }, [isClient])

    // Memoize validMarkers dan mapCenter untuk performa
    const { validMarkers, mapCenter } = useMemo(() => {
        const currentValidMarkers = mapData ? mapData.filter(
            (room) =>
                room.latitude &&
                room.longitude &&
                room.borrowed_facilities_count > 0
        ) : [];
        
        const center: [number, number] = currentValidMarkers.length > 0
            ? [currentValidMarkers[0].latitude, currentValidMarkers[0].longitude]
            : defaultCenter;

        return { validMarkers: currentValidMarkers, mapCenter: center };
    }, [mapData]);

    // --- Tampilan Loading ---
    if (loading || !isClient) {
        return (
            <AuthenticatedLayout>
                <Head title="Map View" />
                <div className="flex h-full items-center justify-center min-h-[calc(100vh-64px)]">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="ml-3 text-gray-600">Memuat data peta...</p>
                </div>
            </AuthenticatedLayout>
        )
    }

    // --- Tampilan Utama ---
    return (
        <AuthenticatedLayout>
            <Head title="Map View" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Peta Lokasi Peminjaman Aktif</h1>

                {error ? (
                    <div className="text-red-600 bg-red-100 p-4 rounded-xl flex items-center justify-between">
                        <span className="flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            {error}
                        </span>
                        <button onClick={fetchMapData} className="text-indigo-600 underline font-medium hover:text-indigo-800">
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-140px)]">
                        {/* Render komponen peta hanya jika isClient true */}
                        {isClient && (
                            <DynamicMap 
                                validMarkers={validMarkers} 
                                mapCenter={mapCenter} 
                            />
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}