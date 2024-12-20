// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import accountRoutes from './routes/accountRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Custom middleware to handle CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, phone-number, merchant-id');
    res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization, phone-number, merchant-id');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'phone-number', 'merchant-id'],
    exposedHeaders: ['Content-Type', 'Authorization', 'phone-number', 'merchant-id'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Add a middleware to handle preflight requests
app.options('*', cors());

// Routes
app.use("/auth", authRoutes);
app.use("/loans", loanRoutes);
app.use("/transactions", transactionRoutes);
app.use("/account", accountRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const port = process.env.PORT || 5021;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
