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



const port = process.env.PORT || 9000;
// connect mongo
connect();

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend server is running', status: 'ok' });
});

// API health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is healthy', status: 'ok' });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.status || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    res.status(statusCode).json({ error: message, status: 'error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found', status: 'error' });
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});