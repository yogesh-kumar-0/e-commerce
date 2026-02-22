import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'
import { formattedRupee } from '../../script'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../redux/slice/cartSlice'

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      )
    }
  }

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(
      removeFromCart({
        productId,
        guestId,
        userId,
        size,
        color,
      })
    )
  }

  return (
    <div>
      {cart.products.map((product, index) => (
        <div key={index} className='flex items-start justify-between py-4 border-b'>
          <div className='flex items-start'>
            <img
              src={product.image}
              alt={product.name}
              className='w-20 h-24 object-cover rounded'
            />
            <div className='ml-4'>
              <h3 className='font-medium text-sm'>{product.name}</h3>
              <p className='text-xs text-gray-500 mt-1'>
                Size: {product.size} | Color: {product.color}
              </p>
              <div className='flex items-center mt-2 space-x-2'>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className='border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100
                             transition-colors'
                >
                  -
                </button>
                <span className='mx-2 text-sm font-medium'>{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className='border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100
                             transition-colors'
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end'>
            <p className='font-medium text-sm'>{formattedRupee(product.price * product.quantity)}</p>
            <p className='text-xs text-gray-400 mt-0.5'>{formattedRupee(product.price)} each</p>
            <button
              onClick={() =>
                handleRemoveFromCart(product.productId, product.size, product.color)
              }
              className='mt-2 text-red-500 hover:text-red-700 transition-colors'
              title='Remove from cart'
            >
              <RiDeleteBin3Line className='h-5 w-5' />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartContents
