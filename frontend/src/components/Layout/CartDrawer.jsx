import React from 'react'
import { IoMdClose } from 'react-icons/io'
import CartContents from '../Cart/CartContents'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate()
  const { user, guestId } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  // Support both { user: { _id } } and flat { _id } shapes
  const userId = user?.user?._id || user?._id || null

  const handleCheckout = () => {
    toggleCartDrawer()
    if (!user) {
      navigate('/login?redirect=checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg
                  transform transition-transform duration-300 flex flex-col z-50
                  ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className='flex justify-between items-center p-4 border-b'>
        <h2 className='text-xl font-semibold'>Your Cart</h2>
        <button onClick={toggleCartDrawer}>
          <IoMdClose className='h-6 w-6 text-gray-600 hover:text-black transition-colors' />
        </button>
      </div>

      {/* Cart content */}
      <div className='flex-grow p-4 overflow-y-auto'>
        {cart && cart?.products?.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <p className='text-lg'>Your cart is empty</p>
            <p className='text-sm mt-1'>Add some items to get started</p>
          </div>
        )}
      </div>

      {/* Checkout button */}
      <div className='p-4 bg-white sticky bottom-0 border-t'>
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800
                         transition-colors duration-300 font-medium'
            >
              Proceed to Checkout
            </button>
            <p className='text-xs tracking-tight text-gray-500 text-center mt-2'>
              Shipping, taxes and discounts calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
