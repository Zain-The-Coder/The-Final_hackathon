import HelpRequest from '../models/HelpRequest.js';
import { analyzeRequest } from '../utils/aiAssistant.js';
import userModel from '../models/user.model.js';
export const createRequest = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const { tags, category, urgency } = analyzeRequest(description);

        const newRequest = await HelpRequest.create({
            user: req.user.id, 
            title,
            description,
            category,
            tags,
            urgency
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRequests = async (req, res) => {
    try {
        const requests = await HelpRequest.find()
            .populate('user', 'name role')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsSolved = async (req, res) => {
    try {
        const { requestId, helperId } = req.body;

        const request = await HelpRequest.findById(requestId);

        // Sirf request bananay wala hi isay solved mark kar sakta hai
        if (request.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        request.status = 'Solved';
        await request.save();

        // Helper ka Trust Score barhayen (Bonus Twist)
        if (helperId) {
            const helper = await User.findById(helperId);
            helper.trustScore += 10; // Har help par 10 points
            
            // Badges logic (Optional but looks premium)
            if (helper.trustScore >= 50) helper.badges.push('Community Hero');
            
            await helper.save();
        }

        res.json({ message: "Request marked as solved, points awarded!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};