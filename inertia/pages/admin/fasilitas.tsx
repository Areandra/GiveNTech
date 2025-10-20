import { router } from '@inertiajs/react'
import AdminLayout from '../../app/Layouts/adminlayout'
import { useState } from 'react'

export default function Fasilitas({ fasilitas }: { fasilitas: any[] }) {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editedNama, setEditedNama] = useState('')
    const [editedStatus, setEditedStatus] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [newNama, setNewNama] = useState('')
    const [newStatus, setNewStatus] = useState('Tersedia')

    const handleEditClick = (item: any) => {
        setEditingId(item.id)
        setEditedNama(item.nama)
        setEditedStatus(item.status)
    }

    const handleSave = async (id: number) => {
        const res = await fetch(`/api/fasilitas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ nama: editedNama, status: editedStatus }),
        })

        if (res.ok) {
            alert('Data berhasil diupdate!')
            setEditingId(null)
            router.reload()
        } else {
            console.error(res)
        }
    }

    const handleAddFasilitas = async () => {
        const res = await fetch('/api/fasilitas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ nama: newNama}),
        })

        if (res.ok) {
            alert('Fasilitas berhasil ditambahkan!')
            setShowModal(false)
            setNewNama('')
            setNewStatus('Tersedia')
            router.reload()
        } else {
            console.error(await res.json())
            alert('Gagal menambahkan fasilitas.')
        }
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Daftar Fasilitas</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    + Tambah Fasilitas
                </button>
            </div>

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
                                <td className="px-6 py-3">
                                    {editingId === item.id ? (
                                        <input
                                            type="text"
                                            value={editedNama}
                                            onChange={(e) => setEditedNama(e.target.value)}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        item.nama
                                    )}
                                </td>
                                <td className="px-6 py-3">
                                    {editingId === item.id ? (
                                        <select
                                            value={editedStatus}
                                            onChange={(e) => setEditedStatus(e.target.value)}
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value="Tersedia">Tersedia</option>
                                            <option value="Digunakan">Digunakan</option>
                                            <option value="Perawatan">Perawatan</option>
                                        </select>
                                    ) : (
                                        <StatusBadge status={item.status} />
                                    )}
                                </td>
                                <td className="px-6 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-3">
                                    {editingId === item.id ? (
                                        <>
                                            <button onClick={() => handleSave(item.id)} className="mr-2 text-blue-600">Simpan</button>
                                            <button onClick={() => setEditingId(null)} className="text-red-600">Batal</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEditClick(item)} className="text-green-600">Edit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah Fasilitas */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Tambah Fasilitas Baru</h2>
                        <div className="mb-3">
                            <label className="block text-sm mb-1">Nama Fasilitas</label>
                            <input
                                type="text"
                                value={newNama}
                                onChange={(e) => setNewNama(e.target.value)}
                                className="border rounded px-3 py-2 w-full"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddFasilitas}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}


function StatusBadge({ status }: { status: string }) {
    const color =
        status === 'Tersedia'
            ? 'bg-green-100 text-green-700'
            : status === 'Perawatan'
            ? 'bg-gray-100 text-gray-600'
            : 'bg-yellow-100 text-yellow-700'

    return (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
            {status}
        </span>
    )
}
