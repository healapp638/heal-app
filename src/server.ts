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
// import blocked from "blocked-at";


const app: Application = express();
app.set('trust proxy', 1);

const init = async () => {
  await initializeAwsCredential()
  await connection()
    .then(() => {

      // Start cronjobs
      cron.schedule(
        // "0 4 * * *",
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
  // console.log('min', h.min / 1e6);
  // console.log('max', h.max / 1e6);
  // console.log('mean', h.mean / 1e6);
}, 50000);

// blocked((time: any, stack: any) => {
//   console.log(`Blocked for ${time}ms`);
//   console.log(stack);
//   console.log('blocked')
// }, { threshold: 20 })

//  SECURITY MIDDLEWARE
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



app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));


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
  const playStore = `https://play.google.com/store/apps/details?id=com.heal`;
  const fallbackWeb = "https://apidev.heal-app.com/";

  let storeUrl = fallbackWeb;
  const codeParam = encodeURIComponent(code || "");
  const idParam = encodeURIComponent(affirmation_id || "");

  if (/iPhone|iPad|iPod/.test(ua)) {
    // console.log("📱 iOS user detected");
    storeUrl = iosStore;
    // deepLink = `myapp://open?code=${code}`;
    deepLink = `myapp://open?code=${codeParam}&affirmation_id=${idParam}`;
    // console.log(deepLink, "deepLink ioss")
  } else if (/Android/.test(ua)) {
    console.log("🤖 Android user detected");
    storeUrl = playStore;
    // deepLink = `intent://open?code=${code}#Intent;scheme=habittime;package=com.habittime;end`;
    deepLink = `intent://open?code=${codeParam}&affirmation_id=${idParam}` + `#Intent;scheme=pollture;package=com.heal;end`;
    // deepLink = `pollture://open?code=${codeParam}&id=${idParam}&type=${typeParam}&graphType=${graphTypeParam}`;
    console.log(deepLink, "deepLink android")
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
  console.log(req.params, "req.params")

  const doc = await userDeeplinkModel.findOne({ code });
console.log(doc, "doc")
  if (!doc) {
    return res.redirect("https://myapp.com/notfound");
  }

  let deepLink = `myapp://open?code=${code}`;
  const ua = req.headers["user-agent"] || "";

  // const iosStore = `https://apps.apple.com/us/app`;
  const iosStore = `https://apps.apple.com/us/app/heal-emotional-companion/id6771270384`;
  const playStore = `https://play.google.com/store/apps/details?id=com.heal`;
  const fallbackWeb = "https://apidev.heal-app.com/";

  let storeUrl = fallbackWeb;
  const codeParam = encodeURIComponent(code || "");
  // const idParam = encodeURIComponent(affirmation_id || "");
console.log("deeplink")
  if (/iPhone|iPad|iPod/.test(ua)) {
    console.log("📱 iOS user detected");
    storeUrl = iosStore;
    // deepLink = `myapp://open?code=${code}`;
    deepLink = `myapp://open?code=${codeParam}`;
    console.log(deepLink, "deepLink ioss")
  } else if (/Android/.test(ua)) {
    console.log("🤖 Android user detected");
    storeUrl = playStore;
    // deepLink = `intent://open?code=${code}#Intent;scheme=habittime;package=com.habittime;end`;
    deepLink = `intent://open?code=${codeParam}` + `#Intent;scheme=heal;package=com.heal;end`;
    // deepLink = `pollture://open?code=${codeParam}&id=${idParam}&type=${typeParam}&graphType=${graphTypeParam}`;
    console.log(deepLink, "deepLink android")
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


app.listen(APP.PORT, () => {
  console.log("Server is running on port", APP.PORT);
  console.log("Swagger link:", `http://localhost:${APP.PORT}/swagger`);
});

scheduleCroneJOb()