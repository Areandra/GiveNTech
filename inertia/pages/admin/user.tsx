import AdminLayout from '../../app/Layouts/adminlayout'

// interface User {
//   id: number
//   name: string
//   email: string
//   role: string
//   created_at: string
// }

// interface Props {
//   users: User[]
// }

export default function User({ users }: { users: any[] }) {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>
                <p className="text-gray-600 mb-8">Berikut adalah data semua pengguna yang terdaftar dalam sistem.</p>

                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Tanggal Daftar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-3 text-gray-700">{user.email}</td>
                                    <td className="px-6 py-3">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-6 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-500">
                                        Tidak ada data pengguna.
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

function RoleBadge({ role }: { role: string }) {
    const color =
        role === 'admin'
            ? 'bg-blue-100 text-blue-700'
            : role === 'petugas'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'

    return (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    )
}
