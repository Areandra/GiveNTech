import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Building,
  MapPin,
  Package
} from 'lucide-react'

const BookingForm = ({ facilityId }: { facilityId: number }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    notes: ''
  })

  // Mock facility data - lebih umum untuk berbagai jenis fasilitas
  const facility = {
    id: facilityId,
    name: 'Ruang Meeting A',
    type: 'Ruang Pertemuan',
    location: 'Gedung Utama Lt. 3',
    description: 'Fasilitas ini tersedia untuk digunakan sesuai kebutuhan'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Submit booking logic here
      console.log('Booking submitted:', formData)
      router.visit('/booking/success')
    }
  }

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Booking Fasilitas" />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.visit(`/facilities/${facilityId}`)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Booking Fasilitas</h1>
                <p className="text-gray-600">Isi form untuk booking {facility.name}</p>
              </div>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                stepNumber === step ? 'bg-red-600 text-white' :
                stepNumber < step ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber < step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="font-bold">{stepNumber}</span>
                )}
              </div>
              <div className={`ml-2 font-medium ${
                stepNumber === step ? 'text-red-600' :
                stepNumber < step ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {stepNumber === 1 && 'Tanggal & Waktu'}
                {stepNumber === 2 && 'Detail Pesanan'}
                {stepNumber === 3 && 'Konfirmasi'}
              </div>
              {stepNumber < 3 && (
                <div className={`h-1 w-12 mx-2 ${
                  stepNumber < step ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pilih Tanggal & Waktu</h2>
              
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Tanggal Penggunaan
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Waktu Mulai
                    </label>
                    <select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih waktu mulai</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Waktu Selesai
                    </label>
                    <select
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih waktu selesai</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Facility Info Card */}
                <div className="bg-gray-50 rounded-xl p-6 border">
                  <div className="flex items-start">
                    <div className="p-3 bg-red-100 rounded-lg mr-4">
                      <Package className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{facility.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{facility.type}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {facility.location}
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Siap digunakan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Booking Details */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Peminjaman</h2>
              
              <div className="space-y-6">
                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-2" />
                    Tujuan Penggunaan
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Jelaskan tujuan penggunaan fasilitas ini"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tulis catatan khusus atau permintaan tambahan..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Ketentuan Penggunaan
                  </h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Permintaan akan diverifikasi oleh admin dalam 1x24 jam</li>
                    <li>• Batalkan peminjaman minimal 2 jam sebelum waktu mulai</li>
                    <li>• Harap gunakan fasilitas sesuai peruntukan</li>
                    <li>• Jaga dan rawat fasilitas dengan baik</li>
                    <li>• Laporkan kerusakan segera kepada petugas</li>
                    <li>• Kembalikan fasilitas dalam kondisi baik</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Konfirmasi Peminjaman</h2>
              
              <div className="space-y-8">
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Ringkasan Peminjaman</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fasilitas</span>
                      <span className="font-medium">{facility.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jenis</span>
                      <span className="font-medium">{facility.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal</span>
                      <span className="font-medium">{formData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Waktu</span>
                      <span className="font-medium">{formData.startTime} - {formData.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tujuan</span>
                      <span className="font-medium">{formData.purpose}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Status: <span className="font-medium text-yellow-600">Menunggu Verifikasi</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="border rounded-xl p-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="h-5 w-5 text-red-600 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                      Saya menyetujui ketentuan penggunaan fasilitas. Saya bertanggung jawab penuh atas fasilitas 
                      yang dipinjam dan akan mengganti kerusakan yang terjadi akibat kelalaian saya.
                    </label>
                  </div>
                </div>

                {/* Success Preview */}
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

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Kembali
              </button>
            )}
            
            <button
              type="submit"
              className={`ml-auto px-8 py-3 rounded-lg font-medium text-white transition-colors ${
                step === 3 ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {step === 3 ? 'Konfirmasi Peminjaman' : 'Lanjutkan →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm