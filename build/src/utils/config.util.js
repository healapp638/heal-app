"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.handleFileSize = exports.tryCatchWrapper = exports.getEnvironmentParams = void 0;
// import rateLimit from 'express-rate-limit'
const app_constant_1 = require("../constants/app.constant");
const response_util_1 = require("./response.util");
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const multer_1 = __importDefault(require("multer"));
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//get params according to your environment
let isLocal = false;
const envNodeCode = process.env.ENV_NODE_CODE;
if (envNodeCode == "LOCAL") {
    isLocal = true;
}
const getEnvironmentParams = (env, project_name, project_initial) => {
    project_name = project_name.toUpperCase();
    const admin_email = project_name.toLowerCase();
    const initial_for_aws = project_initial.toUpperCase();
    const env_obj = {
        'PROD': {
            DB_NAME: `${initial_for_aws}_DB_NAME_PROD`,
            // DB_URI: `${initial_for_aws}_MONGODB_URI_PROD`,
            DB_URI: isLocal ? `${initial_for_aws}_MONGODB_URI_PROD_PUBLIC` : `${initial_for_aws}_MONGODB_URI_PROD_PRIVATE`,
            BUCKET: `${initial_for_aws}_BUCKET_PROD`,
            ADMIN_EMAIL: `admin${admin_email}@yopmail.com`,
            REGION: `${initial_for_aws}_REGION`,
            ACCESSID: `${initial_for_aws}_ACCESSID`,
            STMP_EMAIL: `${initial_for_aws}_STMP_EMAIL`,
            SMTP_API_KEY: `${initial_for_aws}_SMTP_API_KEY`,
            STRIPE_PB_KEY: `${initial_for_aws}_STRIPE_PB_KEY_PROD`,
            STRIPE_SEC_KEY: `${initial_for_aws}_STRIPE_SEC_KEY_PROD`,
        },
        'STAG': {
            DB_NAME: `${initial_for_aws}_DB_NAME_STAG`,
            DB_URI: `${initial_for_aws}_MONGODB_URI_STAG`,
            BUCKET: `${initial_for_aws}_BUCKET_STAG`,
            ADMIN_EMAIL: `admin${admin_email}@yopmail.com`,
            REGION: `${initial_for_aws}_REGION`,
            ACCESSID: `${initial_for_aws}_ACCESSID`,
            STMP_EMAIL: `${initial_for_aws}_STMP_EMAIL`,
            SMTP_API_KEY: `${initial_for_aws}_SMTP_API_KEY`,
            STRIPE_PB_KEY: `${initial_for_aws}_STRIPE_PB_KEY_STAGE`,
            STRIPE_SEC_KEY: `${initial_for_aws}_STRIPE_SEC_KEY_STAGE`,
        },
        'DEV': {
            DB_NAME: `${initial_for_aws}_DB_NAME_DEV`,
            // DB_URI: `${initial_for_aws}_MONGODB_URI_DEV`,
            DB_URI: isLocal ? `${initial_for_aws}_MONGODB_URI_DEV_PUBLIC` : `${initial_for_aws}_MONGODB_URI_DEV_PRIVATE`,
            BUCKET: `${initial_for_aws}_BUCKET_DEV`,
            ADMIN_EMAIL: `admin${admin_email}@yopmail.com`,
            REGION: `${initial_for_aws}_REGION`,
            ACCESSID: `${initial_for_aws}_ACCESSID`,
            STMP_EMAIL: `${initial_for_aws}_STMP_EMAIL`,
            SMTP_API_KEY: `${initial_for_aws}_SMTP_API_KEY`,
            STRIPE_PB_KEY: `${initial_for_aws}_STRIPE_PB_KEY_DEV`,
            STRIPE_SEC_KEY: `${initial_for_aws}_STRIPE_SEC_KEY_DEV`,
        },
    };
    return env_obj[env]; //return matched environment and send its object
};
exports.getEnvironmentParams = getEnvironmentParams;
// Define the rate limit options
// export const rateLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later',
//     statusCode: statusCodes.TOO_MANY_REQUESTS
// });
// Define your tryCatchWrapper function
const tryCatchWrapper = (func) => {
    return (...args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const result = yield func(...args);
            return result;
        }
        catch (err) {
            // Extract details
            const errorMessage = (err === null || err === void 0 ? void 0 : err.message) || 'UNKNOWN_ERROR';
            const errorStack = err === null || err === void 0 ? void 0 : err.stack;
            // Extract userId:
            let userId = 'unknown_user';
            if ((args === null || args === void 0 ? void 0 : args[1]) && typeof args[1] === 'string') {
                userId = args[1];
            }
            else if ((args === null || args === void 0 ? void 0 : args[0]) && typeof args[0] === 'string') {
                userId = args[0];
            }
            else if (((_a = args === null || args === void 0 ? void 0 : args[0]) === null || _a === void 0 ? void 0 : _a.user_id) && typeof ((_b = args[0]) === null || _b === void 0 ? void 0 : _b.user_id) === 'string') {
                userId = (_c = args[0]) === null || _c === void 0 ? void 0 : _c.user_id;
            }
            // Log the error
            logger_config_1.default.error(`[tryCatchWrapper] Error in ${(func === null || func === void 0 ? void 0 : func.name) || 'unknown_func'} for user ${userId}: ${errorMessage}`, {
                error: err,
                stack: errorStack,
                userId,
                payload: args,
            });
            return (0, response_util_1.showResponse)(false, (_d = err === null || err === void 0 ? void 0 : err.message) !== null && _d !== void 0 ? _d : err, null, statusCodes_1.default.SERVER_TRYCATCH_ERROR);
        }
    });
};
exports.tryCatchWrapper = tryCatchWrapper;
// Error handler middleware for handling file size limit exceeded error
const handleFileSize = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        // File size limit exceeded error
        return res.status(400).send({ message: `File size limit exceeded (Max: ${app_constant_1.APP.FILE_SIZE}MB)` });
    }
    next(err);
};
exports.handleFileSize = handleFileSize;
