const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const products = require('./data/products');
const connectDB = require('./config/db');

// Load environment variables (which now contain your Atlas URI)
dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Product.deleteMany(); // Clear out any existing products
        await Product.insertMany(products); // Push dummy data to Atlas
        
        console.log('Data Imported Successfully to Cloud!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();