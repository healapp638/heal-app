"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const moment_1 = __importDefault(require("moment"));
const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'otp'];
const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null)
        return obj;
    const sanitizedFields = Object.assign({}, obj);
    for (const key in sanitizedFields) {
        if (sensitiveKeys.includes(key)) {
            sanitizedFields[key] = '***MASKED***';
        }
        else if (typeof sanitizedFields[key] === 'object') {
            sanitizedFields[key] = sanitizeObject(sanitizedFields[key]);
        }
    }
    return sanitizedFields;
};
const sanitize = (info) => {
    if (info.message && typeof info.message === 'object') {
        info.message = sanitizeObject(info.message);
    }
    const metadata = Object.assign({}, info);
    delete metadata.message;
    delete metadata.level;
    delete metadata.timestamp;
    const sanitizedMetadata = sanitizeObject(metadata);
    return Object.assign(info, sanitizedMetadata);
};
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: () => moment_1.default.utc().format('YYYY-MM-DD HH:mm:ss [UTC]') }), winston_1.default.format((info) => sanitize(info))(), winston_1.default.format.json());
/* =========================
   FILTERS (KEY FIX)
========================= */
// Only access logs
const accessFilter = winston_1.default.format((info) => {
    return info.type === "access" ? info : false;
});
// Only error logs
const errorFilter = winston_1.default.format((info) => {
    return info.level === "error" ? info : false;
});
// Only app logs (exclude access)
const appFilter = winston_1.default.format((info) => {
    return info.type === "app" ? info : false;
});
// Only MongoDB logs
const mongoFilter = winston_1.default.format((info) => {
    return info.type === "mongodb" ? info : false;
});
//Process-level events,System signals,Resource warnings
const systemFilter = winston_1.default.format((info) => {
    return info.type === "system" ? info : false;
});
/* =========================
   🔄 ROTATION TRANSPORT
========================= */
const createRotateTransport = (folder, filename, filter, level) => {
    return new winston_daily_rotate_file_1.default({
        dirname: `logs/${folder}`,
        filename: `${filename}-%DATE%.log`,
        auditFile: `logs/${folder}/.${filename}-audit.json`,
        datePattern: "YYYY-MM-DD", // rotate daily
        // zippedArchive: true,         // compress old logs
        maxSize: "5m", // rotate after 5MB
        maxFiles: "5d", // keep logs for 5 days
        level: level,
        format: winston_1.default.format.combine(filter(), customFormat),
    });
};
/* =========================
   LOGGER INSTANCE
========================= */
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "info",
    defaultMeta: {
        service: "heal-api",
        env: process.env.ENV_MODE || "dev",
    },
    transports: [
        // 🔴 ERROR LOGS
        createRotateTransport("error", "error", errorFilter, "error"),
        // 🟢 ACCESS LOGS
        createRotateTransport("access", "access", accessFilter),
        // 🔵 APP LOGS
        createRotateTransport("app", "app", appFilter),
        // 🟣 MONGODB LOGS
        createRotateTransport("mongodb", "mongodb", mongoFilter),
        // ⚫ SYSTEM LOGS
        createRotateTransport("system", "system", systemFilter),
    ],
});
exports.default = logger;
