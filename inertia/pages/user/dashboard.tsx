import { Head } from '@inertiajs/react'
import UserLayout from '../../app/Layouts/userlayout'
import { Calendar } from 'lucide-react'

export default function Dashboard({
  user,
}: {
  user: {
    id: number
    username: string
    bookings: {
      id: number
      status: string
      tglPinjam: string
      tglKembali: string
      fasilitas?: { id: number; nama: string; noRuang: string }
    }[]
  }
}) {
  console.log(localStorage.getItem('access_token'))
  return (
    <UserLayout>
      <Head title="Dashboard" />

      <div>
        <h1 className="text-2xl font-bold mb-4">Selamat datang, {user.username} 👋</h1>
        <p className="text-gray-600 mb-8">
          Berikut adalah ringkasan aktivitas peminjaman fasilitas Anda.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Booking" value={user.bookings.length} />
          <StatCard
            title="Booking Aktif"
            value={user.bookings.filter((b) => b.status === 'Digunakan').length}
          />
        </div>
      </div>
    </UserLayout>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-blue-500" />
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      </div>
      <p className="mt-2 text-3xl font-bold text-blue-600">{value}</p>
    </div>
  )
}