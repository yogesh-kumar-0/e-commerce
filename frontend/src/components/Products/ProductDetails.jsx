import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProductGrid from './ProductGrid'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slice/productSlice'
import { addToCart } from '../../redux/slice/cartSlice'
import { formattedRupee } from '../../script'

// Map color names to actual CSS colors for display
const COLOR_MAP = {
  red: '#e53e3e', blue: '#3182ce', black: '#1a202c', yellow: '#d69e2e',
  green: '#38a169', white: '#e2e8f0', pink: '#ed64a6', navy: '#2c5282',
  grey: '#718096', gray: '#718096', orange: '#dd6b20', purple: '#805ad5',
  brown: '#92400e', beige: '#d4b896',
}

const ProductDetails = ({ productId }) => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selectedProduct, similarProducts, loading, error } = useSelector(
    (state) => state.products
  )
  const { guestId, user } = useSelector((state) => state.auth)

  const [mainImage, setMainImage] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const productFetchId = productId || id

  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1)
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1)
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and color before adding to cart.', { duration: 1500 })
      return
    }
    setIsButtonDisabled(true)
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?.user?._id || user?._id,
      })
    )
      .then(() => {
        toast.success('Product added to cart successfully!', { duration: 1000 })
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to add to cart', { duration: 1000 })
      })
      .finally(() => {
        setIsButtonDisabled(false)
      })
  }

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId))
      dispatch(fetchSimilarProducts({ id: productFetchId }))
    }
  }, [dispatch, productFetchId])

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url)
    }
  }, [selectedProduct])

  if (loading) return <p className='text-center py-10'>Loading...</p>
  if (error) return <p className='text-center py-10 text-red-500'>Error: {error}</p>

  return (
    <div className='p-6'>
      {selectedProduct && (
        <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>
          <div className='flex flex-col md:flex-row'>
            {/* Left thumbnails — desktop */}
            <div className='hidden md:flex flex-col space-y-4 mr-6'>
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `thumbnail ${index}`}
                  onClick={() => setMainImage(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    mainImage === image.url
                      ? 'border-black'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Main image */}
            <div className='md:w-1/2'>
              <div className='mb-4'>
                {mainImage && (
                  <img
                    src={mainImage}
                    alt='Main Product'
                    className='w-full h-auto object-cover rounded-lg'
                  />
                )}
              </div>
              {/* Mobile thumbnails */}
              <div className='md:hidden flex overflow-x-scroll space-x-4 mb-4'>
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `thumbnail ${index}`}
                    onClick={() => setMainImage(image.url)}
                    className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 ${
                      mainImage === image.url ? 'border-black' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Product info */}
            <div className='md:w-1/2 md:ml-10'>
              <h1 className='text-2xl md:text-3xl font-semibold mb-2'>
                {selectedProduct.name}
              </h1>

              {/* Price with ₹ */}
              <div className='flex items-center gap-3 mb-1 flex-wrap'>
                {selectedProduct.originalPrice &&
                  selectedProduct.originalPrice > selectedProduct.price && (
                    <span className='text-lg text-gray-400 line-through'>
                      {formattedRupee(selectedProduct.originalPrice)}
                    </span>
                  )}
                <span className='text-2xl font-bold text-gray-900'>
                  {formattedRupee(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice &&
                  selectedProduct.originalPrice > selectedProduct.price && (
                    <span className='bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded'>
                      {Math.round(
                        ((selectedProduct.originalPrice - selectedProduct.price) /
                          selectedProduct.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
              </div>

              {/* Savings */}
              {selectedProduct.originalPrice &&
                selectedProduct.originalPrice > selectedProduct.price && (
                  <p className='text-sm text-green-600 mb-3'>
                    You save{' '}
                    {formattedRupee(selectedProduct.originalPrice - selectedProduct.price)}
                  </p>
                )}

              <p className='text-gray-600 mb-4'>{selectedProduct.description}</p>

              {/* Color selector */}
              <div className='mb-4'>
                <p className='text-gray-700 font-medium mb-2'>
                  Color:{' '}
                  {selectedColor && (
                    <span className='font-normal text-gray-600'>{selectedColor}</span>
                  )}
                </p>
                <div className='flex gap-2 flex-wrap mt-1'>
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      title={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedColor === color
                          ? 'border-black ring-2 ring-offset-1 ring-black scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor:
                          COLOR_MAP[color.toLowerCase()] || color.toLowerCase(),
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className='mb-4'>
                <p className='text-gray-700 font-medium mb-2'>Size:</p>
                <div className='flex gap-2 flex-wrap mt-1'>
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className='mb-4'>
                <p className='text-gray-700 font-medium mb-2'>Quantity:</p>
                <div className='flex items-center space-x-3 mt-1'>
                  <button
                    className='w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center
                               justify-center text-lg font-medium transition-colors'
                    onClick={() => handleQuantityChange('minus')}
                  >
                    −
                  </button>
                  <span className='text-lg font-medium w-8 text-center'>{quantity}</span>
                  <button
                    className='w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center
                               justify-center text-lg font-medium transition-colors'
                    onClick={() => handleQuantityChange('plus')}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Running total when qty > 1 */}
              {quantity > 1 && (
                <p className='text-sm text-gray-500 mb-3'>
                  Total:{' '}
                  <span className='font-semibold text-gray-800'>
                    {formattedRupee(selectedProduct.price * quantity)}
                  </span>
                </p>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-3 px-6 rounded w-full mb-4 font-medium
                           tracking-wide transition-all ${
                             isButtonDisabled
                               ? 'cursor-not-allowed opacity-50'
                               : 'hover:bg-gray-800 active:scale-95'
                           }`}
              >
                {isButtonDisabled ? 'Adding...' : 'ADD TO CART'}
              </button>

              {/* Product details table */}
              <div className='mt-6 bg-gray-50 rounded-lg p-4 text-gray-700'>
                <h3 className='text-base font-semibold mb-3'>Characteristics</h3>
                <table className='w-full text-sm'>
                  <tbody>
                    {selectedProduct.brand && (
                      <tr className='border-b border-gray-200'>
                        <td className='py-2 text-gray-500 w-1/3'>Brand</td>
                        <td className='py-2 font-medium'>{selectedProduct.brand}</td>
                      </tr>
                    )}
                    {selectedProduct.material && (
                      <tr className='border-b border-gray-200'>
                        <td className='py-2 text-gray-500'>Material</td>
                        <td className='py-2 font-medium'>{selectedProduct.material}</td>
                      </tr>
                    )}
                    {selectedProduct.gender && (
                      <tr className='border-b border-gray-200'>
                        <td className='py-2 text-gray-500'>Gender</td>
                        <td className='py-2 font-medium'>{selectedProduct.gender}</td>
                      </tr>
                    )}
                    {selectedProduct.sku && (
                      <tr>
                        <td className='py-2 text-gray-500'>SKU</td>
                        <td className='py-2 font-medium'>{selectedProduct.sku}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar products */}
          <div className='mt-20'>
            <h2 className='text-2xl text-center font-semibold mb-6'>You May Also Like</h2>
            <ProductGrid products={similarProducts} loading={loading} error={error} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
