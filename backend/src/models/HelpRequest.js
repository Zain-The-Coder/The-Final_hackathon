import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Web Dev, UI/UX, Mobile [cite: 61]
    tags: [String], // AI Suggested tags yahan store honge [cite: 65]
    urgency: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    }, // AI detected urgency [cite: 110]
    status: { 
        type: String, 
        enum: ['Open', 'In-Progress', 'Solved'], 
        default: 'Open' 
    },
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of people who clicked "I can help" [cite: 70]
}, { timestamps: true });

export default mongoose.model('HelpRequest', helpRequestSchema);