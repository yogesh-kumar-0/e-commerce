const express = require('express');
const User = require('../models/User');
const jwt= require('jsonwebtoken');

const router=express.Router();

const {protect} =require('../middleware/authMiddleware')

//@route post /api/users/register
//desc register a new user
//@access public
router.post('/register',async (req,res)=>{
    const {name,email,password} =req.body;
    try{
        let user = await User.findOne({email})
        if (user) return res.status(400).json({message:'user already exist'});

        user = new User({name,email,password});
        await user.save();

        //create jwt payload
        const payload ={user:{ id:user._id, role:user.role}};

        //sign a return the token along with user data
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'40h'},(err,token)=>{
            if(err) throw err;

            //send the user token in response
            res.status(201).json({
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    password:user.password
                },
                token,
            })
        });

    }
    catch(err){
        console.log(err);
        res.status(500).send('server error');
    }
});


// @route POST /api/users/login
router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try{
        //find the user by email
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'Invalid Credential'});
        const isMatch=await user.matchPassword(password);

        if(!isMatch) return res.status(400).json({message:'invalid credentials'})
        
            
        //create jwt payload
        const payload ={user:{ id:user._id, role:user.role}};

        //sign a return the token along with user data
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'40h'},(err,token)=>{
            if(err) throw err;

            //send the user token in response
            res.json({
                user:{
                    _id:user._id,
                    name:user.name,                    email:user.email,                    role:user.role,
                    password:user.password
                },
                token,
            })
        });
    }
    catch(err){
        console.error(err);
        res.status(500).send('server error');
    };

});

// @route get /api/users/profile
// @desc get logged-in user's
// @access private

router.get('/profile',protect,async(req,res)=>{
    res.json(req.user);
})

module.exports=router;