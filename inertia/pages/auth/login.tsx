import { router, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Mail, Lock, Loader2, LogIn, Github, Chrome } from 'lucide-react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const query = new URLSearchParams(window.location.search)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/auth/login')
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    console.log('ulang', localStorage.getItem('access_token'))
    if (query.get('redirect') === 'login') {
      router.visit('/admin/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      })
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])
  
  const handleGoogleLogin = () => {
    setLoadingGoogle(true)
    window.location.href = '/oauth/google'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {processing ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            <span>Login</span>
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-gray-400 text-sm">atau</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition disabled:opacity-50"
        >
          {loadingGoogle ? (
            <Loader2 size={18} className="animate-spin text-gray-600" />
          ) : (
            <Chrome size={18} className="text-red-500" />
          )}
          <span className="text-sm text-gray-700">Login dengan Google</span>
        </button>
      </div>
    </div>
  )
}
