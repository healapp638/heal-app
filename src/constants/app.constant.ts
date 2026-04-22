import services from "../services";
import dotenv from "dotenv";
import path from "path";
import { AwsCredential, AppConstant, DbConstant, EmailConstant, SMSConstant, StripeCredential, AgoraCredential } from "../utils/interfaces.util";
import { getEnvironmentParams } from "../utils/config.util";
const envConfig = dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (envConfig.error) {
  console.log("noenvfileee")
  throw new Error("No .Env File Found");
}

//1st parm is Environment mode -> DEV,PROD,STAG 
//2nd parm is project name 
//3rd parm is project Initial 
const ENV_PARMAS = getEnvironmentParams(process.env.ENV_MODE, 'HEAL', 'HL')//sds
console.log(ENV_PARMAS, "Parms_For_Aws_Parameter_store")

const {
  ADMIN_EMAIL,
  ACCESSID,
  REGION,
  DB_URI,
  BUCKET,
  JWT_SECRET
} = ENV_PARMAS
let AGORA_CREDENTIAL: AgoraCredential
let AWS_CREDENTIAL: AwsCredential
let STRIPE_CREDENTIAL: StripeCredential

const APP: AppConstant = {
  ACCESS_EXPIRY: "30m",
  REFRESH_EXPIRY: "30d",
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
  SWAGGER_PASSWORD: 'Admin@123'
};

const DB: DbConstant = {
  DB_NAME: process.env.DB_NAME || '',
  MONGODB_URI: '',
};


const EMAIL_CREDENTIAL: EmailConstant = {
  SMTP_EMAIL: '',
  SMTP_API_KEY: '',
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
  URI: "127.0.0.1",
  PORT: 6379,
};

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
const initializeAwsCredential = async () => {
  console.time("AWS_CREDENTIAL_INIT")
  console.log("Initializing AWS credentials in parallel...")
  try {
    // call this function when parameters are stored to aws
    const results = await Promise.all([
      services.awsService.getSecretFromAWS(DB_URI),
      services.awsService.getSecretFromAWS(JWT_SECRET),
      services.awsService.getParameterFromAWS({ name: ACCESSID }),
      services.awsService.getParameterFromAWS({ name: REGION }),
      services.awsService.getSecretFromAWS("heal_secret"),
      services.awsService.getParameterFromAWS({ name: BUCKET }),
      // services.awsService.getSecretFromAWS(CLOUDFRONT_URL),
      // services.awsService.getSecretFromAWS(SWAGGER_USER_NAME),
      // services.awsService.getSecretFromAWS(SWAGGER_PASSWORD),
      // services.awsService.getSecretFromAWS(STMP_EMAIL),
      // services.awsService.getSecretFromAWS(SMTP_API_KEY),
      // services.awsService.getSecretFromAWS(STRIPE_PB_KEY),
      // services.awsService.getSecretFromAWS(STRIPE_SEC_KEY),
    ]);

    const [
      mongodbUri,
      jwtSecret,
      accessId,
      region,
      awsSecret,
      bucketName
      // swaggerUserName,
      // swaggerPassword,
      // smtpEmail,
      // cloudfrontUrl,
      // smtpApiKey,
      // stripePbKey,
      // stripeSecKey,
    ] = results;

    DB.MONGODB_URI = mongodbUri;
    APP.JWT_SECRET = jwtSecret;
    // APP.CLOUDFRONT_URL = cloudfrontUrl;
    // APP.SWAGGER_USER_NAME = swaggerUserName;
    // APP.SWAGGER_PASSWORD = swaggerPassword;
    // EMAIL_CREDENTIAL.SMTP_EMAIL = smtpEmail;
    // EMAIL_CREDENTIAL.SMTP_API_KEY = smtpApiKey;
    // STRIPE_CREDENTIAL.STRIPE_PB_KEY = stripePbKey;
    // STRIPE_CREDENTIAL.STRIPE_SEC_KEY = stripeSecKey;

    AWS_CREDENTIAL = {
      ACCESSID: accessId,
      REGION: region,
      AWS_SECRET: awsSecret,
      BUCKET_NAME: bucketName,
    };
    console.log("AWS credentials initialized successfully.")
  } catch (error) {
    console.error("Error initializing AWS credentials:", error)
    throw error; // Rethrow to prevent server from starting with invalid config
  } finally {
    console.timeEnd("AWS_CREDENTIAL_INIT")
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
  initializeAwsCredential
};
