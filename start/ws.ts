import Ws from '#services/web_socket_service'
import app from '@adonisjs/core/services/app'

app.ready(() => {
  Ws.boot()
})
