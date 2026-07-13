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
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const connection = () => __awaiter(void 0, void 0, void 0, function* () {
    const MONGO_URI = yield app_constant_1.DB.MONGODB_URI;
    mongoose_1.default.Promise = global.Promise;
    try {
        yield mongoose_1.default.connect(MONGO_URI, {});
        logger_config_1.default.info("MONGO_CONNECTED", {
            type: "mongodb",
            message: "MongoDB connection established",
        });
    }
    catch (error) {
        logger_config_1.default.error("MONGO_CONNECTION_FAILED", {
            type: "mongodb",
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
});
exports.connection = connection;
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
