"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.affirmationQueue = exports.excelQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const app_constant_1 = require("../constants/app.constant");
const connection = new ioredis_1.default({
    host: app_constant_1.REDIS_CREDENTIAL.REDIS_HOST,
    port: app_constant_1.REDIS_CREDENTIAL.PORT,
});
exports.excelQueue = new bullmq_1.Queue("excel-import", {
    connection,
});
exports.affirmationQueue = new bullmq_1.Queue("affirmation-import", {
    connection,
});
