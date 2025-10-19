// import { router } from '@inertiajs/react';
import AdminLayout from '../../app/Layouts/adminlayout'

// interface Booking {
//     id: number
//     no_ruang: string
//     status: string
//     tgl_pinjam: string
//     tgl_kembali: string
//     id_user: number
//     id_fasilitas: number
// }

// interface Props {
//     bookings: Booking[]
//     fasilitas: any[]
//     users: any[]
// }

export default function Booking({ bookings }: { bookings: any[]}) {
    console.log(bookings);
    // const bk = async (id) => {
    //     await router.post(`/admin/booking/${id}`,{
    //     });
    // }
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Daftar Booking</h1>
                <p className="text-gray-600 mb-8">Berikut data peminjaman fasilitas kampus.</p>

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
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3">{item.noRuang}</td>
                                    <td className="px-6 py-3">{item.user?.username ?? '-'}</td>
                                    <td className="px-6 py-3">{item.idFasilitas}</td>
                                    <td className="px-6 py-3">{new Date(item.tglPinjam).toLocaleDateString()}</td>
                                    <td className="px-6 py-3">{new Date(item.tglKembali).toLocaleDateString()}</td>
                                    <td className="px-6 py-3">
                                        <StatusBadge status={item.status} />
                                    </td>
                                </tr>
                            ))}

                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-gray-500">
                                        Tidak ada data booking.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
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

    return (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
            {status}
        </span>
    )
}
