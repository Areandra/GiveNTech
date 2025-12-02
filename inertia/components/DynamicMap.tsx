import React, { useEffect, useState } from 'react'

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

interface DynamicMapProps {
  validMarkers: RoomMapData[]
  mapCenter: [number, number]
}

const DynamicMap: React.FC<DynamicMapProps> = ({ validMarkers, mapCenter }) => {
  const [LeafletComponents, setLeafletComponents] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  // useEffect(() => {
  //   Promise.all([
  //     import('react-leaflet'),
  //     import('leaflet/dist/leaflet.css'),
  //     import('leaflet'),
  //   ]).then(([reactLeaflet, _leafletCSS, leaflet]) => {
  //     setLeafletComponents(reactLeaflet)
  //     setL(leaflet)
  //   })
  // }, [])

  useEffect(() => {
    Promise.all([
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css'),
      import('leaflet'), 
    ]).then(([reactLeaflet, _leafletCSS, leaflet]) => {
      
      const L = leaflet
      if (L && L.Icon && L.Icon.Default) {
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/assets/marker-icon-2x.png',
            iconUrl: '/assets/marker-icon.png',
            shadowUrl: '/assets/marker-shadow.png',
          });
      }

      setLeafletComponents(reactLeaflet)
      setL(L)
    })
  }, [])

  if (!LeafletComponents || !L) {
    return <div className="flex justify-center items-center h-full">Memuat peta...</div>
  }

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents

  // Custom marker
  // const customIcon = (count: number) => {
  //   return L.divIcon({
  //     className: 'custom-map-icon',
  //     html: `<div class="bg-indigo-600 text-white rounded-full p-2 shadow-lg flex flex-col items-center justify-center font-bold text-xs ring-4 ring-indigo-300 w-10 h-10">
  //             <span class="text-xs">${count}</span>
  //             <span class="text-[8px] leading-none">items</span>
  //           </div>`,
  //     iconSize: [40, 40],
  //     iconAnchor: [20, 40],
  //     popupAnchor: [0, -30],
  //   })
  // }
  const customIcon = (count: number) => {
    // Tentukan warna marker berdasarkan jumlah pinjaman aktif (opsional)
    const bgColor = count > 5 ? 'bg-red-600' : 'bg-indigo-600'; 
    const ringColor = count > 5 ? 'ring-red-300' : 'ring-indigo-300';
    
    return L.divIcon({
      className: 'custom-map-icon',
      // Menggunakan Tailwind CSS untuk marker kustom
      html: `<div class="${bgColor} text-white rounded-full p-2 shadow-lg flex flex-col items-center justify-center font-bold text-xs ring-4 ${ringColor} w-10 h-10">
              <span class="text-xs">${count}</span>
              <span class="text-[8px] leading-none">items</span>
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -30],
    })
  }
  console.log('tonti', validMarkers)
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

      {validMarkers.map((room) => (
        <Marker
          key={room.id}
          position={[room.latitude, room.longitude]}
          icon={customIcon(room.borrowed_facilities_count)}
        >
          <Popup className="max-w-xs">
            <div className="font-semibold text-lg text-indigo-700 mb-2">{room.room_name}</div>
            <p className="text-sm text-gray-600 mb-2">
              Koordinat: ({Number(room.latitude).toFixed(6)}, {Number(room.longitude).toFixed(6)})
            </p>
            <p className="text-sm font-medium text-gray-800">
              Total Item Dipinjam:{' '}
              <span className="ml-1 font-bold">{room.borrowed_facilities_count}</span>
            </p>
            {room.active_bookings.length > 0 && (
              <div className="mt-3 border-t pt-2 max-h-32 overflow-y-auto">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">
                  Detail Peminjaman Aktif:
                </h4>
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
export default DynamicMap