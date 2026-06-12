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
    const MONGO_URI = app_constant_1.DB.MONGODB_URI;
    console.log(MONGO_URI, "MONGODB_URIiiii");
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
        process.exit(1); // crash → infra should restart
    }
    const db = mongoose_1.default.connection;
    db.on("error", (error) => {
        logger_config_1.default.error("MONGO_RUNTIME_ERROR", {
            type: "mongodb",
            message: error.message,
            stack: error.stack,
        });
    });
    db.on("disconnected", () => {
        logger_config_1.default.warn("MONGO_DISCONNECTED", {
            type: "mongodb",
            message: "MongoDB disconnected",
        });
    });
    db.on("reconnected", () => {
        logger_config_1.default.info("MONGO_RECONNECTED", {
            type: "mongodb",
            message: "MongoDB reconnected",
        });
    });
});
exports.connection = connection;
