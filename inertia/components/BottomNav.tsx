import { Home, Building, History } from 'lucide-react'
import { router, usePage } from '@inertiajs/react'

export default function BottomNav() {
  const { url } = usePage()

  const isActive = (path: string) => url.startsWith(path)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around py-3">

        {/* HOME */}
        <button
          onClick={() => router.visit('/user/dashboard')}
          className={`flex flex-col items-center ${
            isActive('/user/dashboard') ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>

        {/* FASILITAS */}
        <button
          onClick={() => router.visit('/user/facilities')}
          className={`flex flex-col items-center ${
            isActive('/user/facilities') ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          <Building className="h-6 w-6" />
          <span className="text-xs mt-1">Fasilitas</span>
        </button>

        {/* RIWAYAT */}
        <button
          onClick={() => router.visit('/user/booking/history')}
          className={`flex flex-col items-center ${
            isActive('/user/booking/history') ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          <History className="h-6 w-6" />
          <span className="text-xs mt-1">Riwayat</span>
        </button>

      </div>
    </div>
  )
}
