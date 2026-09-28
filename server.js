const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./backend/config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'https://shopvibe-ecommerce-nine.vercel.app', // Your exact Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parses incoming JSON payloads

// Basic Health Route
app.get('/', (req, res) => {
    res.send('E-Commerce API is running...');
});

// Import Routes
const authRoutes = require('./backend/routes/authRoutes');

// Mount Routes
app.use('/api/users', authRoutes);

const productRoutes = require('./backend/routes/productRoutes');

// Mount Routes
app.use('/api/products', productRoutes);

const orderRoutes = require('./backend/routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});