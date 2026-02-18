const mongoose =require('mongoose');

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('successfully connected')
    }
    catch(e){
        console.error('connection failed');
        process.exit(1);
    }
}

module.exports=connectDb;
