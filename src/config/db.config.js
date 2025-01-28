import mongoose from "mongoose";
import DB_NAME from "../constants.js";

const connectDB = async () => {
    try {
        const dbInstance = await mongoose.connect(`${process.env.MONGOOSEDB_URL}/${DB_NAME}`);
        console.log("connection host : ",dbInstance.connection.host);
    } catch (error) {
        console.log("error while connecting db : ",error);
        process.exit(1);
    }
}

export default connectDB;