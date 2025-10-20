import { ReactNode, useState } from 'react'
import { router } from '@inertiajs/react'
import { Home, Users, Building2, Calendar, Menu } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: LayoutProps) {
  const [open, setOpen] = useState(true)

  const menu = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/user/index' },
    { label: 'Fasilitas', icon: <Building2 size={20} />, path: '/user/fasilitas' },
    { label: 'Bookings', icon: <Calendar size={20} />, path: '/user/booking' },
    { label: 'Profile', icon: <Users size={20} />, path: '/user/profile' },
  ]
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-sm transition-all duration-200 ${
          open ? 'w-56' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {open && <h1 className="font-bold text-blue-600 text-lg">User Panel</h1>}
          <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-blue-600">
            <Menu size={20} />
          </button>
        </div>

        <nav className="p-2">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={() => router.visit(item.path)}
              className={`flex items-center w-full p-2 mb-2 rounded-lg ${window.location.pathname === item.path ? 'text-white-600 bg-blue-400 ' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="mr-3">{item.icon}</div>
              {open && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t">
        </div>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
