import { useState, ReactNode } from 'react'
import { router } from '@inertiajs/react'
import {
  Home,
  Calendar,
  Building,
  MapPin,
  QrCode,
  Menu,
  X,
  User,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { MenuItem } from '../types/index'

interface AdminLayoutProps {
  children: ReactNode
  activeMenu: string
  user: any
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Calendar, label: 'Booking', href: '/booking' },
  { icon: Building, label: 'Facility', href: '/facilities' },
  { icon: MapPin, label: 'Map View', href: '/map' },
  { icon: QrCode, label: 'QR Scanner', href: '/qrScanner' },
]

const AdminLayout = ({ children, activeMenu, user }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleMenuClick = (href: string) => {
    router.visit(href)

    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-red-700 to-red-800 text-white transition-transform duration-300 transform`}
      >
        <div className="p-6 border-b border-red-600">
          <h1 className="text-2xl font-bold">GivenTech</h1>
          <p className="text-red-200 text-sm mt-1">Facility Management</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.href === activeMenu
                  ? 'bg-red-600 shadow-lg text-white'
                  : 'text-red-100 hover:bg-red-600/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-left">{item.label}</span>
              {item.href === activeMenu && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-600">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-red-200 text-xs">{user.role}</p>
            </div>
            <ShieldCheck className="w-4 h-4 ml-auto text-green-300" />
            <LogOut onClick={() => router.post('/logout')} />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-64">
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
                <h1 className="text-xl font-bold text-gray-900"></h1>
                <p className="text-gray-600 text-sm"></p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
