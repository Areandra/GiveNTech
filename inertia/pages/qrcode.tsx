import { useEffect, useState, useRef } from 'react'
import QRCodeToCanvas from '#components/QRCodeToCanvas'
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
// import iconHandover from '../assets/handover.jpg' // Ganti nama variabel icon
import { router } from '@inertiajs/react'
import { QrCode, Loader2, CheckCircle, ArrowRightCircle } from 'lucide-react' // Import ikon dari lucide-react (perlu diinstal)

// Pastikan Anda telah menginstal lucide-react: npm install lucide-react

interface BookingData {
  id: number
  status: string
}

export default function QRCodePage(props: any) {
  const socketRef = useRef<Socket | null>(null)
  const [sessionId] = useState(uuidv4())
  // Sesuaikan status awal agar lebih menarik
  const [status, setStatus] = useState('Menghubungkan sesi...')
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [countdown, setCountdown] = useState(5)

  // Tentukan judul berdasarkan status props
  const pageTitle =
    props.status === 'Picked Up' ? 'Pengembalian Fasilitas' : 'Pengambilan Fasilitas'
  const actionText = props.status === 'Picked Up' ? 'Pengembalian' : 'Pengambilan'
  const successMessage =
    props.status === 'Picked Up'
      ? 'Fasilitas berhasil dikembalikan. Terima kasih telah menjaga dengan baik!'
      : 'Fasilitas berhasil diambil. Jangan lupa kembalikan tepat waktu!'

  useEffect(() => {
    // Gunakan URL yang lebih spesifik jika diperlukan, atau biarkan kosong untuk default
    const socket = io()
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to WS:', socket.id)
      setStatus('Siap untuk dipindai...')
      socket.emit('registerSession', sessionId)
    })

    socket.on('qrScanned', (data: any) => {
      switch (props.status) {
        case 'Pending':
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
        const response = await axios.get(`/api/v1/booking/${data.idBooking}`, {
          headers: {
            // Sebaiknya token ini disimpan di environment variable, bukan hardcode di frontend.
            Authorization:
              'Bearer oat_MQ.XzJZRV8taFVTdXhScU1IY2NNTkQ4cHJDcl9Cd3diNkp6NVpvN0hvTDI5NDAwMjkxMDk',
          },
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
  }, [sessionId, props.status, actionText]) // Tambahkan props.status dan actionText ke dependencies

  // Countdown redirect ke dashboard menggunakan Inertia router
  useEffect(() => {
    if (booking) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Redirect ke halaman yang sesuai
            router.get('/redirect/home')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [booking])

  const payload = JSON.stringify({ idBooking: props.idBooking, sessionId })

  // Tentukan ikon status
  let statusIcon
  let statusColor = 'text-gray-600'
  if (status.includes('Siap untuk dipindai')) {
    statusIcon = <QrCode className="w-6 h-6" />
  } else if (status.includes('Menunggu') || status.includes('Menghubungkan')) {
    statusIcon = <Loader2 className="w-6 h-6 animate-spin" />
    statusColor = 'text-blue-500'
  } else if (status.includes('Sukses')) {
    statusIcon = <CheckCircle className="w-6 h-6" />
    statusColor = 'text-green-500'
  } else if (status.includes('Gagal')) {
    statusIcon = <ArrowRightCircle className="w-6 h-6" />
    statusColor = 'text-red-500'
  } else {
    statusIcon = <QrCode className="w-6 h-6" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center transform transition duration-500 hover:scale-[1.02]">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem Pemindaian QR Code Real-time</p>
        </header>

        {/* --- Bagian Utama: QR Code atau Sukses --- */}
        {!booking ? (
          <section className="space-y-8">
            <div className="p-4 bg-indigo-50 rounded-lg shadow-inner">
              <div className="inline-block p-1 bg-white rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                {/* Component untuk menampilkan QR Code */}
                <QRCodeToCanvas
                  value={payload}
                  size={220}
                  fgColor="#4f46e5"
                  bgColor="#ffffff"
                  level="H"
                />
              </div>
            </div>

            <div
              className={`flex items-center justify-center gap-3 p-3 rounded-xl ${status.includes('Sukses') ? 'bg-green-100' : status.includes('Gagal') ? 'bg-red-100' : 'bg-gray-100'} transition duration-300`}
            >
              <div className={statusColor}>{statusIcon}</div>
              <p className={`font-medium ${statusColor} text-lg`}>{status}</p>
            </div>
          </section>
        ) : (
          /* --- Bagian Notifikasi Sukses --- */
          <section className="space-y-6">
            <div className="text-green-600 flex flex-col items-center">
              <CheckCircle className="w-16 h-16 mb-2 animate-bounce" />
              <h2 className="text-3xl font-bold">Berhasil! 🎉</h2>
            </div>

            <p className="text-gray-700 text-lg font-medium leading-relaxed">{successMessage}</p>

            {/* Tampilkan detail status booking (opsional, jika perlu) */}
            <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-lg">
              <p className="text-sm font-semibold">
                Status Booking: <span className="font-bold uppercase">{booking.status}</span>
              </p>
            </div>

            {/* Tombol dengan hitungan mundur */}
            <button
              onClick={() => router.get('/redirect/home')}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              <ArrowRightCircle className="w-5 h-5" />
              Kembali ke Dashboard ({countdown}s)
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
