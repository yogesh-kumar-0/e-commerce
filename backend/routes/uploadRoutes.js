const express = require('express');
const multer =require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier =require('streamifier');

const router = express.Router();

// require('dotenv').config();


// cloudinary configuration
cloudinary.config({
    
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// multer setup using memory storage
const storage = multer.memoryStorage(); // store files in memory as Buffer objects 
// (The buffer object contains contiguous binary data. Raw data is stored in instances of the Buffer class)
const upload = multer({storage});

router.post('/',upload.single('image'),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message:"no file uploaded"});
        }

        // function to upload image to cloudinary
        const streamUpload = (fileBuffer)=>{
            return new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream((error,result)=>{
                    if(result){
                        resolve(result);
                    }else{
                        reject(error);
                    }

                });

                // use streamifier to convert file buffer to stream and pipe it to cloudinary upload stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });

        };
        // Call the streamUpload function 
        const result = await streamUpload(req.file.buffer);
        res.json({imageUrl:result.secure_url});


    }catch(err){
        console.error(err);
        res.status(500).json({message:"server error"});
        

    };
});


module.exports = router;
