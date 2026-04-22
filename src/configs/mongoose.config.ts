import mongoose from "mongoose";
import { DB } from "../constants/app.constant";

export const connection = async () => {

  const MONGO_URI = await DB.MONGODB_URI

  if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not defined or empty. Please check AWS Parameter Store or .env file.");
  }

  mongoose.Promise = global.Promise;

  await mongoose.connect(MONGO_URI as string, {} as mongoose.ConnectOptions)

  const db = mongoose.connection;

  db.once('open', () => {
    console.log("connection established", MONGO_URI);
  });

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
}