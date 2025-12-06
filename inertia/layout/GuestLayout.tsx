// resources/js/Layouts/GuestLayout.tsx

import { Link } from '@inertiajs/react'
import { Building, ShieldCheck, Sparkles } from 'lucide-react'
import { PropsWithChildren } from 'react'

interface GuestLayoutProps extends PropsWithChildren {}

export default function GuestLayout({ children }: PropsWithChildren) {
  return (
    // Kontainer Utama: Memastikan mengisi 100% tinggi dan lebar viewport
    <div className="h-screen flex flex-col lg:flex-row bg-white"> 
        
        {/* Kolom Kiri: Branding & Info (2/5 lebar di layar besar) */}
        <div className="lg:w-2/5 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white p-12 relative overflow-hidden flex-shrink-0">
          
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Konten Atas: Logo & Hero Content */}
            <div>
              {/* Logo & Brand */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Building className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">GivenTech</h1>
                  <p className="text-red-100 text-sm">Facility Management</p>
                </div>
              </div>

              {/* Hero Content */}
              <div className="mt-10 lg:mt-16">
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                  Join Our Smart{' '}
                  <span className="text-yellow-300">Facility</span> Platform
                </h2>
                <p className="text-red-100 text-lg mb-8">
                  Manage and book facilities with ease. Get started in minutes!
                </p>

                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span>Secure & Reliable Platform</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span>Easy Facility Booking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Building className="w-5 h-5" />
                    </div>
                    <span>Real-time Availability</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info (Sign In Link) - BAGIAN INI DIHILANGKAN */}
            {/*
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-red-100 text-sm">
                Already managing with us?{' '}
                <Link
                  href="/login"
                  className="text-yellow-300 font-semibold hover:text-yellow-200 underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            */}
          </div>
        </div>

        {/* Kolom Kanan: Form Konten (3/5 lebar di layar besar) */}
        <div className="lg:w-3/5 bg-white p-8 lg:p-12 flex items-center justify-center flex-grow overflow-y-auto">
          <div className="w-full max-w-md">
            {children} {/* Konten Register/Login masuk di sini */}
          </div>
        </div>
    </div>
  )
}