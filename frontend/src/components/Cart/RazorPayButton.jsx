import React, { useEffect, useState } from 'react'
import axios from 'axios'

const RazorPayButton = ({ amount, onSuccess, onError, user }) => {
  const [loading, setLoading] = useState(false)
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Create order from backend
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/razorpay/create-order`,
        {
          amount: Math.round(amount * 100), // Amount in paise
          currency: 'INR',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      )

      const { id: orderId, amount: orderAmount } = orderResponse.data

      // Razorpay Options
      const options = {
        key: razorpayKeyId,
        amount: orderAmount,
        currency: 'INR',
        name: 'Commerce Store',
        description: 'Order Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment from backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/razorpay/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                },
              }
            )

            // Call onSuccess with payment details
            onSuccess({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              status: 'succeeded',
            })
          } catch (error) {
            console.error('Payment verification failed:', error)
            onError('Payment verification failed')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#000000',
        },
      }

      // Create and open Razorpay Checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()

      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        onError('Payment failed: ' + response.error.description)
      })
    } catch (error) {
      console.error('Error creating payment order:', error)
      onError('Failed to create payment order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition'
    >
      {loading ? 'Processing...' : 'Pay with Razorpay'}
    </button>
  )
}

export default RazorPayButton
