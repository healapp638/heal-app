import morgan from "morgan";
import express, { Application } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { serve, setup } from "swagger-ui-express";
import Routes from "./modules/index";
import { bootstrapAdmin } from "./utils/bootstrap.util";
import { APP, initializeAwsCredential } from "./constants/app.constant";
import { connection } from "./configs/mongoose.config";
import { handleFileSize } from "./utils/config.util";
import basicAuth from "express-basic-auth";
import compression from "compression";
import cron from "node-cron";
import { generateAffirmation, scheduleCroneJOb } from "./helpers/cronjob.func";
import userDeeplinkModel from "./modules/UserAffirmation/user.deeplink.model";
import { monitorEventLoopDelay } from "perf_hooks";
import { requestIdMiddleware } from "./middlewares/requestId.middlewear";
import logger from "./configs/logger.config";


const app: Application = express();
app.set('trust proxy', 1);

const init = async () => {
  await initializeAwsCredential()
  await connection()
    .then(() => {

      // Start cronjobs
      cron.schedule(
        // "*/2 * * * *",
        "0 2 * * *",
        generateAffirmation,
        {
          noOverlap: true,
        }
      );

      bootstrapAdmin(() => {
        console.log("Bootstrapping finished!");
      });
    })
    .catch((err: any) => {
      console.log(err, "error Bootstrapping");
    });
}
init();


const h = monitorEventLoopDelay();
h.enable();
setInterval(() => {
}, 50000);


app.use(helmet());

//  CORS CONFIG 
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://dev.heal-app.com", "https://admindev.heal-app.com", "https://www.heal-app.com", "https://admin.heal-app.com/"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

//  RESPONSE COMPRESSION
app.use(
  compression({
    level: 6,        // balanced speed vs compression
    threshold: 1024  //  best default 1kB
  })
);

app.use(requestIdMiddleware);
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan("tiny"));
morgan.token("userId", (req: any) => req.userId || "anonymous");
morgan.token("requestId", (req: any) => req.id || "unknown");
// Custom Morgan format for JSON logging
const morganFormat = JSON.stringify({    //STEP 3: Morgan logs request
  type: "access",
  method: ":method",
  url: ":url",
  status: ":status",
  responseTime: ":response-time ms",
  requestId: ":requestId",
  userId: ":userId",
  ip: ":remote-addr",
  userAgent: ":user-agent",
  // timestamp: ":date[iso]"
});

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      try {
        const logData = JSON.parse(message);
        logger.info("Access Log", logData);   //sends this to logger  Stored in: logs/access.log
      } catch {
        logger.info("Access Log", {
          type: "access",
          raw: message.trim(),
        });
      }
    }
  }
}));

app.use((req: any, res: any, next: any) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info("API_RESPONSE", {
      type: "app",
      requestId: req.id,
      userId: req.userId ? req.userId.toString() : "anonymous",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  });

  next();
});


app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/files", express.static(path.join(__dirname, "/public/uploads")));
// app.use(rateLimiter); //limit the api hit with specific ip

//  SWAGGER
async function setupSwagger(app: any) {
  const SWAGGER_USER = await APP.SWAGGER_USER_NAME;
  const SWAGGER_PASS = await APP.SWAGGER_PASSWORD;

  app.use(
    ["/swagger", "/swagger/swagger.json"],
    basicAuth({
      users: {
        [SWAGGER_USER]: SWAGGER_PASS
      },
      challenge: true,
      realm: `swagger-${SWAGGER_PASS}`,
      unauthorizedResponse: () => "Unauthorized access to Swagger"
    }),
    serve,
    setup(undefined, {
      swaggerOptions: {
        url: "/swagger/swagger.json",
        displayRequestDuration: true,
        persistAuthorization: true
      }
    })
  );
}

setupSwagger(app)

// ****************************** sharing logic ********************************
// Serve apple-app-site-association file with correct content-type
app.get("/apple-app-site-association", (req, res) => {
  res.type("application/json");
  res.sendFile(path.join(__dirname, "public", "apple-app-site-association"));
});

// Explicit route to serve assetlinks.json in .well-known folder

app.get("/.well-known/assetlinks.json", (req, res) => {
  res.type("application/json");
  res.sendFile("assetlinks.json", {
    root: path.join(__dirname, "public", ".well-known"),
  });
});

app.get("/link/:code/:affirmation_id", async (req, res) => {
  const { code, affirmation_id } = req.params;
  //console.log(req.params, "req.params")

  const doc = await userDeeplinkModel.findOne({ code });

  if (!doc) {
    return res.redirect("https://myapp.com/notfound");
  }

  let deepLink = `myapp://open?code=${code}`;
  const ua = req.headers["user-agent"] || "";

  const iosStore = `https://apps.apple.com/us/app`;
  const playStore = `https://play.google.com/store/apps/details?id=com.healrn`;
  const fallbackWeb = "https://www.heal-app.com/";

  let storeUrl = fallbackWeb;
  const codeParam = encodeURIComponent(code || "");
  const idParam = encodeURIComponent(affirmation_id || "");

  if (/iPhone|iPad|iPod/.test(ua)) {
    storeUrl = iosStore;
    deepLink = `myapp://open?code=${codeParam}&affirmation_id=${idParam}`;
  } else if (/Android/.test(ua)) {
    storeUrl = playStore;
    deepLink = `intent://open?code=${codeParam}&affirmation_id=${idParam}` + `#Intent;scheme=heal;package=com.healrn;end`;
  }

  // Use a strong random nonce instead of hardcoding in production
  const nonce = "123456";

  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}';`,
  );

  res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Opening App</title>
          <script nonce="${nonce}">
              function attemptDeepLink() {
                  const deepLink = "${deepLink}";
                  const storeUrl = "${storeUrl}";
                  
                  try {
                      const iframe = document.createElement('iframe');
                      iframe.style.display = 'none';
                      iframe.src = deepLink;
                      document.body.appendChild(iframe);
                      
                      setTimeout(() => {
                          try {
                              window.location = deepLink;
                          } catch (e) {
                               // console.log('Deep link failed:', e);
                          }
                      }, 100);
                      
                  } catch (error) {
                     // console.log('Deep link attempt failed:', error);
                  }
                  
                  setTimeout(() => {
                      window.location.href = storeUrl;
                  }, 2000);
              }
              
              attemptDeepLink();
          </script>
      </head>
      <body>
          <p>Opening application...</p>
      </body>
      </html>
    `);
});


app.get("/link/:code", async (req, res) => {
  const { code } = req.params;

  const doc = await userDeeplinkModel.findOne({ code });
  if (!doc) {
    return res.redirect("https://myapp.com/notfound");
  }

  let deepLink = `myapp://open?code=${code}`;
  const ua = req.headers["user-agent"] || "";

  // const iosStore = `https://apps.apple.com/us/app`;
  const iosStore = `https://apps.apple.com/us/app/heal-emotional-companion/id6771270384`;
  const playStore = `https://play.google.com/store/apps/details?id=com.healrn`;
  const fallbackWeb = "https://www.heal-app.com/";

  let storeUrl = fallbackWeb;
  const codeParam = encodeURIComponent(code || "");
  if (/iPhone|iPad|iPod/.test(ua)) {
    storeUrl = iosStore;
    deepLink = `myapp://open?code=${codeParam}`;
  } else if (/Android/.test(ua)) {
    storeUrl = playStore;
    deepLink = `intent://open?code=${codeParam}` + `#Intent;scheme=heal;package=com.healrn;end`;
  }

  // Use a strong random nonce instead of hardcoding in production
  const nonce = "123456";

  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}';`,
  );

  res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Opening App</title>
          <script nonce="${nonce}">
              function attemptDeepLink() {
                  const deepLink = "${deepLink}";
                  const storeUrl = "${storeUrl}";
                  
                  try {
                      const iframe = document.createElement('iframe');
                      iframe.style.display = 'none';
                      iframe.src = deepLink;
                      document.body.appendChild(iframe);
                      
                      setTimeout(() => {
                          try {
                              window.location = deepLink;
                          } catch (e) {
                               // console.log('Deep link failed:', e);
                          }
                      }, 100);
                      
                  } catch (error) {
                     // console.log('Deep link attempt failed:', error);
                  }
                  
                  setTimeout(() => {
                      window.location.href = storeUrl;
                  }, 2000);
              }
              
              attemptDeepLink();
          </script>
      </head>
      <body>
          <p>Opening application...</p>
      </body>
      </html>
    `);
});

app.use("/api/v1", Routes);
app.use(handleFileSize as any);

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err: any, req: any, res: any, next: any) => {         //handle request failures
  // const requestId = req?.id || "unknown_request";
  // Satisfy linter without changing config
  // if (!err) next();
  if (!err) return next();

  logger.error("GLOBAL_ERROR_HANDLER", {
    type: "error",
    requestId: req.id,
    userId: req.userId,   // 👈 ADD THIS
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: "Something went wrong",
    requestId: req.id,
  });
});


app.listen(APP.PORT, () => {
  console.log("Server is running on port", APP.PORT);
  console.log("Swagger link:", `http://localhost:${APP.PORT}/swagger`);
});

scheduleCroneJOb()

// const messageHandler = async (message:any) => {
//   try {
//     // console.log('✅ message=>>>>>>>>>>>>>>>>>.', message);
//     if (message?.data) {
//       await handler.decodeAndroidSubscriptionMessage(message?.data);
//     }
//     message.ack(); // Acknowledge the message
//   } catch (err) {
//     console.error("❌ Error in messageHandler:", err);
//   }
// };

// async function receiveNotifications() {
//   try {
//     console.log('✅--- receiveNotifications-1------');
//     // const subscriptionName = 'projects/mywaymassage-381d3/subscriptions/subscription_webhook-sub'; // Make sure this exists in GCP
//     // const subscriptionName:any = ANDROID_SUBSCRIPTION_DATA.SUBSCRIPTION_NAME; // Make sure this exists in GCP
//     // const subscriptionName:any = "projects/ription-demo/subscriptions/subscription_webhook-sub"; // Make sure this exists in GCP
//     const subscriptionName:any = "projects/manifestnails/subscriptions/manifest-sub"; // Make sure this exists in GCP
//     const subscription = pubsub.subscription(subscriptionName);

//     subscription.on('message', messageHandler);
//     subscription.on('error', (err) => {
//       console.error("❌ receiveNotifications Subscription Error:", err);
//     });

//   } catch (err) {
//     console.error("❌ receiveNotifications Error:", err);
//   }
// }
// receiveNotifications().catch(console.error);

/* =========================
   PROCESS SAFETY  //handle unexpected crashes
========================= */
process.on("uncaughtException", (err) => {    //This listens for synchronous errors that were NOT caught anywhere in your code.
  logger.error("UNCAUGHT_EXCEPTION", {
    type: "system",
    message: err.message,
    stack: err.stack,
  });
  // process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {   //This catches Promise rejections that were not handled with .catch() or try/catch (async/await).
  logger.error("UNHANDLED_REJECTION", {
    type: "system",
    message: reason?.message || reason,
    stack: reason?.stack,
  });
  // process.exit(1);
});