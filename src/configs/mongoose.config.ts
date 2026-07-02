
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

 
// export const connection = async () => {
//   const MONGO_URI = await DB.MONGODB_URI;
//   // console.log(MONGO_URI,"MONGO_URI")
//   if (!MONGO_URI) {
//     throw new Error("MONGODB_URI is not configured. Check your secret manager feild");
//   }
//   if (
//   !MONGO_URI ||
//   (!MONGO_URI.startsWith("mongodb://") &&
//    !MONGO_URI.startsWith("mongodb+srv://"))
// ) {
//   logger.error("Invalid Mongo URI", {
//     uri: MONGO_URI,
//     type: "mongodb",
//   });

//   throw new Error("Invalid MongoDB URI");
// }
 
//   mongoose.Promise = global.Promise;
 
//   await mongoose.connect(MONGO_URI as string, {} as mongoose.ConnectOptions);
 
//   const db =  mongoose.connection;
// logger.info("MONGO_CONNECTED", {
//       type: "mongodb",
//       message: "MongoDB connection established",
//     });
 
//   // db.once("open", () => {
//   //   logger.info(`MongoDB connection established`);
//   // });
 
//   db.on("error", (error) => {
//     logger.error(`MongoDB connection error mongo uri:${MONGO_URI}`, { error: error.message, type: "mongodb" });
//   });
 
//   db.on("disconnected", () => {
//     logger.warn("MongoDB disconnected", { type: "mongodb" });
//   });
 
//   db.on("reconnected", () => {
//     logger.info("MongoDB reconnected", { type: "mongodb" });
//   });
// };
 
 