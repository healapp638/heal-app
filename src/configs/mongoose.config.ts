
import mongoose from "mongoose";
import { DB } from "../constants/app.constant";
import logger from "../configs/logger.config";

export const connection = async () => {

  const MONGO_URI =  await DB.MONGODB_URI
  // console.log(MONGO_URI,"MONGODB_URIiiii")
  mongoose.Promise = global.Promise;

    try {
  await mongoose.connect(MONGO_URI as string, {} as mongoose.ConnectOptions)
      logger.info("MONGO_CONNECTED", {
      type: "mongodb",
      message: "MongoDB connection established",
    });

  } catch (error: any) {
    logger.error("MONGO_CONNECTION_FAILED", {
      type: "mongodb",
      message: error.message,
      stack: error.stack,
    });

    process.exit(1); // crash → infra should restart
  }
  const db = mongoose.connection;

  db.on("error", (error) => {
    logger.error("MONGO_RUNTIME_ERROR", {
      type: "mongodb",
      message: error.message,
      stack: error.stack,
    });
  });

  db.on("disconnected", () => {
    logger.warn("MONGO_DISCONNECTED", {
      type: "mongodb",
      message: "MongoDB disconnected",
    });
  });

  db.on("reconnected", () => {
    logger.info("MONGO_RECONNECTED", {
      type: "mongodb",
      message: "MongoDB reconnected",
    });
  });

}