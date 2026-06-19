import services from "../services";
import dotenv from "dotenv";
// import path from "path";
import { AwsCredential, AppConstant, DbConstant, EmailConstant, SMSConstant, StripeCredential, AgoraCredential } from "../utils/interfaces.util";
import { getEnvironmentParams } from "../utils/config.util";
const envConfig = dotenv.config();

if (envConfig.error) {
  console.log("noenvfileee")
  throw new Error("No .Env File Found");
}

//1st parm is Environment mode -> DEV,PROD,STAG 
//2nd parm is project name 
//3rd parm is project Initial 
const ENV_PARMAS = getEnvironmentParams(process.env.ENV_MODE, 'HEAL', 'HL')//sds


const {ADMIN_EMAIL,ACCESSID,REGION,DB_URI,BUCKET,JWT_SECRET,STMP_EMAIL,SMTP_API_KEY} = ENV_PARMAS
let AGORA_CREDENTIAL: AgoraCredential
let AWS_CREDENTIAL: AwsCredential
let STRIPE_CREDENTIAL: StripeCredential

const APP: AppConstant = {
  ACCESS_EXPIRY: "30m",
  REFRESH_EXPIRY: "7d",
  PORT: process.env.PORT || 3000,
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

const DATABASE_URI = {
  ENV_MODE: process.env.ENV_MODE || 'DEV',
  ENV_NODE_CODE: process.env.ENV_NODE_CODE || 'LOCAL',

}

const DB: DbConstant = {
  DB_NAME: process.env.DB_NAME || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
};


const EMAIL_CREDENTIAL: EmailConstant = {
  SMTP_EMAIL: process.env.SMTP_EMAIL || '',
  SMTP_API_KEY: process.env.SMTP_API_KEY || '',
  EMAIL_HOST: process.env.EMAIL_HOST || '',
}

const SMS_CREDENTIAL: SMSConstant = {
  TWILIO_ACCOUNT_SID: '',
  TWILIO_AUTH_TOKEN: '',
  SEND_FROM_HOST: process.env.SEND_FROM_HOST || '',
}

const LOGS = {
  morgan: process.env.MORGAN,
};

const REDIS_CREDENTIAL = {
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  PORT: Number(process.env.REDIS_PORT) || 6379
};


//***** MAKE SURE FOR  DEV, PROD, AND STAGE ENVIOREMENENT USER ENV_PARMAS THAT ABOVE SHOWS AND SAVE IT IN AWS WITH SAME NAME  ******/
const initializeAwsCredential = async () => {
  try {
    // call this function when parameters are stored to aws
    const results = await Promise.all([
      services.awsService.getSecretFromAWS(DB_URI),
      services.awsService.getSecretFromAWS(JWT_SECRET),
      services.awsService.getParameterFromAWS({ name: ACCESSID }),
      services.awsService.getParameterFromAWS({ name: REGION }),
      services.awsService.getSecretFromAWS("heal_secret"),
      services.awsService.getParameterFromAWS({ name: BUCKET }),
      // services.awsService.getSecretFromAWS(GOOGLE_TRANSLATE_API_KEY),
      services.awsService.getSecretFromAWS("OPENAI_API_KEY"),
      services.awsService.getSecretFromAWS("REVENUECAT_API_KEY"),
      services.awsService.getSecretFromAWS("REVENUECAT_WEBHOOK_SECRET"),
      services.awsService.getSecretFromAWS("HL_GOOGLE_TRANSLATE_API_KEY"),
      services.awsService.getParameterFromAWS({ name: STMP_EMAIL }),
      services.awsService.getParameterFromAWS({ name: SMTP_API_KEY }),
    ]);

    
    const [ mongodbUri,jwtSecret,accessId,region,awsSecret,bucketName,openaiApiKey,revenueCatApiKey,
      revenueCatWebhookSecret,hlGoogleTranslateApiKey,smtpEmail,smtpApiKey,
    ] = results;
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
    AWS_CREDENTIAL = {
      ACCESSID: accessId,
      REGION: region,
      AWS_SECRET: awsSecret,
      BUCKET_NAME: bucketName,
    };
    console.log("AWS credentials initialized successfully.")
    // console.log(APP.HL_GOOGLE_TRANSLATE_API_KEY,"APP.HL_GOOGLE_TRANSLATE_API_KEY")
  } catch (error) {
    console.error("Error initializing AWS credentials:", error)
    throw error; // Rethrow to prevent server from starting with invalid config
  } finally {
    console.log("AWS_CREDENTIAL_INIT")
  }
}

export {
  STRIPE_CREDENTIAL,
  DB,
  APP,
  REDIS_CREDENTIAL,
  LOGS,
  AWS_CREDENTIAL,
  EMAIL_CREDENTIAL,
  SMS_CREDENTIAL,
  AGORA_CREDENTIAL,
  initializeAwsCredential,
  DATABASE_URI
};
