import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderDetails } from '../redux/slice/orderSlice'
import { formattedRupee } from '../script'

const OrderDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { orderDetails, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrderDetails(id))
  }, [dispatch, id])

  if (loading) return <p className='p-6'>Loading...</p>
  if (error) return <p className='p-6 text-red-500'>Error: {error}</p>

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6'>Order Details</h2>
      {!orderDetails ? (
        <p>No order details found.</p>
      ) : (
        <div className='p-4 sm:p-6 rounded-lg border'>
          {/* Order header */}
          <div className='flex flex-col sm:flex-row justify-between mb-8'>
            <div>
              <h3 className='text-lg md:text-xl font-semibold'>
                Order ID: #{orderDetails._id}
              </h3>
              <p className='text-gray-600 text-sm mt-1'>
                {orderDetails.createdAt
                  ? new Date(orderDetails.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className='flex flex-col items-start sm:items-end mt-4 sm:mt-0 gap-2'>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetails.isPaid
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {orderDetails.isPaid ? '✓ Payment Approved' : 'Payment Pending'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetails.isDelivered
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {orderDetails.isDelivered ? '✓ Delivered' : 'Pending Delivery'}
              </span>
            </div>
          </div>

          {/* Payment, Shipping, Total */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 bg-gray-50 p-4 rounded-lg'>
            <div>
              <h4 className='text-sm font-semibold text-gray-500 uppercase mb-2'>
                Payment Info
              </h4>
              <p className='text-gray-800'>Method: {orderDetails.paymentMethod}</p>
              <p className='text-gray-800'>
                Status:{' '}
                <span
                  className={
                    orderDetails.isPaid
                      ? 'text-green-600 font-medium'
                      : 'text-red-500 font-medium'
                  }
                >
                  {orderDetails.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </p>
            </div>
            <div>
              <h4 className='text-sm font-semibold text-gray-500 uppercase mb-2'>
                Shipping Info
              </h4>
              <p className='text-gray-800'>{orderDetails.shippingAddress?.address}</p>
              <p className='text-gray-800'>
                {orderDetails.shippingAddress?.city},{' '}
                {orderDetails.shippingAddress?.country}
              </p>
              {orderDetails.shippingAddress?.postalCode && (
                <p className='text-gray-600 text-sm'>
                  PIN: {orderDetails.shippingAddress.postalCode}
                </p>
              )}
            </div>
            <div>
              <h4 className='text-sm font-semibold text-gray-500 uppercase mb-2'>
                Order Total
              </h4>
              <p className='text-2xl font-bold text-gray-900'>
                {formattedRupee(orderDetails.totalPrice)}
              </p>
              <p className='text-xs text-gray-500 mt-1'>Inclusive of all taxes</p>
            </div>
          </div>

          {/* Items table */}
          <div className='overflow-x-auto'>
            <h4 className='text-lg font-semibold mb-4'>Items Ordered</h4>
            <table className='min-w-full text-gray-600 mb-4'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='py-2 px-4 text-left text-xs uppercase text-gray-500'>
                    Product
                  </th>
                  <th className='py-2 px-4 text-left text-xs uppercase text-gray-500'>
                    Unit Price
                  </th>
                  <th className='py-2 px-4 text-left text-xs uppercase text-gray-500'>
                    Qty
                  </th>
                  <th className='py-2 px-4 text-left text-xs uppercase text-gray-500'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className='border-b hover:bg-gray-50'>
                    <td className='py-3 px-4 flex items-center gap-3'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-12 h-12 object-cover rounded-lg'
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className='text-blue-500 hover:underline text-sm'
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className='py-3 px-4 font-medium'>{formattedRupee(item.price)}</td>
                    <td className='py-3 px-4'>{item.quantity}</td>
                    <td className='py-3 px-4 font-semibold text-gray-800'>
                      {formattedRupee(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='bg-gray-50'>
                  <td colSpan={3} className='py-3 px-4 text-right font-semibold text-gray-700'>
                    Grand Total:
                  </td>
                  <td className='py-3 px-4 font-bold text-lg text-gray-900'>
                    {formattedRupee(orderDetails.totalPrice)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <Link to='/my-orders' className='text-blue-500 hover:underline text-sm mt-4 inline-block'>
            ← Back to My Orders
          </Link>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsPage
