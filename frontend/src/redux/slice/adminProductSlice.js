import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to fetch admin products
const Api_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN=`Bearer ${localStorage.getItem("userToken")}`;

export const fetchAdminProducts = createAsyncThunk('adminProducts/fetchProducts',async()=>{
    const response = await axios.get(`${Api_URL}/api/admin/products`,{
        headers:{
            Authorization: USER_TOKEN,
        }
    })
    return response.data;
});

// async function to create a new product (admin only)

export const createProduct = createAsyncThunk('adminProducts/createProduct',async(productDate)=>{
    const response = await axios.post(`${Api_URL}/api/admin/products`,productDate,{
        headers:{
            Authorization:USER_TOKEN,
        }
    })
    return response.data;
});

// async function to update a existing product (admin only)

export const updateProduct =createAsyncThunk("adminProducts/updateProduct",async({id, productDate})=>{
    const response = await axios.put(`${Api_URL}/api/admin/products/${id}`,
        productDate,
        {
            headers:{
                Authorization:USER_TOKEN,
            }

        }
    )
    return response.data;
});

//async thunk to delete a product

export const deleteProduct  = createAsyncThunk('adminProducts/deleteProduct',async(id)=>{
    await axios.delete(`${Api_URL}/api/products/${id}`,
        {
            headers:{
                Authorization:USER_TOKEN,
            }

        }
    )
    return id;
})

const adminProductSlice = createSlice({
    name:"adminProducts",
    initialState:{
        products:[],
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAdminProducts.pending,(state)=>{
            state.loading=true;

        })
        .addCase(fetchAdminProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload;
            
        })
        .addCase(fetchAdminProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
            
        })//create products
        .addCase(createProduct.fulfilled,(state,action)=>{
            state.products.push(action.payload);
        })
        //update products
        .addCase(updateProduct.fulfilled,(state,action)=>{
            const index = state.products.findIndex((product)=> product._id === action.payload._id)
            if(index !== -1){
                state.products[index]=action.payload;
            }
        })// delete products
        .addCase(deleteProduct.fulfilled,(state,action)=>{
            state.products=state.products.filter((product)=> product._id !==action.payload);
        })
    }
})

export default adminProductSlice.reducer;