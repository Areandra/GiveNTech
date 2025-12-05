// types.ts

import { DateTime } from 'luxon'

export interface User {
  id: number
  username: string
  email: string
  password: string | null
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export interface Approver {
  id: number
  username: string
  email: string
  password: string | null
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Picked Up'
  | 'Returned'
  | 'Cancelled'
  | 'Penalized'
  | 'Done'

export interface Facility {
  id: number
  name: string
  type: string
  createdAt: string
  updatedAt: string
  status: 'Available' | 'Booked' | 'Maintenance' | 'Damaged'
}

export interface Room {
  id: number
  roomName: string
  longitude: number
  latitude: number
  createdAt: DateTime
  updatedAt: DateTime
}

export interface Booking {
  id: number
  idUser: number
  idApprover: number | null
  idFacility: number
  idRoom: number | null
  bookingDate: string
  returnDate: string | null
  status: BookingStatus
  createdAt: string
  updatedAt: string | null
  user: User
  fasilitas: Facility
  rooms: Room | null
  approver: Approver | null
}

export interface MenuItem {
  icon: any
  label: string
  active?: boolean
  href: string
}
