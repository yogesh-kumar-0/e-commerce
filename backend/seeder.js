const mongoose=require('mongoose');
const dotenv =require('dotenv');

const Product =require('./models/Product');

const User = require('./models/User');

const Cart = require('./models/Cart');


const products =require('./data/products');

dotenv.config();

//connect to mongodb database

mongoose.connect(process.env.MONGO_URL);


// function to seed data

const seedData=async()=>{
    try{
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //create a default admin user
        const createdUser =await User.create({
            name:'ADMIN user',
            email:'bcasjb@email.com',
            password:'123456',
            role:'admin',
        });
        //assign the default user id to each product
        const userID = createdUser._id;

        const sampleProducts = products.map((product)=>{
            return {...product,user: userID};
        });

        //INSERT the products into database
        await Product.insertMany(sampleProducts);

        console.log('product data seeded successfully')
        process.exit();
    }
    catch(err){
        console.error('error in seeding the data',err);

        process.exit(1)

    };
}

seedData();
