import express from 'express';
import { login, register } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { createRequest, getRequests } from '../controllers/requestController.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/' , protect , createRequest);
authRoutes.get('/' , getRequests);

console.log("ENV CHECK:", process.env.MONGODB_URI);
export default authRoutes;