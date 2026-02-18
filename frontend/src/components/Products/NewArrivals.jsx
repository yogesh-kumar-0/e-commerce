import axios from 'axios';
import React, { useState,useRef, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const NewArrivals = () => {
    const scrollRef=useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX,setStartX] =useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    // const [scrollRight,setScrollRight] = useState(true);
    const [canScrollLeft,setCanScrollLeft]=useState(false);
    const [canScrollRight,setCanScrollRight]=useState(false);

   const [newArrivals,setNewArrivals]= useState([]);

   useEffect(()=>{
    const fetchNewArrivals = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
          
            setNewArrivals(response.data);
            
        } catch (error) {
            console.error("Error fetching new arrivals:", error);
        }
    }
    fetchNewArrivals();
   },[])
const handleMouseDown = (e)=>{
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
}

const handleMouseMove= (e)=>{
    if (!isDragging) return;
    const x= e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft= scrollLeft - walk;
}


const handleMouseUpOrLeave = ()=>{
    setIsDragging(false);
}
//button
const scroll=(Direction)=>{
    const scrollAmount = Direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({left:scrollAmount,behavior:'smooth'})

}


// update scroll button
const updateScrollButton = () => {
  const container = scrollRef.current;
  if (!container) return;

  setCanScrollLeft(container.scrollLeft > 0);

  setCanScrollRight( Math.ceil(container.scrollLeft + container.clientWidth) <
  container.scrollWidth
  );
};

useEffect(()=>{
    const container = scrollRef.current;
    if (!container) return;
    if(container){
        container.addEventListener('scroll',updateScrollButton);
        updateScrollButton();
        return ()=> container.removeEventListener('scroll',updateScrollButton); 
    }
},[newArrivals])

  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className="container mx-auto text-center mb-10 relative">
            <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
            <p className='text-gray-600  text-lg mb-8'>Discover the latest trends in fashion and stay ahead with our new arrivals.</p>
        
        {/* scroll */}
        <div className='absolute right-0 -bottom-7.5 flex space-x-2'>
            <button onClick={()=>scroll('left')}
            disabled={!canScrollLeft}
             className={`p-2 rounded border ${canScrollLeft ? 'bg-white text-black': 'bg-gray-200 text-gray-400'} `}>
                <FiChevronLeft className='text-2xl'/>
            </button>
            <button onClick={()=>scroll('right')}
            disabled={!canScrollRight}
            
             className={`p-2 rounded border ${canScrollRight ? 'bg-white text-black': 'bg-gray-200 text-gray-400'}`}>
                <FiChevronRight className='text-2xl'/>
            </button>
        </div>
        </div>

        {/* scrollable content */}
        <div ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
            {newArrivals.map((product)=>(
                <div key={product._id} className=' min-w-full sm:min-w-[50%] lg:min-w-[30%] relative' >
                    <img src={product.images[0]?.url }
                    className='w-full h-125 object-cover rounded-lg'
                    alt={product.images[0]?.altText || product.name}
                    draggable='false'/>
                    <div className='absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg'>
                       <Link to={`/product/${product._id}`} className='block'>
                       <h4 className='font-medium'>{product.name}
                        </h4>
                        <p className='mt-1'>${product.price}</p>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}

export default NewArrivals



