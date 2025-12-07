import GuestLayout from '#layout/GuestLayout'
import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, KeyRound, RotateCcw } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [processingReset, setProcessingReset] = useState(false)

  const [otpTimer, setOtpTimer] = useState(0)
  const OTP_DURATION = 120

  const startOtpTimer = () => {
    setOtpTimer(OTP_DURATION)
  }

  useEffect(() => {
    if (otpTimer <= 0) return

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [otpTimer])

  const submitEmail = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await axios.post('/auth/forgot-password', { email })

      setSuccessMsg('OTP has been sent to your email!')
      setShowOtpModal(true)
      startOtpTimer()
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed sending OTP')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    try {
      setErrorMsg('')
      setSuccessMsg('')
      await axios.post('/auth/forgot-password', { email })

      setSuccessMsg('OTP has been resent to your email!')
      startOtpTimer()
    } catch (err: any) {
      setErrorMsg('Failed to resend OTP')
    }
  }

  const submitResetPassword = async () => {
    if (otpTimer <= 0) {
      setErrorMsg('Your OTP has expired. Please resend a new one.')
      return
    }

    setProcessingReset(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await axios.put('/auth/forgot-password', {
        email,
        otp,
        newPassword,
      })

      setSuccessMsg('Password successfully reset! Redirecting...')
      setTimeout(() => router.visit('/login'), 1500)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid OTP or error')
    } finally {
      setProcessingReset(false)
    }
  }

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Forgot Your Password?</h3>
          <p className="text-gray-600 text-sm">Enter your email to receive an OTP.</p>
        </motion.div>

        {successMsg && (
          <div className="mb-3 text-green-600 bg-green-50 p-3 rounded-lg w-full text-sm">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-3 text-red-600 bg-red-50 p-3 rounded-lg w-full text-sm">
            {errorMsg}
          </div>
        )}

        <motion.form
          onSubmit={submitEmail}
          className="w-full space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 w-full p-3 border rounded-lg text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </motion.form>

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

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-[95%] max-w-md shadow-xl"
          >
            <h2 className="text-lg font-bold mb-2">Enter OTP & New Password</h2>

            <p className="text-xs text-gray-600 mb-4">
              OTP has been sent to <strong>{email}</strong>.
            </p>

            <div className="text-sm font-semibold text-red-600 mb-3">
              {otpTimer > 0 ? (
                <>OTP expires in: {otpTimer}s</>
              ) : (
                <span className="text-red-500">OTP expired</span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">OTP Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-9 w-full p-3 border rounded-lg text-sm"
                    placeholder="Enter OTP"
                    disabled={otpTimer <= 0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9 w-full p-3 border rounded-lg text-sm"
                    placeholder="New password"
                    disabled={otpTimer <= 0}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-3 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              {otpTimer <= 0 ? (
                <button
                  onClick={resendOtp}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  <RotateCcw className="w-4 h-4" /> Resend OTP
                </button>
              ) : (
                <button
                  onClick={submitResetPassword}
                  disabled={processingReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  {processingReset ? 'Processing…' : 'Reset Password'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </GuestLayout>
  )
}
