import server from '@adonisjs/core/services/server'
import { Server as WsServer, Socket } from 'socket.io'
import booking_service from './booking_service.js'

class Ws {
  io: WsServer | undefined
  private booted = false

  // Track sessions
  sessions: Record<string, string[]> = {} // sessionId => socket.id[]

  boot() {
    if (this.booted) return
    this.booted = true
    this.io = new WsServer(server.getNodeServer(), {
      cors: { origin: '*' },
    })

    this.io.on('connection', (socket: Socket) => {
      console.log('Io Client connected ID:', socket.id)

      // register sessionId dari browser
      socket.on('registerSession', (sessionId: string) => {
        if (!this.sessions[sessionId]) this.sessions[sessionId] = []
        this.sessions[sessionId].push(socket.id)
        console.log('Registered session:', sessionId)
      })

      // mobile scan QR
      socket.on(
        'scanQR',
        ({
          sessionId,
          user,
          idBooking,
        }: {
          sessionId: string
          user: string
          idBooking: number
        }) => {
          const clients = this.sessions[sessionId] || []
          clients.forEach((id) => {
            this.io?.to(id).emit('qrScanned', { idBooking, user })
          })
          console.log(`QR scanned for session ${sessionId} by ${user}, with booking ${idBooking}`)
        }
      )

      // waiting admin prosess
      socket.on(
        'waitingConfirmToPickUp',
        async ({ sessionId, idBooking }: { sessionId: string; idBooking: number }) => {
          const booking = await booking_service.updateBooking(idBooking, { status: 'Picked Up' })
          console.log('booking upate', booking.toJSON())
          const clients = this.sessions[sessionId] || []
          clients.forEach((id) => {
            this.io?.to(id).emit('facilityPickedUp', { idBooking })
          })
        }
      )

      socket.on(
        'waitingConfirmToReturn',
        async ({ sessionId, idBooking }: { sessionId: string; idBooking: number }) => {
          const booking = await booking_service.updateBooking(idBooking, { status: 'Returned' })
          console.log('booking upate', booking.toJSON())
          const clients = this.sessions[sessionId] || []
          clients.forEach((id) => {
            this.io?.to(id).emit('facilityReturned', { idBooking })
          })
        }
      )

      socket.on('disconnect', () => {
        console.log('Io Client disconnect ID:', socket.id)
        // cleanup sessions
        Object.keys(this.sessions).forEach((sessionId) => {
          this.sessions[sessionId] = this.sessions[sessionId].filter((id) => id !== socket.id)
          if (this.sessions[sessionId].length === 0) delete this.sessions[sessionId]
        })
      })
    })
  }
}

export default new Ws()
