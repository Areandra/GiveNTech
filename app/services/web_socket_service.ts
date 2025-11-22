import server from '@adonisjs/core/services/server'
import { Server as WsServer } from 'socket.io'

class Ws {
  io: WsServer | undefined
  private booted = false

  boot() {
    if (this.booted) return
    this.booted = true
    this.io = new WsServer(server.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })
    this.io.on('connection', (socket) => {
      console.log('Io Client connected ID:', socket.id)
      socket.on('disconnect', () => {
        console.log('Io Client disconnect ID:', socket.id)
      })
    })
  }
}

export default new Ws()
