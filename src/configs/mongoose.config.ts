
import mongoose from "mongoose";
import { DB } from "../constants/app.constant";
import logger from "../configs/logger.config";

export const connection = async () => {

  const MONGO_URI =  await DB.MONGODB_URI
  mongoose.Promise = global.Promise;

    try {
  await mongoose.connect(MONGO_URI as string, {} as mongoose.ConnectOptions)
      logger.info("MONGO_CONNECTED", {
      type: "mongodb",
      message: "MongoDB connection established",
    }
  );

  } catch (error: any) {
    logger.error("MONGO_CONNECTION_FAILED", {
      type: "mongodb",
      message: error.message,
      stack: error.stack,
    });
    process.exit(1); 
  }

}