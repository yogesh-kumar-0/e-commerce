const express = require('express');
const router = express.Router();
const Subscriber=require('../models/Subscriber');

// route POST /api/subscribe
// desc handle newletter subscription
// access public

router.post("/subscribe",async(req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message:"eamil is required"});
    }

    try {
        // check if the email is already subscribed
        let subscriber = await(Subscriber.findOne({email}));

        if(subscriber){
            return res.status(400).json({message:'email is already subscribed'})
        }

        // create a new subscriber
        subscriber= new Subscriber({email});
        await subscriber.save();

        res.status(201).json({message:"subscribed successfully to newletter"});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"});
        
        
    }
});

module.exports= router;
 