import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { formattedRupee } from '../../script'

const NewArrivals = () => {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [newArrivals, setNewArrivals] = useState([])

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        )
        setNewArrivals(response.data)
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
      }
    }
    fetchNewArrivals()
  }, [])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => setIsDragging(false)

  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const updateScrollButton = () => {
    const container = scrollRef.current
    if (!container) return
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      Math.ceil(container.scrollLeft + container.clientWidth) < container.scrollWidth
    )
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.addEventListener('scroll', updateScrollButton)
    updateScrollButton()
    return () => container.removeEventListener('scroll', updateScrollButton)
  }, [newArrivals])

  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto text-center mb-10 relative'>
        <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
        <p className='text-gray-600 text-lg mb-8'>
          Discover the latest trends in fashion and stay ahead with our new arrivals.
        </p>

        {/* Scroll buttons */}
        <div className='absolute right-0 -bottom-7.5 flex space-x-2'>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded border transition-colors ${
              canScrollLeft
                ? 'bg-white text-black hover:bg-gray-50'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <FiChevronLeft className='text-2xl' />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded border transition-colors ${
              canScrollRight
                ? 'bg-white text-black hover:bg-gray-50'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <FiChevronRight className='text-2xl' />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className='min-w-full sm:min-w-[50%] lg:min-w-[30%] relative flex-shrink-0'
          >
            <img
              src={product.images[0]?.url}
              className='w-full h-[500px] object-cover rounded-lg'
              alt={product.images[0]?.altText || product.name}
              draggable='false'
            />
            <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-md text-white p-4 rounded-b-lg'>
              <Link to={`/product/${product._id}`} className='block'>
                <h4 className='font-medium text-base mb-0.5'>{product.name}</h4>
                <div className='flex items-center gap-2'>
                  <p className='font-semibold'>{formattedRupee(product.price)}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className='text-xs line-through text-gray-300'>
                      {formattedRupee(product.originalPrice)}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals
