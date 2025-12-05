import React, { useEffect, useState } from 'react'
import { AlertTriangle, Clock, Package } from 'lucide-react'

const DynamicMap: React.FC<any> = ({ allRoomsData, mapCenter }) => {
  const [LeafletComponents, setLeafletComponents] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css'),
      import('leaflet'),
    ]).then(([reactLeaflet, _leafletCSS, leaflet]) => {
      const L = leaflet
      if (L && L.Icon && L.Icon.Default) {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/assets/marker-icon-2x.png',
          iconUrl: '/assets/marker-icon.png',
          shadowUrl: '/assets/marker-shadow.png',
        })
      }

      setLeafletComponents(reactLeaflet)
      setL(L)
    })
  }, [])

  if (!LeafletComponents || !L) {
    return (
      <div className="flex justify-center items-center h-full text-gray-600">Memuat peta...</div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents

  const customActiveIcon = (count: number) => {
    const bgColor = 'bg-red-600'
    const ringColor = 'ring-red-300'

    return L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="${bgColor} text-white rounded-full shadow-lg flex flex-col items-center justify-center font-bold text-sm ring-4 ${ringColor} w-10 h-10 border-2 border-white">
              <span class="text-xs font-extrabold">${count}</span>
              <span class="text-[8px] leading-none">AKTIF</span>
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -30],
    })
  }

  const customRoomIcon = () => {
    return L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="bg-gray-400 text-white rounded-full shadow flex items-center justify-center w-8 h-8 border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M12 19.5l-7-7a5 5 0 1 1 10 0l-7 7z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -12],
    })
  }

  const activeRooms = allRoomsData.filter((room: any) => room.borrowed_facilities_count > 0)
  const inactiveRooms = allRoomsData.filter((room: any) => room.borrowed_facilities_count === 0)

  return (
    <MapContainer
      center={mapCenter}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
      key={mapCenter.toString()}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {inactiveRooms.map((room: any) => (
        <Marker
          key={`inactive-${room.id}`}
          position={[room.latitude, room.longitude]}
          icon={customRoomIcon()}
        >
          <Popup className="max-w-xs">
            <div className="font-semibold text-lg text-gray-700 mb-1">{room.room_name}</div>
            <p className="text-sm text-gray-500 mb-2">Lokasi Terdaftar</p>
            <p className="text-sm font-medium text-gray-800 flex items-center">
              <Package className="w-4 h-4 mr-1 text-green-500" />
              Status: <span className="ml-1 font-bold text-green-600">Tersedia</span>
            </p>
          </Popup>
        </Marker>
      ))}

      {activeRooms.map((room: any) => (
        <Marker
          key={`active-${room.id}`}
          position={[room.latitude, room.longitude]}
          icon={customActiveIcon(room.borrowed_facilities_count)}
        >
          <Popup className="max-w-xs">
            <div className="font-semibold text-lg text-red-700 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" /> {room.room_name}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Koordinat: ({Number(room.latitude).toFixed(6)}, {Number(room.longitude).toFixed(6)})
            </p>
            <p className="text-sm font-medium text-gray-800 border-b pb-2 mb-2">
              Total Item Dipinjam:{' '}
              <span className="ml-1 font-bold text-red-600">{room.borrowed_facilities_count}</span>
            </p>

            {room.active_bookings.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Detail Peminjaman Aktif:
                </h4>
                <ul className="space-y-2">
                  {room.active_bookings.map((booking: any, index: any) => (
                    <li key={index} className="text-xs p-2 bg-red-50 rounded border border-red-200">
                      <div className="font-semibold text-gray-800">{booking.fasilitas.name}</div>
                      <div className="text-red-500 italic mt-0.5">by {booking.user.username}</div>
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
export default DynamicMap
