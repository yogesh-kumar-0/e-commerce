const express =require('express');
const cors = require('cors');
const dotenv=require('dotenv');
dotenv.config();
const userRoutes =require('./routes/userRoutes');
const productRoutes =require('./routes/productRoutes');
const cartRoutes =require('./routes/cartRoutes');
const checkoutRoutes =require('./routes/checkoutRoutes');
const orderRoutes =require('./routes/orderRoutes');
const uploadRoutes =require('./routes/uploadRoutes');
const subscriberRoute =require('./routes/subscriberRoute');
const adminRoutes =require('./routes/adminRoutes'); 
const productAdminRoutes =require('./routes/productAdminRoutes');
const adminOrderRoutes =require('./routes/adminOrderRoutes');

const razorpayRoutes =require('./routes/razorpayRoutes');
const connect = require('./config/db');
const app =express();

app.use(express.json());

app.use(cors());



const port = process.env.PORT;
// connect mongo
connect();

// app.get('/',(req,res)=>{
//     res.send('welcome chutiye');
// });


// Api routes 
app.use('/api/users' ,userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/checkout',checkoutRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api',subscriberRoute);
app.use('/api/razorpay',razorpayRoutes);

// Admin routes
app.use('/api/admin/users',adminRoutes);
app.use('/api/admin/products',productAdminRoutes);
app.use('/api/admin/orders',adminOrderRoutes);

app.listen(port,()=>{
    console.log(`server is running on port`,port)
})