// resources/js/Pages/Auth/Register.tsx
import React, { useEffect, FormEventHandler } from 'react'
import GuestLayout from '#layout/GuestLayout'
import { Head, useForm, Link } from '@inertiajs/react'
// import InputError from '@/Components/InputError';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation')
    }
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    // Route POST ke backend Adonis untuk proses registrasi
    post('register')
  }

  return (
    <GuestLayout>
      <Head title="Register" />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Join Realnest Today!</h2>
        <p className="text-gray-600 mt-2">Create your new account</p>
      </div>

      <form onSubmit={submit}>
        {/* Input Nama */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={data.name}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            autoComplete="name"
            onChange={(e) => setData('name', e.target.value)}
          />
          {/* {errors.name && <InputError message={errors.name} />} */}
        </div>

        {/* Input Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
          />
          {/* {errors.email && <InputError message={errors.email} />} */}
        </div>

        {/* Input Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
          />
          {/* {errors.password && <InputError message={errors.password} />} */}
        </div>

        {/* Input Konfirmasi Password */}
        <div className="mb-6">
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
          />
          {/* {errors.password_confirmation && <InputError message={errors.password_confirmation} />} */}
        </div>

        {/* Tombol Register */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          disabled={processing}
        >
          Register
        </button>
      </form>

      {/* Link Login */}
      <div className="mt-6 text-center text-sm">
        <p>
          Already have an account?{' '}
          <Link href={'/login'} className="font-semibold text-indigo-600 hover:text-indigo-900">
            Log in
          </Link>
        </p>
      </div>
    </GuestLayout>
  )
}
