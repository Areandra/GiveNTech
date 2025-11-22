import Ws from '#services/web_socket_service' // Sesuaikan path import
import app from '@adonisjs/core/services/app'

app.ready(() => {
  Ws.boot() // <--- INI WAJIB DIPANGGIL
})
