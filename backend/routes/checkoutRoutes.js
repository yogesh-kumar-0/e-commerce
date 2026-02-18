const express = require("express");

const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const {protect} = require("../middleware/authMiddleware");
// Removed duplicate import with inconsistent casing

const router = express.Router();
// route POST api/checkout
// desc create a new checkout session
// access private 

router.post('/',protect,async(req,res)=>{
    const {checkOutItems, shippingAddress, paymentMethod, totalPrice} = req.body;

    if(!checkOutItems || checkOutItems.length === 0){
        return res.status(400).json({message: " no items in checkout"})
    }

    try{
        // create new checkout session
        const newCheckout = await Checkout.create({
            user:req.user._id,
            checkOutItems:checkOutItems,
            shippingAddress,paymentMethod,
            totalPrice,
            paymentStatus:"pending",
            isPaid:false,

        });
        console.log(`checkout created for user:  ${req.user._id}`);
        res.status(201).json(newCheckout);
    }catch(err){
        console.error("error creating checkout session:",err);
        res.status(500).json({message:"server error"})
    }

});


// route PUT /api/checkout/:id/pay
// desc update checkout to mark as paid after successful payment
// access private

router.put("/:id/pay",protect,async (req,res)=>{
    const {paymentStatus,paymentDetails} =req.body;

    try{
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            return res.status(404).json({message:"checkout not found"})
        }

        if(paymentStatus==="Paid"){
            checkout.isPaid=true;
            checkout.paymentStatus=paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        }
        else{
            res.status(400).json({message:"invalid payment status"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({message:"server error"});

    };

});

// route POST /api/checkour/:id/finalize
// desc finalize checkout and convert to an order after payment confirmation
// access private

router.post('/:id/finalize',protect,async (req,res)=>{
    try{
        const checkout=await Checkout.findById(req.params.id);
        
        if(!checkout){
            return res.status(404).json({message:" checkout not found"});
        }
        if(checkout.isPaid && !checkout.isFinalized){
            //create final order based on the checkout details
            const findOrder =await Order.create({
                user:checkout.user,
                orderItems:checkout.checkOutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"Paid",
                paymentDetails:checkout.paymentDetails,
                
            });

            // mark the checkout as finalised
            checkout.isFinalized=true;
            checkout.finalizedAt= Date.now();
            await checkout.save();

            // delete the cart associated
            await Cart.findOneAndDelete({user:checkout.user});
            res.status(201).json(findOrder);

        }else if(checkout.isFinalized){
            res.status(400).json({message:"checkout already finalized"});

        }else{
            res.status(400).json({message:"checkout is not paid"});
        }
 

    }catch(err){

        console.error(err);
        res.status(500).json({message:"server error"});
    };
});

module.exports = router;