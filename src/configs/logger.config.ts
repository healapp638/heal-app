import winston from 'winston';
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment"; 

const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'otp'];

const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    const sanitizedFields = { ...obj };
    for (const key in sanitizedFields) {
        if (sensitiveKeys.includes(key)) {
            sanitizedFields[key] = '***MASKED***';
        } else if (typeof sanitizedFields[key] === 'object') {
            sanitizedFields[key] = sanitizeObject(sanitizedFields[key]);
        }
    }
    return sanitizedFields;
};

const sanitize = (info: any) => {
    if (info.message && typeof info.message === 'object') {
        info.message = sanitizeObject(info.message);
    }

    const metadata = { ...info };
    delete metadata.message;
    delete metadata.level;
    delete metadata.timestamp;

    const sanitizedMetadata = sanitizeObject(metadata);

    return Object.assign(info, sanitizedMetadata);
};

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: () => moment.utc().format('YYYY-MM-DD HH:mm:ss [UTC]')}),
    winston.format((info) => sanitize(info))(),
    winston.format.json()
);

/* =========================
   FILTERS (KEY FIX)
========================= */

// Only access logs
const accessFilter = winston.format((info) => {
  return info.type === "access" ? info : false;
});

// Only error logs
const errorFilter = winston.format((info) => {
  return info.level === "error" ? info : false;
});

// Only app logs (exclude access)
const appFilter = winston.format((info) => {
  return info.type === "app" ? info : false;
});

// Only MongoDB logs
const mongoFilter = winston.format((info) => {
  return info.type === "mongodb" ? info : false;
});

//Process-level events,System signals,Resource warnings
const systemFilter = winston.format((info) => {
  return info.type === "system" ? info : false;
});

/* =========================
   🔄 ROTATION TRANSPORT
========================= */

const createRotateTransport = (
  folder: string,
  filename: string,
  filter: any,
  level?: string
) => {
  return new DailyRotateFile({
    dirname: `logs/${folder}`,
    filename: `${filename}-%DATE%.log`,
    datePattern: "YYYY-MM-DD",   // rotate daily
    // zippedArchive: true,         // compress old logs
    maxSize: "5m",               // rotate after 5MB
    maxFiles: "5d",              // keep logs for 5 days
    level: level,
    format: winston.format.combine(filter(), customFormat),
  });
};


/* =========================
   LOGGER INSTANCE
========================= */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: {
    service: "heal-api",
    env: process.env.ENV_MODE || "prod",
  },

  transports: [

    // 🔴 ERROR LOGS
    createRotateTransport("error","error", errorFilter, "error"),

    // 🟢 ACCESS LOGS
    createRotateTransport("access","access", accessFilter),

    // 🔵 APP LOGS
    createRotateTransport("app","app", appFilter),

    // 🟣 MONGODB LOGS
    createRotateTransport("mongodb","mongodb", mongoFilter),

    // ⚫ SYSTEM LOGS
    createRotateTransport("system","system", systemFilter),
  ],
});

export default logger;