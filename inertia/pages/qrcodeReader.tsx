import { useEffect, useRef, useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { io, Socket } from 'socket.io-client'
import { Camera, QrCode, Loader2, CheckCircle, AlertTriangle } from 'lucide-react' // Import ikon dari lucide-react
import AuthenticatedLayout from '#layout/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

// Pastikan Anda telah menginstal @yudiel/react-qr-scanner dan lucide-react

export default function QRCodeReader() {
  const socketRef = useRef<Socket | null>(null)
  const [socketStatus, setSocketStatus] = useState('Connecting...') // Status koneksi WS
  const [scanStatus, setScanStatus] = useState('Awaiting scan...') // Status hasil scan
  const [isScanning, setIsScanning] = useState(true) // Untuk kontrol Scanner

  useEffect(() => {
    // 1. Inisialisasi Socket.IO
    const socket = io()
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Scanner WS connected:', socket.id)
      setSocketStatus('Connected')
      setScanStatus('Siap memindai kode QR...')
    })

    socket.on('disconnect', () => {
      console.log('Scanner WS disconnected')
      setSocketStatus('Disconnected')
      setScanStatus('Koneksi terputus. Mohon periksa jaringan.')
      setIsScanning(false)
    })

    // 2. Cleanup function
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleScan = (detectedCodes: any) => {
    if (!detectedCodes || detectedCodes.length === 0) return

    // Hentikan pemindaian sementara setelah kode terdeteksi
    setIsScanning(false)
    setScanStatus('Kode QR terdeteksi. Memproses...')

    try {
      detectedCodes.forEach((code: any) => {
        const value = JSON.parse(code.rawValue)

        // Log & kirim data
        console.log(`Format: ${code.format}, Value: ${value}`)
        socketRef.current?.emit('scanQR', {
          sessionId: value.sessionId,
          user: 'Admin', // User yang memindai
          idBooking: value.idBooking,
        })
      })
      setScanStatus('Data terkirim. Menunggu konfirmasi...')

      // Setelah beberapa detik, kembalikan status scan agar bisa memindai lagi
      setTimeout(() => {
        setIsScanning(true)
        setScanStatus('Siap memindai kode QR...')
      }, 3000)
    } catch (error) {
      console.error('Error parsing QR code value:', error)
      setScanStatus('❌ Format kode QR tidak valid.')

      // Lanjutkan scanning setelah error
      setTimeout(() => {
        setIsScanning(true)
        setScanStatus('Siap memindai kode QR...')
      }, 3000)
    }
  }

  const handleError = (error: any) => {
    console.error(error)
    if (error.name === 'NotAllowedError' || error.name === 'NotFoundError') {
      setScanStatus('❌ Gagal akses kamera. Pastikan izin telah diberikan.')
      setIsScanning(false)
    }
  }

  // Tentukan ikon dan styling berdasarkan status
  const getStatusDisplay = () => {
    let Icon, bgColor, textColor, message

    if (socketStatus !== 'Connected') {
      Icon = Loader2
      bgColor = 'bg-yellow-100'
      textColor = 'text-yellow-700'
      message = 'Menghubungkan ke Server...'
    } else if (!isScanning) {
      Icon = CheckCircle
      bgColor = 'bg-indigo-100'
      textColor = 'text-indigo-700'
      message = scanStatus
    } else if (
      scanStatus.includes('Gagal akses') ||
      scanStatus.includes('Koneksi terputus') ||
      scanStatus.includes('tidak valid')
    ) {
      Icon = AlertTriangle
      bgColor = 'bg-red-100'
      textColor = 'text-red-700'
      message = scanStatus
    } else {
      Icon = QrCode
      bgColor = 'bg-green-100'
      textColor = 'text-green-700'
      message = scanStatus
    }

    return (
      <div className={`p-4 rounded-xl flex items-center gap-3 ${bgColor} transition duration-300`}>
        <Icon
          className={`w-6 h-6 ${textColor} ${socketStatus === 'Connecting...' || scanStatus.includes('Memproses') ? 'animate-spin' : ''}`}
        />
        <p className={`font-medium text-sm ${textColor}`}>{message}</p>
      </div>
    )
  }

  return (
    <AuthenticatedLayout>
      <Head title="QR Scanner" />
      <div className="flex justify-center items-center h-full m--16">
        {' '}
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
          <header className="mb-6">
            <div className="flex justify-center mb-3">
              <Camera className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">QR Code Scanner</h1>
            <p className="text-sm text-gray-500">Pindai kode QR fasilitas/booking</p>
          </header>

          {/* Status Display */}
          <div className="mb-6">{getStatusDisplay()}</div>

          {/* Area Scanner */}
          <div className="relative w-full aspect-square mx-auto mb-6 overflow-hidden rounded-lg border-4 border-indigo-500/50 shadow-lg bg-gray-800">
            {isScanning && socketStatus === 'Connected' ? (
              // Scanner component
              <div className="w-full h-full">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment', // Prioritaskan kamera belakang
                  }}
                  styles={{
                    container: {
                      width: '100%',
                      height: '100%',
                      padding: 0,
                      overflow: 'hidden',
                    },
                    video: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    },
                    // Tambahkan style untuk highlight area scan jika library mendukung
                  }}
                />
              </div>
            ) : (
              // Placeholder saat tidak memindai
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4 text-white">
                <QrCode className="w-12 h-12 mb-2 animate-pulse" />
                <p className="font-semibold text-center">{scanStatus}</p>
              </div>
            )}

            {/* Animasi Garis Pemindaian */}
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-scan-line"></div>
            )}
          </div>

          {/* Status Koneksi Socket */}
          <div
            className={`text-xs p-2 rounded-lg ${socketStatus === 'Connected' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'}`}
          >
            Status Server: {socketStatus}
          </div>
        </div>
        {/* Definisi Keyframes untuk animasi Garis Pemindaian (Opsional: Butuh konfigurasi Tailwind) */}
        <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          50% { transform: translateY(298px); } /* Sesuaikan dengan tinggi area scanner */
          100% { transform: translateY(0); }
        }
        .animate-scan-line {
          animation: scan-line 3s infinite linear;
        }
      `}</style>
      </div>
    </AuthenticatedLayout>
  )
}
