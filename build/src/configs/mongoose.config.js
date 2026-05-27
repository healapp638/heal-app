"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_constant_1 = require("../constants/app.constant");
const { ENV_MODE, ENV_NODE_CODE } = app_constant_1.DATABASE_URI;
const config = {
    DEV: {
        LOCAL: 'mongodb://HealApp_Dev:HealDev_1077@34.230.216.184/HealApp_Dev',
        SERVER: 'mongodb://HealApp_Dev:HealDev_1077@localhost/HealApp_Dev'
    },
    PROD: {
        LOCAL: 'mongodb://HealApp_Prod:HealProd_1077@34.230.216.184/HealApp_Prod',
        SERVER: 'mongodb://HealApp_Prod:HealProd_1077@localhost/HealApp_Prod'
    }
};
const dbURI = config[ENV_MODE][ENV_NODE_CODE] || 'mongodb://localhost:27017/HealApp_local';
console.log(dbURI, '<<<<<<<<<<<<<<<<<<<<____________________dbURI=+++++++++++++++++++++>>>>>>>');
const connection = () => __awaiter(void 0, void 0, void 0, function* () {
    const MONGO_URI = dbURI;
    if (!MONGO_URI) {
        throw new Error("MONGODB_URI is not defined or empty. Please check AWS Parameter Store or .env file.");
    }
    mongoose_1.default.Promise = global.Promise;
    yield mongoose_1.default.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, heartbeatFrequencyMS: 2000, });
    const db = mongoose_1.default.connection;
    db.once('open', () => {
        console.log("connection established", MONGO_URI);
    });
    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });
});
exports.connection = connection;
// // import mongoose from "mongoose";
// // import { DB } from "../constants/app.constant";
// // import logger from "../configs/logger.config";
// // export const connection = async () => {
// //   const MONGO_URI =  DB.MONGODB_URI
// //   console.log(MONGO_URI, "MONGODB_URIiiii")
// //   mongoose.Promise = global.Promise;
// //     try {
// //   await mongoose.connect(MONGO_URI as string, {} as mongoose.ConnectOptions)
// //       logger.info("MONGO_CONNECTED", {
// //       type: "mongodb",
// //       message: "MongoDB connection established",
// //     });
// //   } catch (error: any) {
// //     logger.error("MONGO_CONNECTION_FAILED", {
// //       type: "mongodb",
// //       message: error.message,
// //       stack: error.stack,
// //     });
// //     process.exit(1); // crash → infra should restart
// //   }
// //   const db = mongoose.connection;
// //   db.on("error", (error) => {
// //     logger.error("MONGO_RUNTIME_ERROR", {
// //       type: "mongodb",
// //       message: error.message,
// //       stack: error.stack,
// //     });
// //   });
// //   db.on("disconnected", () => {
// //     logger.warn("MONGO_DISCONNECTED", {
// //       type: "mongodb",
// //       message: "MongoDB disconnected",
// //     });
// //   });
// //   db.on("reconnected", () => {
// //     logger.info("MONGO_RECONNECTED", {
// //       type: "mongodb",
// //       message: "MongoDB reconnected",
// //     });
// //   });
// }
