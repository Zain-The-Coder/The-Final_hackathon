import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Need Help', 'Can Help', 'Both'], 
        required: true // 
    },
    skills: [String], // 
    interests: [String], // 
    location: String, // 
    trustScore: { type: Number, default: 0 }, // Bonus feature [cite: 5]
    badges: [String] // [cite: 4]
}, { timestamps: true });

export default mongoose.model('User', userSchema);