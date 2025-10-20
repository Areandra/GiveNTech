import { useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function SaveToken() {
  const { token, user } = usePage<{ token: string; user: any }>().props

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role !== 'user') {
        router.visit('/admin/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        })
      } else {
        router.visit('/user/index', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        })
      }
    }
  }, [token])

  return <div>Signing in...</div>
}
