import { useEffect, useState, useRef } from 'react'
import QRCodeToCanvas from '#components/QRCodeToCanvas'
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { QrCode, Loader2, CheckCircle, ArrowRightCircle, Building } from 'lucide-react'

interface BookingData {
  id: number
  status: string
}

export default function QRCodePage(props: any) {
  const socketRef = useRef<Socket | null>(null)
  const [sessionId] = useState(uuidv4())
  const [status, setStatus] = useState('Menghubungkan sesi...')
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [countdown, setCountdown] = useState(5)

  const pageTitle =
    props.status === 'Picked Up' ? 'Pengembalian Fasilitas' : 'Pengambilan Fasilitas'
  const actionText = props.status === 'Picked Up' ? 'Pengembalian' : 'Pengambilan'
  const successMessage =
    props.status === 'Picked Up'
      ? 'Fasilitas berhasil dikembalikan. Terima kasih telah menjaga dengan baik!'
      : 'Fasilitas berhasil diambil. Jangan lupa kembalikan tepat waktu!'

  useEffect(() => {
    const socket = io()
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to WS:', socket.id)
      setStatus('Siap untuk dipindai...')
      socket.emit('registerSession', sessionId)
    })

    socket.on('qrScanned', (data: any) => {
      switch (props.status) {
        case 'Confirmed':
          socket.emit('waitingConfirmToPickUp', { sessionId, idBooking: data.idBooking })
          break
        case 'Picked Up':
          socket.emit('waitingConfirmToReturn', { sessionId, idBooking: data.idBooking })
          break
      }
      setStatus(`Menunggu konfirmasi ${actionText} dari ${data.user}...`)
    })

    const handleBookingUpdate = async (data: any) => {
      setStatus('Memperbarui data...')
      try {
        const response = await axios.get(`/api/v1/me/booking/${data.idBooking}`, {
          withCredentials: true,
        })
        setBooking(response.data.data)
        setStatus('Sukses! ✅')
      } catch (err) {
        console.error(err)
        setStatus('❌ Gagal mengambil data booking.')
      }
    }

    socket.on('facilityPickedUp', handleBookingUpdate)
    socket.on('facilityReturned', handleBookingUpdate)

    socket.on('disconnect', () => {
      setStatus('Koneksi terputus. Mohon refresh.')
    })

    return () => {
      socket.off('facilityPickedUp', handleBookingUpdate)
      socket.off('facilityReturned', handleBookingUpdate)
      socket.disconnect()
    }
  }, [sessionId, props.status, actionText])

  useEffect(() => {
    if (booking) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = '/'
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [booking])

  const payload = JSON.stringify({ idBooking: props.idBooking, sessionId })

  let statusIcon
  let statusColor = 'text-gray-600'
  let statusBg = 'bg-gray-100'

  if (status.includes('Siap untuk dipindai')) {
    statusIcon = <QrCode className="w-6 h-6" />
    statusColor = 'text-red-600'
    statusBg = 'bg-red-50'
  } else if (status.includes('Menunggu') || status.includes('Menghubungkan')) {
    statusIcon = <Loader2 className="w-6 h-6 animate-spin" />
    statusColor = 'text-yellow-600'
    statusBg = 'bg-yellow-100'
  } else if (status.includes('Sukses')) {
    statusIcon = <CheckCircle className="w-6 h-6" />
    statusColor = 'text-green-600'
    statusBg = 'bg-green-100'
  } else if (status.includes('Gagal')) {
    statusIcon = <ArrowRightCircle className="w-6 h-6" />
    statusColor = 'text-red-600'
    statusBg = 'bg-red-100'
  } else {
    statusIcon = <QrCode className="w-6 h-6" />
    statusColor = 'text-gray-600'
    statusBg = 'bg-gray-100'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center space-x-4 h-16">
          <div className="flex-shrink-0">
            <Building className="h-8 w-8 text-red-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-bold text-gray-900">GivenTech</h1>
            <p className="text-sm text-gray-600">Facility Booking</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition duration-500 hover:scale-[1.01]">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-red-700 tracking-tight">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem Pemindaian QR Code Real-time</p>
        </header>

        {!booking ? (
          <section className="space-y-8">
            <div className="p-6 bg-red-50 rounded-xl shadow-inner">
              <div className="inline-block p-1 bg-white rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                <QRCodeToCanvas
                  value={payload}
                  size={220}
                  fgColor="#dc2626"
                  bgColor="#ffffff"
                  level="H"
                />
              </div>
            </div>

            <div
              className={`flex items-center justify-center gap-3 p-3 rounded-xl ${statusBg} transition duration-300`}
            >
              <div className={statusColor}>{statusIcon}</div>
              <p className={`font-medium ${statusColor} text-lg`}>{status}</p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Tunjukkan QR Code ini kepada Admin untuk proses {actionText}.
            </p>
          </section>
        ) : (
          /* --- Bagian Notifikasi Sukses --- */
          <section className="space-y-6">
            <div className="text-green-600 flex flex-col items-center">
              <CheckCircle className="w-16 h-16 mb-2 animate-pulse" />
              <h2 className="text-3xl font-bold">Berhasil! 🎉</h2>
            </div>

            <p className="text-gray-700 text-lg font-medium leading-relaxed">{successMessage}</p>

            <div className="p-4 bg-teal-50 border-l-4 border-teal-400 text-teal-700 rounded-lg">
              <p className="text-sm font-semibold">
                Status Booking: <span className="font-bold uppercase">{booking.status}</span>
              </p>
            </div>

            <a
              href="/"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            >
              <ArrowRightCircle className="w-5 h-5" />
              Kembali ke Dashboard ({countdown}s)
            </a>
          </section>
        )}
      </div>
    </div>
  )
}
