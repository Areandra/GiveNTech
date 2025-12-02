// File: resources/js/Pages/MapPage.tsx
import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '#layout/AuthenticatedLayout'
import axios from 'axios'
import { Loader2, AlertTriangle } from 'lucide-react'

// Lazy load DynamicMap (peta hanya di client)
const DynamicMap = lazy(() => import('#components/DynamicMap'))

// Tipe Data
interface ActiveBooking {
  id: number
  status: string
  fasilitas: { name: string; type: string }
  user: { username: string }
}

interface RoomMapData {
  id: number
  room_name: string
  longitude: number
  latitude: number
  borrowed_facilities_count: number
  active_bookings: ActiveBooking[]
}

// Koordinat default
const defaultCenter: [number, number] = [-0.8416396128141402, 119.89278946944664]

export default function MapPage() {
  const [mapData, setMapData] = useState<RoomMapData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Tandai mode client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch data peta
  const fetchMapData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/v1/room/mapData', { withCredentials: true })
      setMapData(response.data.data)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Gagal memuat data peta. Pastikan API berjalan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isClient) fetchMapData()
  }, [isClient])

  // Memoize markers dan center
  const { validMarkers, mapCenter } = useMemo(() => {
    const currentValidMarkers =
      mapData?.filter(
        (room) => room.latitude && room.longitude && room.borrowed_facilities_count > 0
      ) || []

    console.log('Total Marker yang lolos filter:', currentValidMarkers.length);
    console.log('Marker yang lolos:', currentValidMarkers);

    const center: [number, number] =
      currentValidMarkers.length > 0
        ? [currentValidMarkers[0].latitude, currentValidMarkers[0].longitude]
        : defaultCenter
    console.log('anj', mapData)
    return { validMarkers: currentValidMarkers, mapCenter: center }
  }, [mapData])

  // Loading skeleton
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
            <button
              onClick={fetchMapData}
              className="text-indigo-600 underline font-medium hover:text-indigo-800"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-140px)]">
            {/* Render peta hanya di client */}
            {isClient && (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  </div>
                }
              >
                <DynamicMap validMarkers={validMarkers} mapCenter={mapCenter} />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
