// resources/js/Pages/Facility/AllFacility.tsx

import React, { useState, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '#layout/AuthenticatedLayout'
import { Search, Plus, EllipsisVertical, Package } from 'lucide-react'
import axios from 'axios'

// --- Tipe Data ---
interface Facility {
  id: number
  name: string
  type: string
  status: 'Available' | 'Booked' | 'Borrowed' | 'Under Inspection' | 'Maintenance' | 'Damaged'
  createdAt: string
  updatedAt: string
}

// --- Komponen Performance Bar ---
const PerformanceBar: React.FC<{ status: Facility['status'] }> = ({ status }) => {
  const map = {
    'Available': { label: 'Good', color: 'bg-green-500', width: '70%' },
    'Booked': { label: 'Booked', color: 'bg-blue-500', width: '50%' },
    'Borrowed': { label: 'Borrowed', color: 'bg-indigo-500', width: '40%' },
    'Under Inspection': { label: 'Inspection', color: 'bg-yellow-500', width: '35%' },
    'Maintenance': { label: 'Maintenance', color: 'bg-orange-500', width: '30%' },
    'Damaged': { label: 'Damaged', color: 'bg-red-500', width: '20%' },
  }
  const info = map[status]
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">{info.label}</span>
      <div className="w-16 h-2 bg-gray-200 rounded-full">
        <div className={`h-full rounded-full ${info.color}`} style={{ width: info.width }} />
      </div>
    </div>
  )
}

// --- Badge Status ---
const StatusBadge: React.FC<{ status: Facility['status'] }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    'Available': 'bg-green-100 text-green-800',
    'Booked': 'bg-blue-100 text-blue-800',
    'Borrowed': 'bg-indigo-100 text-indigo-800',
    'Under Inspection': 'bg-yellow-100 text-yellow-800',
    'Maintenance': 'bg-orange-100 text-orange-800',
    'Damaged': 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${colorMap[status]}`}>
      {status}
    </span>
  )
}

// --- Row Facility ---
const FacilityRow: React.FC<{ facility: Facility }> = ({ facility }) => (
  <div className="flex items-center py-4 px-6 hover:bg-gray-50 border-b last:border-none">
    <div className="flex items-center w-1/4">
      <Package className="w-12 h-12 text-gray-400 p-2 border rounded mr-4" />
      <div>
        <p className="font-medium text-gray-800">{facility.name}</p>
        <p className="text-xs text-gray-500">Type: {facility.type}</p>
      </div>
    </div>

    <div className="w-1/4">
      <PerformanceBar status={facility.status} />
    </div>

    <div className="w-1/6 text-center">
      <p className="text-xs text-gray-500">Created</p>
      <p className="font-medium text-gray-800">
        {new Date(facility.createdAt).toISOString().split('T')[0]}
      </p>
    </div>

    <div className="w-1/6 text-center">
      <p className="text-xs text-gray-500">Asset Type</p>
      <p className="font-medium text-gray-800">{facility.type}</p>
    </div>

    <div className="w-1/6 flex justify-center">
      <StatusBadge status={facility.status} />
    </div>

    <div className="w-auto flex justify-end">
      <button className="p-1 text-gray-500 hover:text-gray-900">
        <EllipsisVertical className="w-5 h-5" />
      </button>
    </div>
  </div>
)

// --- PAGE UTAMA ---
export default function AllFacility() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get('/api/v1/facility', {
          withCredentials: true,
        })
        console.warn(response.data.data.data)
        setFacilities(response.data.data.data)
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [])

  let content
  if (loading) content = <div className="p-8 text-center text-gray-500">Loading facilities...</div>
  else if (error) content = <div className="p-8 text-center text-red-500 font-medium">{error}</div>
  else if (facilities.length === 0)
    content = <div className="p-8 text-center text-gray-500">No facility data available.</div>
  else content = facilities.map((f) => <FacilityRow key={f.id} facility={f} />)

  return (
    <AuthenticatedLayout>
      <Head title="All Facility" />

      {/* Header */}
      <div className="p-6 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Facility List</h1>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Facility..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <Link
            href="/facility/create"
            className="flex items-center bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700 font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Facility
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">{content}</div>
    </AuthenticatedLayout>
  )
}
