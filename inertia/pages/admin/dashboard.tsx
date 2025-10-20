import { Head } from '@inertiajs/react'
import AdminLayout from '../../app/Layouts/adminlayout'

export default function Dashboard({
  bookings,
  fasilitas,
  users,
}: {
  bookings: any[]
  fasilitas: any[]
  users: any[]
}) {
  return (
    <AdminLayout>
      <Head title="Dashboard Admin" />
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Selamat datang di panel admin peminjaman fasilitas kampus.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={users.length} />
          <StatCard title="Total Fasilitas" value={fasilitas.length} />
          <StatCard title="Total Booking" value={bookings.length} />
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <p className="mt-2 text-3xl font-bold text-blue-600">{value}</p>
    </div>
  )
}
