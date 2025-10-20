import { useForm, router, Head } from '@inertiajs/react'
import { useState } from 'react'
import { User, Mail, Lock, Save, LogOut, Loader2, Edit3 } from 'lucide-react'
import UserLayout from '../../app/Layouts/userlayout'

export default function Profile({ user }: { user: any }) {
  const [editing, setEditing] = useState(false)
  const { data, setData, patch, processing, errors } = useForm<{
    name: string
    email: string
    password: string
  }>({
    name: user.username || '',
    email: user.email || '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patch('/user/profile/update', {
      onSuccess: () => setEditing(false),
    })
  }

  const handleLogout = () => {
    router.post('/auth/logout')
  }

  return (
    <UserLayout>
      <Head title="Profile" />

      <div className="min-h-full flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Profil Saya</h1>

          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4">
              <User size={40} />
            </div>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>

              {user.role && (
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {user.role}
                  </span>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit3 size={18} />
                  <span>Edit Profil</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center items-center gap-2 border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <User size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="Nama kamu"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Mail size={18} className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password Baru (opsional)
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Lock size={18} className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </UserLayout>
  )
}
