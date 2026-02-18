const express = require('express');
const User = require('../models/User');
const { protect,admin}= require('../middleware/authMiddleware');

const router = express.Router();

// route GET /api/admin/users
// desc get all users (Admin only)
// access private/admin

router.get("/",protect,admin,async(req,res)=>{
    try {
        const users= await User.find({}) 
        res.json(users);



    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"});
        
    }
});

// route POST /api/admin/users
// desc add a new user(admin only)
// access private/admin

router.post('/',protect,admin,async(req,res)=>{
    const {name,email,password,role} = req.body;

    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exists"})
        }

        user = new User({
            name,
            email,
            password,
            role:role || 'customer'});

        await user.save();
        res.status(201).json({message:"user created successfully",user});
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"});
        
        
    }
});

// route PUT api/admin/users/:id
// desc update user info (admin only) - name,email,role
// access private/admin

router.put('/:id',protect,admin,async(req,res)=>{
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({message: "Invalid user ID"});
        }
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        
        const updatedUser = await user.save();
        res.json({message:'user updated successfully',user:updatedUser});

    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(400).json({message: "Invalid user ID format"});
        }
        res.status(500).json({message:"server error"});
        
    }
});

// route DELETE /api/admin/users/:id
// desc delete a user 
// access private/admin

router.delete('/:id',protect,admin,async(req,res)=>{
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({message: "Invalid user ID"});
        }
        
        const user = await User.findById(id);
        if(user){
            await user.deleteOne();
            res.json({message:'user deleted successfully'});
        }else{
            res.status(404).json({message:'user not found'});
        }
        
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(400).json({message: "Invalid user ID format"});
        }
        res.status(500).json({message:"server error"});
        
    }
});



module.exports = router;