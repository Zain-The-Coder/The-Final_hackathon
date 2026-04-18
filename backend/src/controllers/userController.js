import userModel from "../models/user.model.js";

export const getLeaderboard = async (req, res) => {
    try {
        const topHelpers = await User.find()
            .sort({ trustScore: -1 })
            .limit(10)
            .select('name trustScore badges role');
            
        res.json(topHelpers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};