import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RazorPayButton from './RazorPayButton';
import { formattedRupee } from '../../script';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout  } from '../../redux/slice/checkoutSlice';
// import { clearCart } from '../../redux/slice/cartSlice';
import axios from 'axios';
 

const CheckOut = () => {
  const dispatch = useDispatch();

  const {cart, loading, error} = useSelector(state=> state.cart);
  const {user} = useSelector(state=> state.auth);

  const navigate =useNavigate();
  const [checkoutId,setCheckoutId] = useState(null)
  const [shippingAddress,setShippingAddress] =useState({
    firstName :"",
    lastName:"",
    address:"",
    city:'',
    postalCode:'',
    country:"",
    phone:'',
  })

  // ensure cart is not loaded before proceeding

  useEffect(()=>{
    if (!cart || !cart.products || cart.products.length === 0){
      navigate("/");
    }

  },[cart, navigate])

  const handleCreateCheckout =async (e)=>{
    e.preventDefault();
    if(cart && cart.products.length>0){
      const res = await dispatch(createCheckout({
        checkOutItems:cart.products,
        shippingAddress,
        paymentMethod:"razorpay",
        totalPrice: cart.totalPrice,


      }))
      
      if(res.payload && res.payload._id){
        setCheckoutId(res.payload._id); // set the checkkout id id checkout was successfull
      }
    }
    // setCheckoutId(12345);
  }
  
  const handlePaymentSuccess = async (details)=>{
    try{
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus:"Paid", paymentDetails:details,
        },
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("userToken")}`,
          }
        }
      )
        await handleFinalizeCheckout(); // finalize checkout if payment is successful
      }
    
    catch(error){
      console.error("Error verifying payment:",error);

    }
    
  }

  const handleFinalizeCheckout=async()=>{
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,{},
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("userToken")}`,
          }
        }
      )
     
        // Clear cart immediately after successful finalization

        // dispatch(clearCart());
        // localStorage.removeItem("cart");
        navigate("/order-confirmation");
      
    } catch (error) {
      console.error("Error finalizing checkout:",error);
      
    }
  };

  if (loading ){
    return <p>Loading cart...</p>
  }
  if (error ){
    return <p>Error: {error}</p>
  }
  if(!cart || !cart.products || cart.products.length === 0){
    return <p>Your cart is empty. Please add items to cart before checkout.</p>
  }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      {/* left section */}
      <div className="bg-white rounded-lg p-6">
        {/* {console.log("CART IN CHECKOUT:", user)} */}
        <h2 className="text-2xl uppercase mb-6"> Checkout</h2>
        <form action="" onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4"> Contact Details</h3>
          <div className="mb-4">
            <label htmlFor="" className='block text-gray-700'>Email</label>
            <input 
            type='email'
            value={user? user.user?.email : ""}
            className='w-full p-2 border rounded'
            disabled/>
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
            <label className='block text-gray-700'>First Name</label>
            <input type='text'
            placeholder='First Name'
            value={shippingAddress.firstName}
            onChange={(e)=>setShippingAddress({...shippingAddress,firstName:e.target.value})}
             className='w-full p-2 border rounded' required/>
          </div>
          
           <div>
            <label className='block text-gray-700'>Last Name</label>
            <input type='text'
            value={shippingAddress.lastName}
            onChange={(e)=>setShippingAddress({...shippingAddress,lastName:e.target.value})}
             className='w-full p-2 border rounded'
             placeholder='Last Name' required/>
          </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className='block text-gray-700'>
              Address
            </label>
            <input type='text'
            value={shippingAddress.address}
            onChange={(e)=> setShippingAddress({...shippingAddress,address:e.target.value})}
            className='w-full p-2 border rounded'
            placeholder='Address'
            required/>

          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
            <label className='block text-gray-700'>City</label>
            <input type='text'
            placeholder='City'
            value={shippingAddress.city}
            onChange={(e)=>setShippingAddress({...shippingAddress,city:e.target.value})}
             className='w-full p-2 border rounded' required/>
          </div>
          
           <div>
            <label className='block text-gray-700'>Postal Code</label>
            <input type='text'
            value={shippingAddress.postalCode}
            onChange={(e)=>setShippingAddress({...shippingAddress,postalCode:e.target.value})}
             className='w-full p-2 border rounded'
             placeholder='Postal Code' required/>
          </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className='block text-gray-700'>
              Country
            </label>
            <input type='text'
            value={shippingAddress.country}
            onChange={(e)=> setShippingAddress({...shippingAddress,country:e.target.value})}
            className='w-full p-2 border rounded'
            placeholder='Country'
            required/>

          </div>
          <div className="mb-4">
            <label htmlFor="" className='block text-gray-700'>
              Phone Number
            </label>
            <input type='tel'
            value={shippingAddress.phone}
            onChange={(e)=> setShippingAddress({...shippingAddress,phone:e.target.value})}
            className='w-full p-2 border rounded'
            placeholder='Phone Number'
            required/>

          </div>
          <div className="mt-6">
            {!checkoutId ?(
              <button type='submit' className='w-full bg-black text-white py-3 rounded'>
                Continue to Payment
              </button>
            ):(
              <div>
                {/* <h3 className="text-lg mb-4">
                  Pay with Razorpay
                </h3> */}
                {/* Razorpay component */}
                
                <RazorPayButton amount={cart.totalPrice} onSuccess={handlePaymentSuccess} 
                onError={()=>alert('Payment Failed. Try again!')} user={user}/>

              </div>
            )}
          </div>
        </form>
      </div>
      {/* right section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4 ">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product,index)=>(
            <div key={index} className="flex items-start justify-between py-2 border-b border-gray-400">
              <div className="flex items-start">
                <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4'/>
                <div className="">
                  <h3 className="text-md ">{product.name}</h3>
                  <p className="text-gray-700">Size: {product.size}</p>
                  <p className="text-gray-700">Color: {product.color}</p>
                </div>
                
              </div>
              <p className="text-xl">{formattedRupee(product.price)}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-centertext-lg mb-4">
          <p>Subtotal</p>
          <p>{formattedRupee(cart.totalPrice)}
            
          </p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t  border-gray-400 pt-4">
          <p>Total</p>
          <p>{formattedRupee(cart.totalPrice)}</p>
        </div>
      </div>

      
    </div>
  )
}

export default CheckOut
