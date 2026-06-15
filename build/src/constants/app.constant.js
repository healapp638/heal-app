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
exports.DATABASE_URI = exports.initializeAwsCredential = exports.AGORA_CREDENTIAL = exports.SMS_CREDENTIAL = exports.EMAIL_CREDENTIAL = exports.AWS_CREDENTIAL = exports.LOGS = exports.REDIS_CREDENTIAL = exports.APP = exports.DB = exports.STRIPE_CREDENTIAL = void 0;
const services_1 = __importDefault(require("../services"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_util_1 = require("../utils/config.util");
const envConfig = dotenv_1.default.config();
if (envConfig.error) {
    console.log("noenvfileee");
    throw new Error("No .Env File Found");
}
//1st parm is Environment mode -> DEV,PROD,STAG 
//2nd parm is project name 
//3rd parm is project Initial 
const ENV_PARMAS = (0, config_util_1.getEnvironmentParams)(process.env.ENV_MODE, 'HEAL', 'HL'); //sds
const { ADMIN_EMAIL, ACCESSID, REGION, DB_URI, BUCKET, JWT_SECRET, STMP_EMAIL, SMTP_API_KEY } = ENV_PARMAS;
let AGORA_CREDENTIAL;
let AWS_CREDENTIAL;
let STRIPE_CREDENTIAL;
const APP = {
    ACCESS_EXPIRY: "30m",
    REFRESH_EXPIRY: "7d",
    PORT: process.env.PORT || 3001,
    API_PREFIX: process.env.API_PREFIX || "/api/v1",
    FRONTEND_URL: process.env.FRONTEND_URL || '',
    BITBUCKET_URL: process.env.BITBUCKET_URL || '',
    OUTPUT_BITBUCKET_URL: process.env.OUTPUT_BITBUCKET_URL || '',
    JWT_SECRET: process.env.SECRET || "secretOrangeLionShadowPaperFrostWindowGloveSkyrocket",
    ADMIN_CRED_EMAIL: ADMIN_EMAIL,
    FILE_SIZE: 100, //SPECIFY IN MB
    PROJECT_NAME: 'Heal',
    PROJECT_LOGO: 'file/file-1735634891680.webp',
    AWS_REGION: 'us-east-1',
    SWAGGER_USER_NAME: 'admin',
    SWAGGER_PASSWORD: 'Admin@123',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    REVENUECAT_API_KEY: process.env.REVENUECAT_API_KEY || '',
    REVENUECAT_WEBHOOK_SECRET: process.env.REVENUECAT_WEBHOOK_SECRET || '',
    HL_GOOGLE_TRANSLATE_API_KEY: process.env.HL_GOOGLE_TRANSLATE_API_KEY || '',
};
exports.APP = APP;
const DATABASE_URI = {
    ENV_MODE: process.env.ENV_MODE || 'DEV',
    ENV_NODE_CODE: process.env.ENV_NODE_CODE || 'LOCAL',
};
exports.DATABASE_URI = DATABASE_URI;
const DB = {
    DB_NAME: process.env.DB_NAME || '',
    MONGODB_URI: process.env.MONGODB_URI || '',
};
exports.DB = DB;
const EMAIL_CREDENTIAL = {
    SMTP_EMAIL: process.env.SMTP_EMAIL || '',
    SMTP_API_KEY: process.env.SMTP_API_KEY || '',
    EMAIL_HOST: process.env.EMAIL_HOST || '',
};
exports.EMAIL_CREDENTIAL = EMAIL_CREDENTIAL;
const SMS_CREDENTIAL = {
    TWILIO_ACCOUNT_SID: '',
    TWILIO_AUTH_TOKEN: '',
    SEND_FROM_HOST: process.env.SEND_FROM_HOST || '',
};
exports.SMS_CREDENTIAL = SMS_CREDENTIAL;
const LOGS = {
    morgan: process.env.MORGAN,
};
exports.LOGS = LOGS;
const REDIS_CREDENTIAL = {
    REDIS_HOST: process.env.REDIS_HOST || 'redis',
    PORT: Number(process.env.REDIS_PORT) || 6379
};
exports.REDIS_CREDENTIAL = REDIS_CREDENTIAL;
//***** MAKE SURE FOR  DEV, PROD, AND STAGE ENVIOREMENENT USER ENV_PARMAS THAT ABOVE SHOWS AND SAVE IT IN AWS WITH SAME NAME  ******/
const initializeAwsCredential = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // call this function when parameters are stored to aws
        const results = yield Promise.all([
            services_1.default.awsService.getSecretFromAWS(DB_URI),
            services_1.default.awsService.getSecretFromAWS(JWT_SECRET),
            services_1.default.awsService.getParameterFromAWS({ name: ACCESSID }),
            services_1.default.awsService.getParameterFromAWS({ name: REGION }),
            services_1.default.awsService.getSecretFromAWS("heal_secret"),
            services_1.default.awsService.getParameterFromAWS({ name: BUCKET }),
            // services.awsService.getSecretFromAWS(GOOGLE_TRANSLATE_API_KEY),
            services_1.default.awsService.getSecretFromAWS("OPENAI_API_KEY"),
            services_1.default.awsService.getSecretFromAWS("REVENUECAT_API_KEY"),
            services_1.default.awsService.getSecretFromAWS("REVENUECAT_WEBHOOK_SECRET"),
            services_1.default.awsService.getSecretFromAWS("HL_GOOGLE_TRANSLATE_API_KEY"),
            services_1.default.awsService.getParameterFromAWS({ name: STMP_EMAIL }),
            services_1.default.awsService.getParameterFromAWS({ name: SMTP_API_KEY }),
        ]);
        const [mongodbUri, jwtSecret, accessId, region, awsSecret, bucketName, openaiApiKey, revenueCatApiKey, revenueCatWebhookSecret, hlGoogleTranslateApiKey, smtpEmail, smtpApiKey,] = results;
        DB.MONGODB_URI = mongodbUri;
        APP.JWT_SECRET = jwtSecret;
        APP.OPENAI_API_KEY = openaiApiKey || APP.OPENAI_API_KEY;
        APP.REVENUECAT_API_KEY = revenueCatApiKey || APP.REVENUECAT_API_KEY;
        APP.REVENUECAT_WEBHOOK_SECRET = revenueCatWebhookSecret || APP.REVENUECAT_WEBHOOK_SECRET;
        // APP.GOOGLE_TRANSLATE_API_KEY = googleTranslateApiKey;
        APP.OPENAI_API_KEY = openaiApiKey || APP.OPENAI_API_KEY;
        APP.HL_GOOGLE_TRANSLATE_API_KEY = hlGoogleTranslateApiKey;
        EMAIL_CREDENTIAL.SMTP_EMAIL = smtpEmail;
        EMAIL_CREDENTIAL.SMTP_API_KEY = smtpApiKey;
        exports.AWS_CREDENTIAL = AWS_CREDENTIAL = {
            ACCESSID: accessId,
            REGION: region,
            AWS_SECRET: awsSecret,
            BUCKET_NAME: bucketName,
        };
        console.log("AWS credentials initialized successfully.");
        // console.log(APP.HL_GOOGLE_TRANSLATE_API_KEY,"APP.HL_GOOGLE_TRANSLATE_API_KEY")
    }
    catch (error) {
        console.error("Error initializing AWS credentials:", error);
        throw error; // Rethrow to prevent server from starting with invalid config
    }
    finally {
        console.timeEnd("AWS_CREDENTIAL_INIT");
    }
});
exports.initializeAwsCredential = initializeAwsCredential;
