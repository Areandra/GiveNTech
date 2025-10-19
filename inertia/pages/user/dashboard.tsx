import React, { useEffect, useState } from 'react'
import UserLayout from '../../app/Layouts/userlayout'

interface Booking {
    id: number
    id_user: number
    id_fasilitas: number
    no_ruang: string
    status: string
}

export default function Dashboard() {
    const [bookings, setBookings] = useState<Booking[]>([])

    useEffect(() => {
        fetch('/bookings')
            .then((res) => res.json())
            .then((data) => setBookings(data.data))
    }, [])

    return (
        <UserLayout>
            <h1>📋 Daftar Peminjaman</h1>
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID User</th>
                        <th>ID Fasilitas</th>
                        <th>No Ruang</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.id_user}</td>
                            <td>{b.id_fasilitas}</td>
                            <td>{b.no_ruang}</td>
                            <td>{b.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </UserLayout>
    )
}
