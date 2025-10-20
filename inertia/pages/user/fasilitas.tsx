import { useState } from 'react'
import UserLayout from '../../app/Layouts/userlayout'
import { Head, router } from '@inertiajs/react'

export default function Fasilitas({ fasilitas }: { fasilitas: any[] }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedFasilitas, setSelectedFasilitas] = useState<any | null>(null)
    const [noRuang, setNoRuang] = useState('')
    const [loading, setLoading] = useState(false)

    const handlePinjamClick = (item: any) => {
        if (item.status !== 'Tersedia') {
            return
        }
        setSelectedFasilitas(item)
        setNoRuang('')
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        if (!noRuang.trim()) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
                body: JSON.stringify({ id_fasilitas: selectedFasilitas.id, no_ruang: noRuang }),
            })


            if (res.ok) {

                setModalOpen(false)
                router.reload()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <UserLayout>
                  <Head title="Fasilitas" />

            <div>
                <h1 className="text-2xl font-bold mb-4">Daftar Fasilitas</h1>
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Nama Fasilitas</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Tanggal Input</th>
                                <th className="px-6 py-3">Aksi</th>
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
                                    <td className="px-6 py-3">
                                        <button
                                            className={`px-3 py-1 rounded text-white ${item.status === 'Tersedia' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                            onClick={() => handlePinjamClick(item)}
                                            disabled={item.status !== 'Tersedia'}
                                        >
                                            Pinjam
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <h2 className="text-lg font-bold mb-4">Pinjam Fasilitas: {selectedFasilitas?.nama}</h2>
                            <label className="block mb-2 font-medium">Nomor Ruang</label>
                            <input
                                type="text"
                                value={noRuang}
                                onChange={(e) => setNoRuang(e.target.value)}
                                className="border rounded w-full px-3 py-2 mb-4"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                    disabled={loading}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? 'Meminjam...' : 'Pinjam'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    )
}

function StatusBadge({ status }: { status: string }) {
    const color =
        status === 'Tersedia'
            ? 'bg-green-100 text-green-700'
            : status === 'Digunakan'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'

    return (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
            {status}
        </span>
    )
}
