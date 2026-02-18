import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// asyncthunk to fetch the orders

export const fetchOrders= createAsyncThunk('order/fetchUserOrders',async(_,{rejectWithValue})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }

    })
    return response.data;
}
     catch (error) {
        return rejectWithValue(error.response.data);
        
    }
});

//asyncs thunk to fetch order details by ID

export const fetchOrderDetails= createAsyncThunk('order/fetchOrderDetails',async(orderId,{rejectWithValue})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
});

const orderSlice = createSlice({
    name:"orders",
    initialState:{
        orders:[],
        totalOrders:0,
        orderDetails:null,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchOrders.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(fetchOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload;
           
        })
        .addCase(fetchOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message ;
        })
        .addCase(fetchOrderDetails.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(fetchOrderDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.orderDetails=action.payload;
           
        })
        .addCase(fetchOrderDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message ;
        });
    },
});

export default orderSlice.reducer;