import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import CollectionSection from '../components/Products/CollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import { TbPlaceholder } from 'react-icons/tb'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeatureSection from '../components/Products/FeatureSection'
import {useDispatch, useSelector} from 'react-redux';
import { fetchProductsByFilters } from '../redux/slice/productSlice'
import axios from 'axios'



const Home = () => {
    const dispatch = useDispatch();
    const {products, loading , error}= useSelector(state=> state.products);
    const [bestSellerProduct ,setBestSellerProduct] = useState(null);

    useEffect(()=>{
        //fetch products for specific collection
        dispatch(
            fetchProductsByFilters({
                gender:"Women",
                category:"Bottom Wear",
                limit:8,
            })
        )
        //fetch the bestseller product
        const fetchBestSeller = async()=>{

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)

                setBestSellerProduct(response.data);
            } catch (error) {
                console.error(error);
                
            }
        }
        fetchBestSeller()
    },[dispatch]);
    
  return (

    <div>
        <Hero/>
        <CollectionSection/>
        <NewArrivals/>

        {/* best seller */}
        <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
        {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id}/>) : 
        (<p className='text-center'>Loading Best seller Products ..</p>)}
       
        <div className="container mx-auto">
          <h2 className="text-3xl text-center font-bold mb-4">
            Top Wear For Women
          </h2>
          <ProductGrid products={products} loading={loading} error={error}/>
        </div>
        <FeaturedCollection/>
        <FeatureSection/>
      
    </div>
  )
}

export default Home
