// resources/js/Layouts/AuthenticatedLayout.tsx
import React, { PropsWithChildren } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Map, CalendarCheck, Package, User, QrCode } from 'lucide-react'

// Definisikan tipe untuk item sidebar
interface SidebarItem {
  name: string
  icon: React.ElementType
  href: string // Nilai ini harus diisi secara eksplisit
  active: boolean
}

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const currentUrl = usePage().url

  const mainMenuItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      icon: CalendarCheck,
      // PERBAIKAN: Isi href secara eksplisit
      href: '/dashboard',
      // Gunakan pola yang lebih spesifik untuk cek aktif
      active: currentUrl.includes('/dashboard'),
    },
    {
      name: 'Booking Management',
      icon: CalendarCheck,
      // PERBAIKAN: Isi href secara eksplisit
      href: '/bookings',
      // Gunakan pola yang lebih spesifik untuk cek aktif
      active: currentUrl.includes('/bookings'),
    },
    {
      name: 'Facility Management',
      icon: Package,
      // PERBAIKAN: Isi href secara eksplisit (Asumsi rute Anda adalah /facilities)
      href: '/facilities',
      // Gunakan pola yang lebih spesifik untuk cek aktif
      active: currentUrl.includes('/facilities') || currentUrl.includes('/facility/'),
    },
    {
      name: 'Map View',
      icon: Map,
      // PERBAIKAN: Isi href secara eksplisit
      href: '/map',
      active: currentUrl.includes('/map'),
    },
    {
      name: 'QR Scaner',
      icon: QrCode,
      // PERBAIKAN: Isi href secara eksplisit
      href: '/qrReader',
      active: currentUrl.includes('/qrReader'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        {/* Logo/Header Sidebar */}
        <div className="p-4 flex items-center h-16 border-b border-gray-200">
          <div className="w-6 h-6 bg-red-600 rounded-lg mr-2"></div>
          <span className="font-bold text-lg text-gray-800">FACILITY APP</span>
        </div>

        {/* Menu Navigasi Utama */}
        <nav className="p-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            MAIN NAVIGATION
          </h3>

          {mainMenuItems.map((item) => (
            <Link
              key={item.name}
              // PASTIKAN item.href SUDAH TERISI
              href={item.href}
              className={`flex items-center p-3 rounded-lg text-base transition duration-150 ${
                item.active
                  ? 'bg-red-50 text-red-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Footer Sidebar (Opsional) */}
        {/* <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </div>
        </div> */}
      </aside>

      <main className="flex-1 relative">
        {/* Header Konten */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 px-6 z-40 flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Hi, Admin</span>
            <User className="w-6 h-6 text-gray-600 border p-1 rounded-full" />
          </div>
        </header>

        {/* Konten Halaman */}
        <div className="pt-16 h-full overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
