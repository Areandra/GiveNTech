// resources/js/Pages/Auth/ForgotPassword.tsx

import GuestLayout from '#layout/GuestLayout'
import { Head, useForm, Link } from '@inertiajs/react' // Import Link
import { FormEventHandler } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react' // Import ArrowLeft

export default function ForgotPassword() {
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    email: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/forgot-password')
  }

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="flex flex-col items-center w-full">
        {/* Header (Dengan Motion) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Forgot Your Password?
          </h3>
          <p className="text-gray-600 text-sm">
            No problem. Just let us know your email address and we will email you a password reset link.
          </p>
        </motion.div>

        {/* Status Sukses/Error */}
        {recentlySuccessful && (
          <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg w-full">
            A new password reset link has been sent to your email address.
          </div>
        )}

        {/* Form (Dengan Motion) */}
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
              Email Address
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
                onChange={(e) => setData('email', e.target.value)}
                className="pl-9 w-full p-3 border-2 border-gray-200 rounded-lg 
                           focus:border-red-500 focus:ring-1 focus:ring-red-200 
                           transition-all duration-200 hover:border-gray-300 text-sm"
                placeholder="Email Address"
                required
                autoFocus
              />
            </div>
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            )}
          </div>

          {/* Submit Button */}
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
                  Sending Link...
                </>
              ) : (
                <>
                  Email Password Reset Link
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </motion.form>

        {/* Tombol Back to Login */}
        <motion.div
            className="mt-6 text-center text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Link 
                href="/login" 
                className="font-semibold text-red-600 hover:text-red-700 flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
            </Link>
        </motion.div>
      </div>
    </GuestLayout>
  )
}