import mongoose from "mongoose";
import { logError } from "../helpers/errorHelpers";

export default async function connectToDb(connectionString: string) {
    try {
        await mongoose.connect(connectionString);
        console.log("Database connected successfully!");
    } catch (err) {
        logError(502, "Database connection failed", "connectToDb");
    }
}
