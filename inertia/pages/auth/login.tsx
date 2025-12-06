// resources/js/Pages/Auth/Login.tsx

import { useEffect, FormEventHandler } from 'react'
import GuestLayout from '#layout/GuestLayout'
import { Head, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail } from 'lucide-react'

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

      {/* Konten Login */}
      <div className="flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6" 
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome Back!
          </h3>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          className="w-full space-y-4" 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Email Field */}
          <div className="group">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Your Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-red-600" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={data.email}
                autoComplete="username"
                onChange={(e) => setData('email', e.target.value)}
                className="pl-9 w-full p-3 border-2 border-gray-200 rounded-lg 
                           focus:border-red-500 focus:ring-1 focus:ring-red-200 
                           transition-all duration-200 hover:border-gray-300 text-sm"
                // TAMBAHAN: Placeholder untuk Email
                placeholder="Email Address" 
                required
              />
            </div>
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="group">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-red-600" />
              </div>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="pl-9 w-full p-3 border-2 border-gray-200 rounded-lg 
                           focus:border-red-500 focus:ring-1 focus:ring-red-200 
                           transition-all duration-200 hover:border-gray-300 text-sm"
                // TAMBAHAN: Placeholder untuk Password
                placeholder="Password"
                required
              />
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="remember"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
              />
              <span className="text-gray-600">Remember Me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 
                       text-white p-3 rounded-lg font-semibold text-base
                       hover:from-red-700 hover:to-red-800 hover:shadow-lg
                       active:scale-[0.99] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-md"
          >
            <div className="flex items-center justify-center gap-2">
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </motion.form>

        {/* Alternative Login (Google) */}
        <motion.div
          className="mt-4 pt-4 border-t border-gray-200 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-center text-gray-600 text-sm mb-3">
            Or sign in with
          </p>

          <button
            onClick={() => (window.location.href = '/login/oauth/google')}
            className="flex items-center justify-center w-full p-3 border-2 border-gray-200 rounded-lg hover:border-red-300 
                       hover:bg-red-50 transition-all duration-200 text-sm bg-white shadow-sm font-semibold"
          >
            <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </motion.div>

        {/* Register Link */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-red-600 hover:text-red-700 underline decoration-2"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  )
}