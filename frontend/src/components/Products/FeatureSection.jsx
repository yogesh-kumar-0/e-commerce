import React from 'react'
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'
import { MdSupportAgent, MdVerified } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'

const features = [
  {
    icon: <HiShoppingBag className='text-3xl' />,
    title: 'Free Shipping',
    subtitle: 'On all orders above ₹499',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
  },
  {
    icon: <HiArrowPathRoundedSquare className='text-3xl' />,
    title: '7-Day Returns',
    subtitle: '100% money-back guarantee',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
  },
  {
    icon: <HiOutlineCreditCard className='text-3xl' />,
    title: 'Secure Checkout',
    subtitle: 'Razorpay · UPI · Cards',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
  },
  {
    icon: <MdSupportAgent className='text-3xl' />,
    title: '24/7 Support',
    subtitle: 'Dedicated customer help',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
  },
  {
    icon: <MdVerified className='text-3xl' />,
    title: '100% Authentic',
    subtitle: 'Verified quality products',
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
  },
  {
    icon: <TbTruckDelivery className='text-3xl' />,
    title: 'Pan India Delivery',
    subtitle: '20,000+ pin codes covered',
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
  },
]

const FeatureSection = () => {
  return (
    <section className='py-16 px-4 bg-white border-t border-gray-100'>
      <div className='container mx-auto'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-2'>
          Why Shop With Us?
        </h2>
        <p className='text-center text-gray-500 text-sm mb-10'>
          We make your shopping experience smooth, safe &amp; satisfying.
        </p>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bg} rounded-xl p-5 flex flex-col items-center text-center
                          hover:shadow-md transition-shadow duration-300`}
            >
              <div className={`${feature.iconBg} p-3 rounded-full mb-3 shadow-sm`}>
                {feature.icon}
              </div>
              <h4 className='text-sm font-semibold text-gray-800 mb-1 leading-tight'>
                {feature.title}
              </h4>
              <p className='text-xs text-gray-500 leading-snug'>{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
