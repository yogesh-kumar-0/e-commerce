const express =require('express');
const Order = require("../models/Order");
const {protect} = require("../middleware/authMiddleware");
const { create } = require('../models/Checkout');

const router = express.Router();

// router GET /api/orders
// desc get all orders for logged in user
// access private

router.get('/my-orders',protect,async(req,res)=>{
    try{
        // find orders for the authenticated user
        const orders = await Order.find({user:req.user._id}).sort({
            createdAt:-1}); // sort by most recent orders
        res.json(orders);

        
    }catch(err){
        console.error("error fetching orders:",err);
        res.status(500).json({message:"server error"})
    }
});

// route GET /api/orders/:id
//desc get order details by id
// access private

router.get('/:id',protect,async(req,res)=>{
    try{
        const order =await Order.findById(req.params.id).populate('user',
            'name email'); //populate user details
        
        if(!order){
            return res.status(404).json({message:'order not found'});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({message:'server error'});
        
    }
});

module.exports =router;