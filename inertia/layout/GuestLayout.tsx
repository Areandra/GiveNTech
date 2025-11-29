// resources/js/Layouts/GuestLayout.tsx
import { Link } from 'lucide-react'
import { PropsWithChildren } from 'react'

// Tipe untuk props anak-anak yang akan dirender di dalam layout
interface GuestLayoutProps extends PropsWithChildren {}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Kolom Kiri: Gambar dan Teks Promosi */}
      <div
        className="hidden lg:block w-1/2 relative bg-cover bg-center"
        style={{
          // Gunakan URL gambar dari CDN atau assets lokal
          backgroundImage: 'url(https://imgs.search.brave.com/1_I9tcjgdGw8IZ2pRQsnYVxiqXVwjLr5FgZf78GBpxc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMua29tcGFzaWFu/YS5jb20vaXRlbXMv/YWxidW0vMjAyNS8w/MS8yMS9nZXJiYW5n/LXVudGFkLTY3OGU4/NTQxMzQ3NzdjMDJk/YzRkODI3Mi5qcGc_/dD1vJnY9Nzcw)',
        }}
      >
        {/* Overlay dan Konten Promosi */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-12">
          <h1 className="text-white text-5xl font-bold mb-4 leading-tight">Peminjaman barang untad</h1>
          <p className="text-white text-lg">
            Booking barang yang kamu butuhkan <br />
            Ambil barang hanya dengan scan barcode
          </p>
          {/* Anda bisa menambahkan elemen navigasi/dots di sini jika diperlukan */}
        </div>
      </div>

      {/* Kolom Kanan: Form Konten */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo/Nama Aplikasi */}
          <div className="flex justify-end mb-8">
            {/* Contoh: Tautan Sign In di kanan atas */}
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
              Sign in
            </Link>
          </div>

          {/* Konten Halaman Login/Register akan masuk di sini */}
          {children}
        </div>
      </div>
    </div>
  )
}
