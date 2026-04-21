import 'dotenv/config'; // Must be first import so env vars load before other imports
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js'
import cookieParser from 'cookie-parser';
import authRouter from '../src/routes/authRoutes.js';
import helpRouter from '../src/routes/helpRoutes.js';
import userRouter from '../src/routes/userRoutes.js';
import chatRouter from '../src/routes/chatRoutes.js';
import notificationRouter from '../src/routes/notificationRoutes.js';
import analyticsRouter from '../src/routes/analyticsRoutes.js';
import adminRouter from '../src/routes/adminRoutes.js';

// MongoDB Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'https://the-final-hackathon.vercel.app' // Aapka Vercel wala link
];

app.use(cors({ 
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/help', helpRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

    
export default app;