import React from 'react'
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'

const FeatureSection = () => {
  return (
<section className='py-16 px-4 bg-white'>
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* feature 1 */}
        <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4">
                <HiShoppingBag className='text-xl'/>
            </div>
            <h4 className="tracking-tighter mb-2">Free Shipping</h4>
            <p className="text-gray-600 text-sm tracking-tighter">
                On All Orders Over 499
            </p>
        </div>
        {/* 2 */}
        <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4">
                <HiArrowPathRoundedSquare className='text-xl'/>
            </div>
            <h4 className="tracking-tighter mb-2">7 Days Return</h4>
            <p className="text-gray-600 text-sm tracking-tighter">
                Money Back Guarantee
            </p>
        </div>
        {/* 3 */}
        <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4">
                <HiOutlineCreditCard className='text-xl'/>
            </div>
            <h4 className="tracking-tighter mb-2">Secure Checkout</h4>
            <p className="text-gray-600 text-sm tracking-tighter">
                100% Secured Checkout Process
            </p>
        </div>
    </div>
</section>
  )
}

export default FeatureSection
