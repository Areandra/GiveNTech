import { useEffect, FormEventHandler } from 'react'
import GuestLayout from '#layout/GuestLayout'
import { Head, useForm, Link } from '@inertiajs/react'

export default function Login() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  useEffect(() => {
    return () => {
      reset('password')
    }
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <GuestLayout>
      <Head title="Login" />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back to Giventech!</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            className="mt-1 block p-2 h-8 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="mt-1 w-full p-2 h-8 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
        </div>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="remember"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-600">Remember Me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:text-indigo-900 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Login
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-xs text-gray-400 mb-4">Instant Login</p>

        <div className="flex gap-4">
          <button
            onClick={() => (window.location.href = '/login/oauth/google')}
            className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition"
          >
            <img
              src="https://imgs.search.brave.com/7UE8s6Vmejf0vIOulxuYgTsHZyIiGUJA4bIncsDWPug/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni8yOTkxLzI5OTEx/NDgucG5nP3NlbXQ9/YWlzX3doaXRlX2xh/YmVs"
              alt=""
              className='w-6 mr-4'
            />
            Continue with Google
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <p>
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-900">
            Register
          </Link>
        </p>
      </div>
    </GuestLayout>
  )
}
