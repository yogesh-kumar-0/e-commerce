import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formattedRupee } from '../../script'

const MIN_PRICE = 0
const MAX_PRICE = 10000

const COLOR_MAP = {
  Red: '#e53e3e', Blue: '#3182ce', Black: '#1a202c', Yellow: '#d69e2e',
  Green: '#38a169', White: '#e2e8f0', Pink: '#ed64a6', Navy: '#2c5282',
}

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [filter, setFilter] = useState({
    category: '', gender: '', color: '',
    size: [], material: [], brand: [],
    minPrice: MIN_PRICE, maxPrice: MAX_PRICE,
  })
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE])

  const categories = ['Top Wear', 'Bottom Wear']
  const colors = ['Red', 'Blue', 'Black', 'Yellow', 'Green', 'White', 'Pink', 'Navy']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const materials = ['Cotton', 'Wool', 'Denim', 'Polyester', 'Silk', 'Linen', 'Viscose', 'Fleece']
  const brands = ['Urban Threads', 'ModernFit', 'Street Style', 'Beach Breeze', 'Fashionista', 'ChicStyle']
  const genders = ['Men', 'Women']

  useEffect(() => {
    const params = Object.fromEntries([...searchParams])
    const minP = params.minPrice ? Number(params.minPrice) : MIN_PRICE
    const maxP = params.maxPrice ? Number(params.maxPrice) : MAX_PRICE
    setFilter({
      category: params.category || '',
      gender: params.gender || '',
      color: params.color || '',
      size: params.size ? params.size.split(',') : [],
      material: params.material ? params.material.split(',') : [],
      brand: params.brand ? params.brand.split(',') : [],
      minPrice: minP, maxPrice: maxP,
    })
    setPriceRange([minP, maxP])
  }, [searchParams])

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams()
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(','))
      } else if (newFilters[key] !== '' && newFilters[key] !== null && newFilters[key] !== undefined) {
        params.append(key, newFilters[key])
      }
    })
    setSearchParams(params)
    navigate(`?${params.toString()}`)
  }

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target
    let newFilters = { ...filter }
    if (type === 'checkbox') {
      newFilters[name] = checked
        ? [...(newFilters[name] || []), value]
        : newFilters[name].filter((item) => item !== value)
    } else {
      newFilters[name] = value
    }
    setFilter(newFilters)
    updateUrlParams(newFilters)
  }

  const handleColorClick = (color) => {
    const newColor = filter.color === color ? '' : color
    const newFilters = { ...filter, color: newColor }
    setFilter(newFilters)
    updateUrlParams(newFilters)
  }

  const handleSizeClick = (size) => {
    const newSizes = filter.size.includes(size)
      ? filter.size.filter((s) => s !== size)
      : [...filter.size, size]
    const newFilters = { ...filter, size: newSizes }
    setFilter(newFilters)
    updateUrlParams(newFilters)
  }

  const handleMinPrice = (e) => {
    const val = Number(e.target.value)
    setPriceRange([val, priceRange[1]])
    const newFilters = { ...filter, minPrice: val }
    setFilter(newFilters)
    updateUrlParams(newFilters)
  }

  const handleMaxPrice = (e) => {
    const val = Number(e.target.value)
    setPriceRange([priceRange[0], val])
    const newFilters = { ...filter, maxPrice: val }
    setFilter(newFilters)
    updateUrlParams(newFilters)
  }

  const handlePreset = (min, max) => {
    setPriceRange([min, max])
    const newFilters = { ...filter, minPrice: min, maxPrice: max }
    setFilter(newFilters)
    updateUrlParams(newFilters)
  }

  const handleClearAll = () => {
    const def = { category: '', gender: '', color: '', size: [], material: [], brand: [], minPrice: MIN_PRICE, maxPrice: MAX_PRICE }
    setFilter(def)
    setPriceRange([MIN_PRICE, MAX_PRICE])
    setSearchParams(new URLSearchParams())
    navigate('?')
  }

  return (
    <div className='p-4 overflow-auto h-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4 sticky top-0 bg-white pt-2 pb-3 border-b z-10'>
        <h3 className='text-xl font-semibold text-gray-800'>Filters</h3>
        <button
          onClick={handleClearAll}
          className='text-xs text-red-500 hover:text-red-700 font-medium underline'
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className='mb-6'>
        <label className='block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide'>
          Category
        </label>
        {categories.map((category) => (
          <div className='flex items-center mb-1.5' key={category}>
            <input
              type='radio'
              value={category}
              checked={filter.category === category}
              onChange={handleFilterChange}
              name='category'
              id={`cat-${category}`}
              className='mr-2 h-4 w-4 accent-black'
            />
            <label htmlFor={`cat-${category}`} className='text-gray-700 text-sm cursor-pointer'>
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className='mb-6'>
        <label className='block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide'>
          Gender
        </label>
        {genders.map((gender) => (
          <div className='flex items-center mb-1.5' key={gender}>
            <input
              type='radio'
              name='gender'
              value={gender}
              onChange={handleFilterChange}
              checked={filter.gender === gender}
              id={`gen-${gender}`}
              className='mr-2 h-4 w-4 accent-black'
            />
            <label htmlFor={`gen-${gender}`} className='text-gray-700 text-sm cursor-pointer'>
              {gender}
            </label>
          </div>
        ))}
      </div>

      {/* Color */}
      <div className='mb-6'>
        <label className='block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide'>
          Color
        </label>
        <div className='flex flex-wrap gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              title={color}
              onClick={() => handleColorClick(color)}
              className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
                filter.color === color
                  ? 'border-black scale-110 ring-2 ring-offset-1 ring-black'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: COLOR_MAP[color] || color.toLowerCase() }}
            />
          ))}
        </div>
        {filter.color && (
          <p className='text-xs text-gray-500 mt-1'>Selected: {filter.color}</p>
        )}
      </div>

      {/* Size */}
      <div className='mb-6'>
        <label className='block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide'>
          Size
        </label>
        <div className='flex flex-wrap gap-2'>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeClick(size)}
              className={`px-3 py-1 rounded border text-sm font-medium transition-all ${
                filter.size.includes(size)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range — Indian Rupees */}
      <div className='mb-6'>
        <label className='block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide'>
          Price Range
        </label>

        {/* Display */}
        <div className='flex justify-between items-center mb-3'>
          <span className='text-sm font-semibold bg-gray-100 px-2 py-1 rounded text-gray-800'>
            {formattedRupee(priceRange[0])}
          </span>
          <span className='text-xs text-gray-400'>to</span>
          <span className='text-sm font-semibold bg-gray-100 px-2 py-1 rounded text-gray-800'>
            {formattedRupee(priceRange[1])}
          </span>
        </div>

        {/* Min slider */}
        <div className='mb-3'>
          <div className='flex justify-between text-xs text-gray-500 mb-1'>
            <span>Min: {formattedRupee(priceRange[0])}</span>
          </div>
          <input
            type='range'
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={100}
            value={priceRange[0]}
            onChange={handleMinPrice}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black'
          />
        </div>

        {/* Max slider */}
        <div className='mb-3'>
          <div className='flex justify-between text-xs text-gray-500 mb-1'>
            <span>Max: {formattedRupee(priceRange[1])}</span>
          </div>
          <input
            type='range'
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={100}
            value={priceRange[1]}
            onChange={handleMaxPrice}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black'
          />
        </div>

        {/* Quick presets */}
        <p className='text-xs text-gray-500 mb-1.5'>Quick Select:</p>
        <div className='flex flex-wrap gap-1.5'>
          {[
            { label: 'Under ₹500', min: 0, max: 500 },
            { label: '₹500–₹1500', min: 500, max: 1500 },
            { label: '₹1500–₹3000', min: 1500, max: 3000 },
            { label: 'Above ₹3000', min: 3000, max: MAX_PRICE },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p.min, p.max)}
              className={`text-xs px-2 py-1 rounded border transition-all ${
                priceRange[0] === p.min && priceRange[1] === p.max
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className='mb-6'>
        <label className='block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide'>
          Material
        </label>
        {materials.map((material) => (
          <div className='flex items-center mb-1.5' key={material}>
            <input
              type='checkbox'
              value={material}
              onChange={handleFilterChange}
              checked={filter.material.includes(material)}
              name='material'
              id={`mat-${material}`}
              className='mr-2 h-4 w-4 accent-black'
            />
            <label htmlFor={`mat-${material}`} className='text-gray-700 text-sm cursor-pointer'>
              {material}
            </label>
          </div>
        ))}
      </div>

      {/* Brand */}
      <div className='mb-8'>
        <label className='block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide'>
          Brand
        </label>
        {brands.map((brand) => (
          <div className='flex items-center mb-1.5' key={brand}>
            <input
              type='checkbox'
              name='brand'
              value={brand}
              onChange={handleFilterChange}
              checked={filter.brand.includes(brand)}
              id={`brand-${brand}`}
              className='mr-2 h-4 w-4 accent-black'
            />
            <label htmlFor={`brand-${brand}`} className='text-gray-700 text-sm cursor-pointer'>
              {brand}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterSideBar
