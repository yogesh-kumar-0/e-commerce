import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const SortOptions = () => {
    const [searchParams,setSearchParams]=useSearchParams();
    const navigate = useNavigate();
    //x.com/?a=1&b=2
    const [filter,setFilter]= useState({
        category:'',
        gender:'',
        color:'',
        size:[],
        material:[],
        brand:[],
        minPrice:0,
        maxPrice:100
    });
    const [priceRange, setPriceRange] = useState([0,100]);
    const categorys = ['Top Wear','Bottom Wear']
    const colors=[
        'Red',
        'Blue',
        'Black',
        'Yellow',
        'Green',

    ];
    const sizes =['XS','S','M','L','XL','XXL'];
    const materials =[
        'Cotton',
        'Wool','Denium','Polyster','Silk','Linen','Viscose','Fleece'
    ];
    const brands=[
        'Urban Threads','ModernFit','Street Style','Beach Breeze','Fashionista','ChicStyle'
    ];
    const genders =['Men','Women'];

    useEffect(()=>{
        const params=Object.fromEntries([...searchParams])
        //{category :'Top Wear','Bottom Wear'}=> params.category
        setFilter({
            category:params.category || '',
            gender:params.gender || '',
            color:params.color || '',
            size:params.size? params.size.split(','):[],
            material:params.material? params.material.split(','):[],
            brand:params.brand? params.brand.split(','):[],
            minPrice:params.minPrice || 0,
            maxPrice:params.maxPrice || 100,
        });
        setPriceRange([0, params.maxPrice || 100])
    },[searchParams]);


    const handleFilterChange=(e)=>{
        const { name,value,checked,type } =e.target;
        let newFilters={...filter};
        if (type === 'checkbox'){
            if(checked){
            newFilters[name]=[...(newFilters[name] || []), value];
        }else{
            newFilters[name]=newFilters[name].filter((item)=> item !== value);
        }
    }else{
        newFilters[name]=value;
    }
    setFilter(newFilters);
    updateUrlParams(newFilters);
    // console.log(filter);
    }
    const updateUrlParams =(newFilters) =>{
        const params =new URLSearchParams();
        // {category :'Top Wear,size:[l,xl]}
        Object.keys(newFilters).forEach((key)=>{
            if(Array.isArray(newFilters[key]) && newFilters[key].length>0){
                params.append(key,newFilters[key].join(',')); //'XS,S'
            }else if(newFilters[key]){
                params.append(key,newFilters[key]);
            }
        });
        setSearchParams(params);
        navigate(`?${params.toString()}`);//?category=bottom+wear&size=XS%2CS
    };

    const handlePriceChange=(e)=>{
        const newPrice =e.target.value;
        setPriceRange([0,newPrice]);
        const newFilters={...filter,minPrice:0,maxPrice:newPrice};
        setFilter(newFilters);
        updateUrlParams(newFilters);
    }
  return (
    <div className='p-4 overflow-auto'>
        <h3 className="text-xl font-medium text-gray-800mb-4">
            Filter
        </h3>
        {/* categoory */}
        <div className="mb-6">
            <label className='block text-gray-600 font-medium mb-2'>Catgory</label>
            {categorys.map((category)=>(
                <div className="flex items-center mb-1" key={category}>
                    <input type='radio'
                    value={category}
                    checked={filter.category=== category}
                    onChange={handleFilterChange} name='category'className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
                    <span className='text-gray-700'>{category}</span>
                </div>
            ))}
        </div>
        {/* gender */}
       <div className="mb-6">
            <label className='block text-gray-600 font-medium mb-2'>Gender</label>
            {genders.map((gender)=>(
                <div className="flex items-center mb-1" key={gender}>
                    <input type='radio' name='gender'
                    value={gender}
                    onChange={handleFilterChange}
                    checked={filter.gender === gender}
                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
                    <span className='text-gray-700'>{gender}</span>
                </div>
            ))}
        </div>
        {/* color */}
        <div className="mb-6">
            <label className='block  text-gray-600 font-medium mb-2'>Color</label>
            <div className="flex flex-wrap gap-2">
                {colors.map((color)=>(
                    <button key={color}
                    value={color}
                    onClick={handleFilterChange}
                    
                     name='color' className=
                    {`w-6 h-6 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filter.color===color? 
                        'ring-2 ring-blue-500':''
                    }`}
                    style={{backgroundColor:color.toLowerCase()}}>

                    </button>
                ))}
            </div>
        </div>
        {/* size */}
        <div className="mb-6">
            <label  className="block text-gray-600 font-medium mb-2">Size</label>
            {sizes.map((size)=>(
                <div className="flex items-center mb-1" key={size}>
                    <input type='checkbox'
                    value={size}
                    onChange={handleFilterChange}
                    checked={filter.size.includes(size)}
                     name='size' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
                    <span className='text-gray-700'>{size}</span>
                </div>
            ))}
        </div>
         {/* material */}
        <div className="mb-6">
            <label  className="block text-gray-600 font-medium mb-2">Material</label>
            {materials.map((material)=>(
                <div className="flex items-center mb-1" key={material}>
                    <input type='checkbox'
                    value={material}
                    onChange={handleFilterChange}
                    checked={filter.material.includes(material)}
                     name='material' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
                    <span className='text-gray-700'>{material}</span>
                </div>
            ))}
        </div>
         {/* brand */}
        <div className="mb-6">
            <label  className="block text-gray-600 font-medium mb-2">Brand</label>
            {brands.map((brand)=>(
                <div className="flex items-center mb-1" key={brand}>
                    <input type='checkbox' name='brand'
                    value={brand}
                    onChange={handleFilterChange}
                    checked={filter.brand.includes(brand)}
                     className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
                    <span className='text-gray-700'>{brand}</span>
                </div>
            ))}
        </div>

        {/* price range */}
        <div className="mb-8">
            <label className="block text-gray-600 font-medium mb-2">
                Price Range
            </label>
            <input type='range' name='priceRange'

            min={0} max={100} 
            value={priceRange[1]}
            onChange={handlePriceChange}
            className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'/>
            <div className="flex justify-between text-gray-600 mt-2">
                <span>0</span>
                <span>{priceRange[1]}</span>
            </div>
        </div>
    </div>
  )
}

export default SortOptions
