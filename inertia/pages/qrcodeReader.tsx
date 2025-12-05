import { useEffect, useRef, useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { io, Socket } from 'socket.io-client'
import { Camera, QrCode, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

import AdminLayout from '../layout/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

interface ScanValue {
  sessionId: string
  idBooking: number
}

export default function QRCodeReader({ user }: any) {
  const socketRef = useRef<Socket | null>(null)
  const [socketStatus, setSocketStatus] = useState('Connecting...')
  const [scanStatus, setScanStatus] = useState('Awaiting scan...')
  const [isScanning, setIsScanning] = useState(true)

  useEffect(() => {
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

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleScan = (detectedCodes: any) => {
    if (!detectedCodes || detectedCodes.length === 0) return

    setIsScanning(false)
    setScanStatus('Kode QR terdeteksi. Memproses...')

    try {
      detectedCodes.forEach((code: any) => {
        const value: ScanValue = JSON.parse(code.rawValue)

        console.log(`Value:`, value)
        socketRef.current?.emit('scanQR', {
          sessionId: value.sessionId,
          user: 'Admin',
          idBooking: value.idBooking,
        })
      })
      setScanStatus('Data terkirim. Menunggu konfirmasi...')

      setTimeout(() => {
        setIsScanning(true)
        setScanStatus('Siap memindai kode QR...')
      }, 3000)
    } catch (error) {
      console.error('Error parsing QR code value:', error)
      setScanStatus('❌ Format kode QR tidak valid. Lanjutkan memindai...')

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

  const getStatusDisplay = () => {
    let Icon, bgColor, textColor, message

    if (socketStatus !== 'Connected') {
      Icon = Loader2
      bgColor = 'bg-yellow-100'
      textColor = 'text-yellow-700'
      message = 'Menghubungkan ke Server...'
    } else if (scanStatus.includes('Memproses') || scanStatus.includes('Menunggu konfirmasi')) {
      Icon = Loader2
      bgColor = 'bg-red-100'
      textColor = 'text-red-700'
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
    } else if (isScanning) {
      Icon = QrCode
      bgColor = 'bg-green-100'
      textColor = 'text-green-700'
      message = 'Siap memindai kode QR...'
    } else {
      Icon = CheckCircle
      bgColor = 'bg-gray-100'
      textColor = 'text-gray-700'
      message = scanStatus
    }

    return (
      <div className={`p-4 rounded-xl flex items-center gap-3 ${bgColor} transition duration-300`}>
        <Icon
          className={`w-6 h-6 ${textColor} ${
            socketStatus === 'Connecting...' || scanStatus.includes('Memproses')
              ? 'animate-spin'
              : ''
          }`}
        />
        <p className={`font-medium text-sm ${textColor}`}>{message}</p>
      </div>
    )
  }

  return (
    <AdminLayout user={user} activeMenu="/qrScanner">
      <Head title="QR Scanner" />

      <div className="flex justify-center items-start pt-40 min-h-[calc(100vh-100px)]">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200">
          <header className="mb-6">
            <div className="flex justify-center mb-3">
              <Camera className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">QR Code Scanner</h1>
            <p className="text-sm text-gray-500">Pindai kode QR fasilitas/booking</p>
          </header>

          <div className="mb-6">{getStatusDisplay()}</div>

          <div className="relative w-full aspect-square mx-auto mb-6 overflow-hidden rounded-lg border-4 border-red-500/50 shadow-lg bg-gray-800">
            {isScanning && socketStatus === 'Connected' ? (
              <div className="w-full h-full">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment',
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
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4 text-white">
                <QrCode className="w-12 h-12 mb-2 animate-pulse" />
                <p className="font-semibold text-center">{scanStatus}</p>
              </div>
            )}

            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-scan-line"></div>
            )}
          </div>

          <div
            className={`text-xs p-2 rounded-lg ${socketStatus === 'Connected' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
          >
            Status Server: {socketStatus}
          </div>
        </div>

        <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          50% { transform: translateY(298px); }
          100% { transform: translateY(0); }
        }
        .animate-scan-line {
          animation: scan-line 3s infinite linear;
        }
      `}</style>
      </div>
    </AdminLayout>
  )
}
