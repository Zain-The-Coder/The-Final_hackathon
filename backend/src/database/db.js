import mongoose from "mongoose";
import config from "../config/config.js";
import chalk from "chalk";

const connectDB = async () => {
    try {
        if (!config.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        const conn = await mongoose.connect(config.MONGODB_URI);

        console.log(chalk.bold.green(`MongoDB Connected: ${conn.connection.host}`));

    } catch (error) {
        console.error(chalk.bold.red("Database Error:", error.message));
        process.exit(1);
    }
};

export default connectDB;