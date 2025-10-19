import { useEffect, useState } from "react";


export default function Dashboard(prop : { booking: any[]}) {
    return (
        <div>
            <h1>⚙️ Admin Dashboard</h1>
            <p>Welcome to the admin dashboard!</p>
            {prop.booking?.map((data:any) => {
                return (<div key={data.id}>
                    <p>Booking ID: {data.id}, User ID: {data.id_user}, Facility ID: {data.id_fasilitas}, Room No: {data.no_ruang}, Status: {data.status}</p>
                </div>)
            } )}
        </div>
    )
}

