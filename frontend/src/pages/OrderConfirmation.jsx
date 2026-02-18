import React, { useEffect } from 'react'
import { formattedRupee } from '../script';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slice/cartSlice';


const OrderConfirmation = () => {
    const dispatch =useDispatch();
    const navigate = useNavigate();
    const {checkout} = useSelector( state => state.checkout);

    useEffect(()=>{
        if ( checkout && checkout._id) {
   
      dispatch(clearCart());
      localStorage.removeItem("cart");
    
} 
     else{
            navigate("/my-orders")
        }
    },[checkout, dispatch, navigate])

    const calculateEstimateDeliery =(createdAt)=>{
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate()+10); //add 10 days to order date
        return orderDate.toLocaleDateString();
    }
    console.log("CHECKOUT:", checkout);

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
        <h1 className="text-4xl font-bold text-center text-emerald-700">
            Thank You for Your Order!
        </h1>
      {checkout && <div className='p-6 rounded-lg border'>
        <div className='flex justify-between mb-20'>
            {/* orderid and date */}
            <div >
                <h2 className="text-xl font-semibold">
                    Order ID: {checkout._id}
                </h2>
                <p className='text-gray-500'>
                    Order date: { new Date(checkout.createdAt).toLocaleDateString()}
                </p>
            </div>
            {/* Estimated delivery */}
            <div>
                <p className="text-emerald-700 text-sm">
                    Estimated Delivery: {calculateEstimateDeliery(checkout.createdAt)}
                </p>
            </div>
            </div> 
            {/* ordered items */}
            <div className="mb-20">
                {checkout.checkOutItems && checkout.checkOutItems.length > 0 ? (
                    checkout.checkOutItems.map((item)=>(
                        <div className="flex items-center mb-4" key={item.productId}>
                            <img src={item.image} alt={item.name}
                            className='w-18 h-16 object-cover rounded-md mr-4'/>
                            <div>
                                <h4 className="text-md font-semibold">{item.name}</h4>
                                <p className="text-sm text-gray-500">
                                    {item.color} | {item.size}
                                </p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-md">{formattedRupee(item.price)}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No items in order</p>
                )}
            </div>
            {/* payment and delivery info */}
            <div className="grid grid-cols-2 gap">
                <div>
                    <h4 className="text-lg font-semibold mb-2 ">Payment</h4>
                    <p className="text-gray-600">Razorpay</p>
                </div>
                {/* delivery */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                    <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                    <p className="text-gray-600">
                        {checkout.shippingAddress.city},{" "}
                        {checkout.shippingAddress.country}
                    </p>
                </div>
            </div>
            </div>}
    </div>
  )
}

export default OrderConfirmation
