const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'], // Allow multiple Vite ports
  credentials: true
}));

const { MongoMemoryServer } = require('mongodb-memory-server');

const startServer = async () => {
    try {
        console.log('Starting Embedded MongoDB Database...');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri);
        console.log('Connected to Embedded MongoDB Memory Server successfully!');

        // Routes
        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/expenses', require('./routes/expenseRoutes'));
        app.use('/api/categories', require('./routes/categoryRoutes'));

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start embedded database:', err);
    }
};

startServer();
