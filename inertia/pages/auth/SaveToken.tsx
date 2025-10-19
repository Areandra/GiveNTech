import { useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function SaveToken() {
  const { token, user } = usePage().props

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      router.visit('/admin/dashboard')
    }
  }, [token])

  return <div>Signing in...</div>
}
