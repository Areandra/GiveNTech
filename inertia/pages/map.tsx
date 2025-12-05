import { useMemo, Suspense, lazy } from 'react'
import { Head } from '@inertiajs/react'

import AdminLayout from '../layout/AuthenticatedLayout'
import { Loader2, AlertTriangle, MapPin } from 'lucide-react'

const DynamicMap = lazy(() => import('#components/DynamicMap'))

const defaultCenter: [number, number] = [-0.8416396128141402, 119.89278946944664]

export default function MapPage({ user, mapData }: any) {
  const { validMarkers, mapCenter } = useMemo(() => {
    const currentValidMarkers =
      mapData?.filter(
        (room: any) => room.latitude && room.longitude && room.borrowed_facilities_count > 0
      ) || []

    console.log('Total Marker yang lolos filter:', currentValidMarkers.length)
    console.log('Marker yang lolos:', currentValidMarkers)

    const center: [number, number] =
      currentValidMarkers.length > 0
        ? [currentValidMarkers[0].latitude, currentValidMarkers[0].longitude]
        : defaultCenter
    console.log('anj', mapData)
    return { validMarkers: currentValidMarkers, mapCenter: center }
  }, [mapData])

  return (
    <AdminLayout user={user} activeMenu="/map">
      <Head title="Map View" />

      <div>
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Peta Lokasi Peminjaman Aktif</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Lokasi Peminjaman Aktif</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{validMarkers.length} Titik</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Fasilitas Sedang Dipinjam</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">
                {mapData
                  ? mapData.reduce((sum: any, room: any) => sum + room.borrowed_facilities_count, 0)
                  : 0}{' '}
                Item
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Ruangan Terdaftar</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">
                {mapData ? mapData.length : 0} Ruangan
              </h3>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Loader2 className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ height: 'calc(77vh)' }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <p className="ml-3 text-gray-600">Memuat tampilan peta...</p>
              </div>
            }
          >
            <DynamicMap allRoomsData={mapData} validMarkers={validMarkers} mapCenter={mapCenter} />
          </Suspense>
        </div>
      </div>
    </AdminLayout>
  )
}
