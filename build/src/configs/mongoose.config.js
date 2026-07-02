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
// export const connection = async () => {
//   const MONGO_URI =  await DB.MONGODB_URI
//   mongoose.Promise = global.Promise;
//     try {
//   await mongoose.connect(MONGO_URI as string, {} as mongoose.ConnectOptions)
//       logger.info("MONGO_CONNECTED", {
//       type: "mongodb",
//       message: "MongoDB connection established",
//     }
//   );
//   } catch (error: any) {
//     logger.error("MONGO_CONNECTION_FAILED", {
//       type: "mongodb",
//       message: error.message,
//       stack: error.stack,
//     });
//     process.exit(1); 
//   }
// }
const connection = () => __awaiter(void 0, void 0, void 0, function* () {
    const MONGO_URI = yield app_constant_1.DB.MONGODB_URI;
    // console.log(MONGO_URI,"MONGO_URI")
    if (!MONGO_URI) {
        throw new Error("MONGODB_URI is not configured. Check your secret manager feild");
    }
    if (!MONGO_URI ||
        (!MONGO_URI.startsWith("mongodb://") &&
            !MONGO_URI.startsWith("mongodb+srv://"))) {
        logger_config_1.default.error("Invalid Mongo URI", {
            uri: MONGO_URI,
            type: "mongodb",
        });
        throw new Error("Invalid MongoDB URI");
    }
    mongoose_1.default.Promise = global.Promise;
    yield mongoose_1.default.connect(MONGO_URI, {});
    const db = mongoose_1.default.connection;
    logger_config_1.default.info("MONGO_CONNECTED", {
        type: "mongodb",
        message: "MongoDB connection established",
    });
    // db.once("open", () => {
    //   logger.info(`MongoDB connection established`);
    // });
    db.on("error", (error) => {
        logger_config_1.default.error(`MongoDB connection error mongo uri:${MONGO_URI}`, { error: error.message, type: "mongodb" });
    });
    db.on("disconnected", () => {
        logger_config_1.default.warn("MongoDB disconnected", { type: "mongodb" });
    });
    db.on("reconnected", () => {
        logger_config_1.default.info("MongoDB reconnected", { type: "mongodb" });
    });
});
exports.connection = connection;
