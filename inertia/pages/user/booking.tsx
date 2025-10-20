import { Head } from '@inertiajs/react'
import UserLayout from '../../app/Layouts/userlayout' 

export default function Booking({
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
      <Head title="Boooking" />

      <div>
        <h1 className="text-2xl font-bold mb-4">Selamat datang, {user.username} 👋</h1>
        <p className="text-gray-600 mb-8">
          Berikut adalah ringkasan aktivitas peminjaman fasilitas Anda.
        </p>

        {/* Daftar Booking Terbaru */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Fasilitas</th>
                <th className="px-6 py-3">No. Ruang</th>
                <th className="px-6 py-3">Tgl Pinjam</th>
                <th className="px-6 py-3">Tgl Kembali</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {user.bookings.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{item.fasilitas?.nama ?? '-'}</td>
                  <td className="px-6 py-3">{item.fasilitas?.noRuang ?? '-'}</td>
                  <td className="px-6 py-3">{new Date(item.tglPinjam).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{new Date(item.tglKembali).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}

              {user.bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Anda belum memiliki booking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  )
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'Disetujui'
      ? 'bg-green-100 text-green-700'
      : status === 'Menunggu'
        ? 'bg-yellow-100 text-yellow-700'
        : status === 'Dibatalkan'
          ? 'bg-red-100 text-red-700'
          : 'bg-gray-100 text-gray-600'

  return <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>{status}</span>
}
