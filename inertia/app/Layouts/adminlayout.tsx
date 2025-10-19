import React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <nav style={{ background: '#7c3aed', color: 'white', padding: '1rem' }}>
                <strong>⚙️ Dashboard Admin</strong>
            </nav>
            <main style={{ padding: '1.5rem' }}>
                {children}
            </main>
        </div>
    )
}
