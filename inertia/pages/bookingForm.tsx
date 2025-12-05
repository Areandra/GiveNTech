import React, { useState, useMemo } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import {
  Calendar,
  Clock,
  Building,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MapPin,
  Package,
} from 'lucide-react'

import axios from 'axios'

interface Room {
  id: number
  roomName: string
  longitude: string
  latitude: string
  createdAt: string
  updatedAt: string
}

interface Facility {
  id: number
  name: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
}

interface BookingFormProps {
  facility: Facility
  rooms: Room[]
}

const BookingForm = ({ facility, rooms }: BookingFormProps) => {
  const { data, setData, processing, errors } = useForm({
    idFacility: facility?.id,
    idRoom: '',
    bookingDate: '',
    purpose: '',
    notes: '',
  })

  const [step, setStep] = useState(1)

  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id.toString() === data.idRoom)
  }, [data.idRoom, rooms])

  const itemDetail = {
    id: facility.id,
    name: facility.name,
    type: facility.type,
    status: facility.status,
    location: selectedRoom ? selectedRoom.roomName : 'Tentukan Ruangan',
  }

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ]

  const displayDate = data.bookingDate ? data.bookingDate.split('T')[0] : ''
  const displayTime = data.bookingDate ? data.bookingDate.split('T')[1].substring(0, 5) : ''

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value

    if (data.bookingDate && data.bookingDate.includes('T')) {
      const currentTime = data.bookingDate.split('T')[1]
      setData('bookingDate', `${newDate}T${currentTime}`)
    } else {
      setData('bookingDate', `${newDate}T`)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = e.target.value

    if (data.bookingDate && data.bookingDate.includes('T')) {
      const currentDate = data.bookingDate.split('T')[0]
      setData('bookingDate', `${currentDate}T${newTime}:00`)
    } else {
      alert('Pilih tanggal terlebih dahulu.')
      setData('bookingDate', '')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (!data.idRoom || !data.bookingDate) {
        alert('Mohon lengkapi Ruangan dan Waktu Booking.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!data.purpose) {
        alert('Mohon isi Tujuan Penggunaan.')
        return
      }
      setStep(3)
    } else if (step === 3) {
      console.log(data)
      axios
        .post('/api/v1/me/booking', data, { withCredentials: true })
        .then(() => router.visit('/dashboard'))
      // post('/api/v1/me/booking', {
      //   onSuccess: () => console.error('Submission Error:'),
      //   onError: (e) => console.error('Submission Error:', e),
      // })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Peminjaman Fasilitas" />

      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.visit(`/user/dashboard`)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Peminjaman Barang</h1>
                <p className="text-gray-600">
                  Isi form untuk meminjam {itemDetail.name} ({itemDetail.type})
                </p>
              </div>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  stepNumber === step
                    ? 'bg-red-600 text-white'
                    : stepNumber < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber < step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="font-bold">{stepNumber}</span>
                )}
              </div>
              <div
                className={`ml-2 font-medium ${
                  stepNumber === step
                    ? 'text-red-600'
                    : stepNumber < step
                      ? 'text-green-600'
                      : 'text-gray-500'
                }`}
              >
                {stepNumber === 1 && 'Lokasi & Waktu'}
                {stepNumber === 2 && 'Detail Peminjaman'}
                {stepNumber === 3 && 'Konfirmasi'}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`h-1 w-12 mx-2 ${stepNumber < step ? 'bg-green-500' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tentukan Lokasi & Waktu Peminjaman
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline h-4 w-4 mr-2" />
                    Pilih Ruangan Penggunaan
                  </label>
                  <select
                    name="idRoom"
                    value={data.idRoom}
                    onChange={(e) => setData('idRoom', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih ruangan</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.roomName}
                      </option>
                    ))}
                  </select>
                  {errors.idRoom && <p className="mt-1 text-sm text-red-600">{errors.idRoom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Tanggal Peminjaman
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={displayDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-2" />
                    Waktu Peminjaman
                  </label>
                  <select
                    name="startTime"
                    value={displayTime}
                    onChange={handleTimeChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih waktu peminjaman</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.bookingDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.bookingDate}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border">
                  <div className="flex items-start">
                    <div className="p-3 bg-red-100 rounded-lg mr-4">
                      <Package className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{itemDetail.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">Jenis: {itemDetail.type}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        Lokasi Penggunaan: {itemDetail.location}
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                          Status: {itemDetail.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Peminjaman</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-2" />
                    Tujuan Penggunaan
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={data.purpose}
                    onChange={(e) => setData('purpose', e.target.value)}
                    placeholder="Jelaskan tujuan penggunaan barang ini"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={4}
                    placeholder="Tulis catatan khusus atau permintaan tambahan..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Ketentuan Peminjaman
                  </h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Permintaan akan diverifikasi oleh admin dalam 1x24 jam</li>
                    <li>• Batalkan peminjaman minimal 2 jam sebelum waktu mulai</li>
                    <li>• Jaga dan rawat barang dengan baik</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Konfirmasi Peminjaman</h2>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Ringkasan Peminjaman</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Barang</span>
                      <span className="font-medium">{itemDetail.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lokasi Penggunaan</span>
                      <span className="font-medium">{itemDetail.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal</span>
                      <span className="font-medium">{displayDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Waktu Peminjaman</span>
                      <span className="font-medium">{displayTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tujuan</span>
                      <span className="font-medium">{data.purpose}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Status:{' '}
                        <span className="font-medium text-yellow-600">Menunggu Verifikasi</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="h-5 w-5 text-red-600 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                      Saya menyetujui ketentuan penggunaan fasilitas.
                    </label>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-bold text-green-900">Permintaan Siap Dikirim!</h4>
                      <p className="text-green-800 text-sm">
                        Setelah dikirim, permintaan Anda akan menunggu verifikasi admin
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                disabled={processing}
              >
                Kembali
              </button>
            )}

            <button
              type="submit"
              className={`ml-auto px-8 py-3 rounded-lg font-medium text-white transition-colors ${
                step === 3 ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={processing}
            >
              {step === 3 ? (processing ? 'Mengirim...' : 'Konfirmasi Peminjaman') : 'Lanjutkan →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
