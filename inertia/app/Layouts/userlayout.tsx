import React from 'react'

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <nav style={{ background: '#2563eb', color: 'white', padding: '1rem' }}>
                <strong>🏠 Dashboard User</strong>
            </nav>
            <main style={{ padding: '1.5rem' }}>
                {children}
            </main>
        </div>
    )
}
