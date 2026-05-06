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
const path_1 = __importDefault(require("path"));
const config_util_1 = require("../utils/config.util");
const envConfig = dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
if (envConfig.error) {
    console.log("noenvfileee");
    throw new Error("No .Env File Found");
}
//1st parm is Environment mode -> DEV,PROD,STAG 
//2nd parm is project name 
//3rd parm is project Initial 
const ENV_PARMAS = (0, config_util_1.getEnvironmentParams)(process.env.ENV_MODE, 'HEAL', 'HL'); //sds
console.log(ENV_PARMAS, "Parms_For_Aws_Parameter_store");
const { ADMIN_EMAIL, ACCESSID, REGION, DB_URI, BUCKET, JWT_SECRET, GOOGLE_TRANSLATE_API_KEY } = ENV_PARMAS;
let AGORA_CREDENTIAL;
let AWS_CREDENTIAL;
let STRIPE_CREDENTIAL;
const APP = {
    ACCESS_EXPIRY: "30m",
    REFRESH_EXPIRY: "7d",
    PORT: process.env.PORT || 8000,
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
};
exports.APP = APP;
const DATABASE_URI = {
    ENV_MODE: process.env.ENV_MODE || 'DEV',
    ENV_NODE_CODE: process.env.ENV_NODE_CODE || 'LOCAL',
};
exports.DATABASE_URI = DATABASE_URI;
const DB = {
    DB_NAME: process.env.DB_NAME || '',
    MONGODB_URI: '',
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
    URI: "127.0.0.1",
    PORT: 6379,
};
exports.REDIS_CREDENTIAL = REDIS_CREDENTIAL;
//***** MAKE SURE FOR  DEV, PROD, AND STAGE ENVIOREMENENT USER ENV_PARMAS THAT ABOVE SHOWS AND SAVE IT IN AWS WITH SAME NAME  ******/
// const initializeAwsCredential = async () => {
//   //call this function when paramters are stored to aws 
//   DB.MONGODB_URI = services.awsService.getSecretFromAWS(DB_URI)
//   APP.JWT_SECRET = services.awsService.getSecretFromAWS("API_SECRET")
//   EMAIL_CREDENTIAL.SMTP_EMAIL = services.awsService.getSecretFromAWS(STMP_EMAIL)
//   EMAIL_CREDENTIAL.SMTP_API_KEY = services.awsService.getSecretFromAWS(SMTP_API_KEY)
//   AWS_CREDENTIAL = {
//     ACCESSID: services.awsService.getParameterFromAWS({ name: ACCESSID }),
//     REGION: services.awsService.getParameterFromAWS({ name: REGION }),
//     AWS_SECRET: services.awsService.getSecretFromAWS("heal_secret"),
//     BUCKET_NAME: services.awsService.getParameterFromAWS({ name: BUCKET }),
//     COLLECTION_ID_AWS_REKOGNITION: process.env.COLLECTION_ID_AWS_REKOGNITION, //use it if want to use image search in project
//   };
//   //************If Twilio Used In Project**************** */
//   // SMS_CREDENTIAL.TWILIO_ACCOUNT_SID = services.awsService.getSecretFromAWS('TWILIO_ACCOUNT_SID')
//   // SMS_CREDENTIAL.TWILIO_AUTH_TOKEN = services.awsService.getSecretFromAWS('TWILIO_AUTH_TOKEN')
//   //************If Stripe Used In Project**************** */
//   // STRIPE_CREDENTIAL = {
//   //   STRIPE_PB_KEY: services.awsService.getParameterFromAWS({ name: ENV_PARMAS.STRIPE_PB_KEY }),
//   //   STRIPE_SEC_KEY: services.awsService.getParameterFromAWS({ name: ENV_PARMAS.STRIPE_SEC_KEY }),
//   //   STRIPE_VERSION: '2024-04-10'
//   // };
// }
//***** MAKE SURE FOR  DEV, PROD, AND STAGE ENVIOREMENENT USER ENV_PARMAS THAT ABOVE SHOWS AND SAVE IT IN AWS WITH SAME NAME  ******/
const initializeAwsCredential = () => __awaiter(void 0, void 0, void 0, function* () {
    console.time("AWS_CREDENTIAL_INIT");
    console.log("Initializing AWS credentials in parallel...");
    try {
        // call this function when parameters are stored to aws
        const results = yield Promise.all([
            services_1.default.awsService.getSecretFromAWS(DB_URI),
            services_1.default.awsService.getSecretFromAWS(JWT_SECRET),
            services_1.default.awsService.getParameterFromAWS({ name: ACCESSID }),
            services_1.default.awsService.getParameterFromAWS({ name: REGION }),
            services_1.default.awsService.getSecretFromAWS("heal_secret"),
            services_1.default.awsService.getParameterFromAWS({ name: BUCKET }),
            services_1.default.awsService.getParameterFromAWS({ name: GOOGLE_TRANSLATE_API_KEY }),
            // services.awsService.getSecretFromAWS(CLOUDFRONT_URL),
            // services.awsService.getSecretFromAWS(SWAGGER_USER_NAME),
            // services.awsService.getSecretFromAWS(SWAGGER_PASSWORD),
            // services.awsService.getSecretFromAWS(STMP_EMAIL),
            // services.awsService.getSecretFromAWS(SMTP_API_KEY),
            // services.awsService.getSecretFromAWS(STRIPE_PB_KEY),
            // services.awsService.getSecretFromAWS(STRIPE_SEC_KEY),
        ]);
        const [mongodbUri, jwtSecret, accessId, region, awsSecret, bucketName
        // swaggerUserName,
        // swaggerPassword,
        // smtpEmail,
        // cloudfrontUrl,
        // smtpApiKey,
        // stripePbKey,
        // stripeSecKey,
        ] = results;
        // console.log("hhhhhhh", bucketName)
        DB.MONGODB_URI = mongodbUri;
        APP.JWT_SECRET = jwtSecret;
        // APP.CLOUDFRONT_URL = cloudfrontUrl;
        // APP.SWAGGER_USER_NAME = swaggerUserName;
        // APP.SWAGGER_PASSWORD = swaggerPassword;
        // EMAIL_CREDENTIAL.SMTP_EMAIL = smtpEmail;
        // EMAIL_CREDENTIAL.SMTP_API_KEY = smtpApiKey;
        // STRIPE_CREDENTIAL.STRIPE_PB_KEY = stripePbKey;
        // STRIPE_CREDENTIAL.STRIPE_SEC_KEY = stripeSecKey;
        exports.AWS_CREDENTIAL = AWS_CREDENTIAL = {
            ACCESSID: accessId,
            REGION: region,
            AWS_SECRET: awsSecret,
            BUCKET_NAME: bucketName,
        };
        console.log("AWS credentials initialized successfully.");
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
