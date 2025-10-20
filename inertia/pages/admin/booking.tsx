import { Head, router } from '@inertiajs/react'
import AdminLayout from '../../app/Layouts/adminlayout'

export default function Booking({ bookings }: { bookings: any[] }) {
  const menunggu = bookings.filter((b) => b.status === 'Menunggu')
  const dipinjam = bookings.filter((b) => b.status === 'Digunakan')
  const lainnya = bookings.filter((b) => b.status !== 'Menunggu' && b.status !== 'Digunakan')

  const handleAction = async (action: string, id: number) => {
    if (!confirm(`Apakah Anda yakin ingin ${action.toLowerCase()} booking ini?`)) return

    try {
      if (action === 'Hapus') {
        await fetch(`/api/bookings/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
      } else {
        let newBookingStatus = ''
        if (action === 'Setujui') newBookingStatus = 'Digunakan'
        else if (action === 'Kembali') newBookingStatus = 'Dikembalikan'
        if (!newBookingStatus) return

        await fetch(`/api/bookings/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ status: newBookingStatus }),
        })

        const fasilitasId = bookings.find((i) => i.id === id).idFasilitas
        const bookingToFasilitas: Record<string, string> = {
          Menunggu: 'Di Reservasi',
          Disetujui: 'Digunakan',
          Digunakan: 'Digunakan',
          Dikembalikan: 'Tersedia',
          Dibatalkan: 'Tersedia',
          Perawatan: 'Perawatan',
        }
        const newFasilitasStatus = bookingToFasilitas[newBookingStatus] || 'Tersedia'

        await fetch(`/api/fasilitas/${fasilitasId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ status: newFasilitasStatus }),
        })
      }

      router.reload()
    } catch (error) {
      console.error('Gagal melakukan aksi:', error)
      alert('Terjadi kesalahan saat melakukan aksi.')
    }
  }

  return (
    <AdminLayout>
      <Head title="Booking Admin" />
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Daftar Booking</h1>
        <p className="text-gray-600 mb-8">Berikut data peminjaman fasilitas kampus.</p>

        <SectionTable
          title="Menunggu Persetujuan"
          color="yellow"
          data={menunggu}
          actionLabel="Setujui"
          onAction={handleAction}
        />

        <SectionTable
          title="Sedang Dipinjam"
          color="blue"
          data={dipinjam}
          actionLabel="Kembali"
          onAction={handleAction}
        />

        <SectionTable
          title="Riwayat dan Lainnya"
          color="gray"
          data={lainnya}
          actionLabel="Hapus"
          onAction={handleAction}
        />
      </div>
    </AdminLayout>
  )
}

function SectionTable({
  title,
  color,
  data,
  actionLabel,
  onAction,
}: {
  title: string
  color: 'yellow' | 'blue' | 'gray' | string
  data: any[]
  actionLabel: string
  onAction: (action: string, id: number) => void
}) {
  return (
    <div className="mb-10">
      <h2
        className={`text-xl font-semibold mb-3 border-l-4 pl-3 ${
          color === 'yellow'
            ? 'border-yellow-500 text-yellow-700'
            : color === 'blue'
              ? 'border-blue-500 text-blue-700'
              : 'border-gray-400 text-gray-700'
        }`}
      >
        {title}
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">No. Ruang</th>
              <th className="px-6 py-3">User ID</th>
              <th className="px-6 py-3">Fasilitas ID</th>
              <th className="px-6 py-3">Tgl Pinjam</th>
              <th className="px-6 py-3">Tgl Kembali</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">{item.noRuang}</td>
                <td className="px-6 py-3">{item.user?.username ?? '-'}</td>
                <td className="px-6 py-3">{item.fasilitas.nama}</td>
                <td className="px-6 py-3">{new Date(item.tglPinjam).toLocaleDateString()}</td>
                <td className="px-6 py-3">{new Date(item.tglKembali).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    className={`px-3 py-1 rounded text-xs font-medium text-white transition
                      ${
                        color === 'yellow'
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : color === 'blue'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                    onClick={() => onAction(actionLabel, item.id)}
                  >
                    {actionLabel}
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Tidak ada data {title.toLowerCase()}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'Digunakan'
      ? 'bg-blue-100 text-blue-700'
      : status === 'Menunggu'
        ? 'bg-yellow-100 text-yellow-700'
        : status === 'Dikembalikan'
          ? 'bg-green-100 text-green-700'
          : status === 'Perawatan'
            ? 'bg-gray-200 text-gray-700'
            : status === 'Di Reservasi'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600'

  return <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>{status}</span>
}
