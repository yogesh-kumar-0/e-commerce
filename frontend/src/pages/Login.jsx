import React, { useState, useEffect } from 'react'
import login from '.././assets/login.webp'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser, clearAuthError } from '../redux/slice/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCart } from '../redux/slice/cartSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    dispatch(loginUser({ email, password }))
  }

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
          <h2 className='text-2xl font-bold text-center mb-2'>Welcome Back!</h2>
          <p className='text-center mb-6 text-gray-500'>
            Enter your email and password to sign in
          </p>

          {/* Error display */}
          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm'>
              {error}
            </div>
          )}

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
              placeholder='Enter your password'
              required
              autoComplete='current-password'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800
                       transition disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className='mt-6 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className='text-blue-500 hover:underline'
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className='hidden md:block w-1/2 bg-gray-800'>
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={login}
            alt='Login To Account'
            className='h-[750px] w-full object-cover'
          />
        </div>
      </div>
    </div>
  )
}

export default Login
