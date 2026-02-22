import React, { useState, useEffect } from 'react'
import register from '.././assets/register.webp'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { registerUser, clearAuthError } from '../redux/slice/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCart } from '../redux/slice/cartSlice'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, guestId, loading, error } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'
  const isCheckoutRedirect = redirect.includes('checkout')

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId })).then(() => {
          navigate(isCheckoutRedirect ? '/checkout' : '/')
        })
      } else {
        navigate(isCheckoutRedirect ? '/checkout' : '/')
      }
    }
  }, [user, dispatch, navigate, isCheckoutRedirect, cart, guestId])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }

    dispatch(registerUser({ name, email, password }))
  }

  const displayError = localError || error

  return (
    <div className='flex'>
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'
        >
          <div className='flex justify-center mb-6'>
            <h2 className='text-xl font-medium'>Xpert Enterprises</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-2'>Create Account</h2>
          <p className='text-center mb-6 text-gray-500'>
            Fill in the details below to get started
          </p>

          {/* Error display */}
          {displayError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm'>
              {displayError}
            </div>
          )}

          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Name</label>
            <input
              value={name}
              type='text'
              onChange={(e) => setName(e.target.value)}
              className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400'
              placeholder='Enter your full name'
              required
              autoComplete='name'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
              value={email}
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400'
              placeholder='Enter your email address'
              required
              autoComplete='email'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400'
              placeholder='Min 6 characters'
              required
              autoComplete='new-password'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400'
              placeholder='Re-enter your password'
              required
              autoComplete='new-password'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='cursor-pointer w-full bg-black text-white p-2 rounded-lg font-semibold
                       hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className='mt-6 text-center text-sm'>
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className='text-blue-500 hover:underline'
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className='hidden md:block w-1/2 bg-gray-800'>
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={register}
            alt='Register Account'
            className='h-[750px] w-full object-cover'
          />
        </div>
      </div>
    </div>
  )
}

export default Register
