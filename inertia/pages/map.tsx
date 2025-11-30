import React, { useEffect, useState } from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '#layout/AuthenticatedLayout'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin, Package, Loader2, AlertTriangle } from 'lucide-react'
import L from 'leaflet'

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

// ======================================
// 2. Custom Marker Icon
// ======================================
// Note: Anda harus memastikan CSS untuk 'custom-map-icon' dimuat 
// (misalnya di inertia/css/app.css) agar styling ini berfungsi.
const customIcon = (count: number) => {
    return L.divIcon({
        className: 'custom-map-icon',
        html: `<div class="bg-indigo-600 text-white rounded-full p-2 shadow-lg flex flex-col items-center justify-center font-bold text-xs ring-4 ring-indigo-300 w-10 h-10">
            <span class="text-xs">${count}</span>
            <span class="text-[8px] leading-none">items</span>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Anchor di bawah tengah
        popupAnchor: [0, -30],
    })
}

// ======================================
// 3. Komponen Peta Utama
// ======================================
export default function MapPage() {
    const [mapData, setMapData] = useState<RoomMapData[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Koordinat default (misalnya, di tengah Indonesia atau lokasi kampus)
    const defaultCenter: L.LatLngTuple = [-0.8587123, 119.8970034]

    const fetchMapData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get('/api/v1/room/mapData', {
                // Gunakan credentials yang sama dengan permintaan Inertia lainnya
                withCredentials: true,
            })
            setMapData(response.data.data)
        } catch (err: any) {
            console.error('Error fetching map data:', err)
            setError(err.response?.data?.message || 'Gagal memuat data peta. Pastikan API berjalan.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMapData()
    }, [])

    // Set pusat peta berdasarkan data valid pertama atau default
    const validMarkers = mapData ? mapData.filter(
        (room) =>
            room.latitude &&
            room.longitude &&
            room.borrowed_facilities_count > 0
    ) : [];

    const mapCenter = validMarkers.length > 0
        ? [validMarkers[0].latitude, validMarkers[0].longitude] as L.LatLngTuple
        : defaultCenter;


    if (loading) {
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
                        <button onClick={fetchMapData} className="text-indigo-600 underline font-medium hover:text-indigo-800">
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-140px)]">
                        {/*  */}
                        <MapContainer
                            center={mapCenter}
                            zoom={15}
                            scrollWheelZoom={true}
                            className="h-full w-full rounded-xl"
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
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}