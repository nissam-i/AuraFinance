const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Security Headers
app.use(helmet());

// CORS - Allow Client
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.74.214:8081', 'http://localhost:8081'], // Allow 5173, 5174, and Mobile
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Dev Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/payments', require('./routes/payments'));

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
