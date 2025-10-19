import AdminLayout from '../../app/Layouts/adminlayout'

// interface Fasilitas {
//     id: number
//     nama_fasilitas: string
//     kode_fasilitas: string
//     kategori: string
//     lokasi: string
//     status: string
//     created_at: string
// }

// interface Props {
//     fasilitas: Fasilitas[]
// }

export default function Fasilitas({ fasilitas }: { fasilitas: any[]}) {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Daftar Fasilitas</h1>
                <p className="text-gray-600 mb-8">Berikut adalah data semua fasilitas yang tersedia di kampus.</p>

                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Nama Fasilitas</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Tanggal Input</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fasilitas.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{item.nama}</td>
                                    <td className="px-6 py-3">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-6 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}

                            {fasilitas.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-gray-500">
                                        Tidak ada data fasilitas.
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
        status === 'Tersedia'
            ? 'bg-green-100 text-green-700'
            : status === 'Dipinjam'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'

    return (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
            {status}
        </span>
    )
}
