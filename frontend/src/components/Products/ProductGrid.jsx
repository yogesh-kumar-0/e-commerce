import React from 'react'
import { Link } from 'react-router-dom'
import { formattedRupee } from '../../script'

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='animate-pulse bg-white p-4 rounded-lg'>
            <div className='w-full h-80 bg-gray-200 rounded-lg mb-4' />
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
            <div className='h-4 bg-gray-200 rounded w-1/3' />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className='text-red-500 text-center py-8'>Error: {error}</p>
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className='text-center py-16 text-gray-400'>
        <p className='text-xl'>No products found.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {products.map((product, index) => (
        <Link
          to={`/product/${product._id}`}
          key={product._id || index}
          className='block group'
        >
          <div className='bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300'>
            <div className='w-full h-80 overflow-hidden'>
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
            </div>
            <div className='p-3'>
              <h3 className='text-sm font-medium text-gray-800 mb-1 truncate'>
                {product.name}
              </h3>
              <div className='flex items-center gap-2 flex-wrap'>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className='text-xs text-gray-400 line-through'>
                    {formattedRupee(product.originalPrice)}
                  </span>
                )}
                <span className='text-sm font-semibold text-gray-900'>
                  {formattedRupee(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className='text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded'>
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}
                    % off
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid
