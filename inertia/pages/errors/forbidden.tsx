import { useEffect, useState } from 'react'

const IMG =
  'https://imgs.search.brave.com/1Qn9RjKtnlnusgLLPsnU3QHGWFxZO8zDBUC0CupHskQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3RpL2dyYXRp/cy12ZWt0b3IvcDEv/MzY0NDYwLXdlYnNp/dGUtZmVobGVyLTQw/My12ZWt0b3IuanBn'

export default function Forbidden({ redirectUrl }: any) {
  const [count, setCount] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => setCount((c) => c - 1), 1000)
    if (count <= 0) window.location.href = redirectUrl
    return () => clearInterval(timer)
  }, [count])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      <div className="text-center max-w-md">
        <img src={IMG} className="w-full h-auto rounded-lg mb-6 border" />

        <h1 className="text-5xl font-extrabold text-red-500 mb-2">403</h1>
        <p className="text-xl font-semibold mb-3">Akses Ditolak</p>

        <p className="text-gray-600 mb-4">Anda tidak memiliki hak akses ke halaman ini.</p>

        <p className="font-medium mb-6">
          Mengalihkan dalam <span className="text-red-500 font-bold text-2xl">{count}</span>{' '}
          detik...
        </p>

        <a
          href={redirectUrl}
          className="px-5 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
        >
          Kembali
        </a>
      </div>
    </div>
  )
}
