/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import axios from 'axios'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

axios.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage di SETIAP request
    const token = localStorage.getItem('access_token')

    if (token) {
      // Tambahkan ke header
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
