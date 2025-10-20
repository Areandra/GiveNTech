import { Head, router, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Mail, Lock, User, Loader2, UserPlus, Chrome } from 'lucide-react'

export default function Register() {
  const { data, setData, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [loadingGoogle, setLoadingGoogle] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/auth/register', {
      username: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    })
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('redirect') === 'admin') {
      router.visit('/admin/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      })
    } else if (query.get('redirect') === 'user') {
      router.visit('/user/index', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      })
    }
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [])

  const handleGoogleRegister = () => {
    setLoadingGoogle(true)
    window.location.href = '/oauth/google'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Head title="Register" />

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Daftar Akun</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Lengkap</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
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

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Konfirmasi Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {processing ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            <span>Daftar</span>
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-gray-400 text-sm">atau</span>
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={loadingGoogle}
          className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition disabled:opacity-50"
        >
          {loadingGoogle ? (
            <Loader2 size={18} className="animate-spin text-gray-600" />
          ) : (
            <Chrome size={18} className="text-red-500" />
          )}
          <span className="text-sm text-gray-700">Daftar dengan Google</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun?{' '}
          <a onClick={() => router.visit('/login')} className="text-blue-600 hover:underline">
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  )
}
