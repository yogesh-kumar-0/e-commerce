import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const Api_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN=`Bearer ${localStorage.getItem("userToken")}`;

// fetch all orders (admin only)


export const fetchAllOrders= createAsyncThunk('adminOrders/fetchAllOrders',async(_,{rejectWithValue})=>{
    try{
    const response = await axios.get(`${Api_URL}/api/admin/orders`,{
        headers:{
            Authorization: USER_TOKEN,
        }
    })
    return response.data;
} catch(error){
        return rejectWithValue(error.response.data);
    }
    
})

// update the order delivery status 

export const updateOrderStatus= createAsyncThunk('adminOrders/updateOrderStatus',async({id,status},{rejectWithValue})=>{
    try{
    const response = await axios.put(`${Api_URL}/api/admin/orders/${id}`,{
        status:status
    },{
        headers:{
            Authorization: USER_TOKEN,
        }
    })
    return response.data;
} catch(error){
        return rejectWithValue(error.response.data);
    }
    
})

// delete an order

export const deleteOrder= createAsyncThunk('adminOrders/deleteOrder',async(id,{rejectWithValue})=>{
    try{
     axios.delete(`${Api_URL}/api/admin/orders/${id}`,{
        headers:{
            Authorization: USER_TOKEN,
        }
    })
    return id;
} catch(error){
        return rejectWithValue(error.response.data);
    }
    
})

const adminOrderSlice = createSlice({
    name:"adminOrders",
    initialState:{
        orders:[],
        totalOrders:0,
        totalSales:0,
        loading:false,
        error:null,

    },reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAllOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchAllOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload;
            state.totalOrders=action.payload.length;

            const totalSales = action.payload.reduce((total,order)=> {
              return  total + order.totalPrice;
            },0);
            state.totalSales=totalSales;
        })
        .addCase(fetchAllOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
        
        .addCase(updateOrderStatus.fulfilled,(state,action)=>{
            state.loading=false;
            const updatedOrder = action.payload;
            const orderIndex= state.orders.findIndex(order=> order._id === updatedOrder._id);
            if(orderIndex !== -1){
                state.orders[orderIndex]=updatedOrder;
            }
        })
        
        .addCase(deleteOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders= state.orders.filter(order => order._id !== action.payload);
        })
    }
});

export default adminOrderSlice.reducer;