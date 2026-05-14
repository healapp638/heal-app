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
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = require("swagger-ui-express");
const index_1 = __importDefault(require("./modules/index"));
const bootstrap_util_1 = require("./utils/bootstrap.util");
const app_constant_1 = require("./constants/app.constant");
const mongoose_config_1 = require("./configs/mongoose.config");
const config_util_1 = require("./utils/config.util");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const compression_1 = __importDefault(require("compression"));
const node_cron_1 = __importDefault(require("node-cron"));
const cronjob_func_1 = require("./helpers/cronjob.func");
const user_deeplink_model_1 = __importDefault(require("./modules/UserAffirmation/user.deeplink.model"));
const perf_hooks_1 = require("perf_hooks");
// import blocked from "blocked-at";
const app = (0, express_1.default)();
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, app_constant_1.initializeAwsCredential)();
    yield (0, mongoose_config_1.connection)()
        .then(() => {
        // Start cronjobs
        node_cron_1.default.schedule(
        // "0 4 * * *",
        "0 2 * * *", cronjob_func_1.generateAffirmation, {
            noOverlap: true,
        });
        (0, bootstrap_util_1.bootstrapAdmin)(() => {
            console.log("Bootstrapping finished!");
        });
    })
        .catch((err) => {
        console.log(err, "error Bootstrapping");
    });
});
init();
const h = (0, perf_hooks_1.monitorEventLoopDelay)();
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
app.use((0, helmet_1.default)());
//  CORS CONFIG 
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://dev.heal-app.com", "https://admindev.heal-app.com", "https://www.heal-app.com", "https://admin.heal-app.com/"];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
//  RESPONSE COMPRESSION
app.use((0, compression_1.default)({
    level: 6, // balanced speed vs compression
    threshold: 1024 //  best default 1kB
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.static("public"));
app.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
app.use("/files", express_1.default.static(path_1.default.join(__dirname, "/public/uploads")));
// app.use(rateLimiter); //limit the api hit with specific ip
//  SWAGGER
function setupSwagger(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const SWAGGER_USER = yield app_constant_1.APP.SWAGGER_USER_NAME;
        const SWAGGER_PASS = yield app_constant_1.APP.SWAGGER_PASSWORD;
        app.use(["/swagger", "/swagger/swagger.json"], (0, express_basic_auth_1.default)({
            users: {
                [SWAGGER_USER]: SWAGGER_PASS
            },
            challenge: true,
            realm: `swagger-${SWAGGER_PASS}`,
            unauthorizedResponse: () => "Unauthorized access to Swagger"
        }), swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(undefined, {
            swaggerOptions: {
                url: "/swagger/swagger.json",
                displayRequestDuration: true,
                persistAuthorization: true
            }
        }));
    });
}
setupSwagger(app);
// ****************************** sharing logic ********************************
// Serve apple-app-site-association file with correct content-type
app.get("/apple-app-site-association", (req, res) => {
    res.type("application/json");
    res.sendFile(path_1.default.join(__dirname, "public", "apple-app-site-association"));
});
// Explicit route to serve assetlinks.json in .well-known folder
app.get("/.well-known/assetlinks.json", (req, res) => {
    res.type("application/json");
    res.sendFile("assetlinks.json", {
        root: path_1.default.join(__dirname, "public", ".well-known"),
    });
});
app.get("/link/:code/:affirmation_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, affirmation_id } = req.params;
    //console.log(req.params, "req.params")
    const doc = yield user_deeplink_model_1.default.findOne({ code });
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
    }
    else if (/Android/.test(ua)) {
        console.log("🤖 Android user detected");
        storeUrl = playStore;
        // deepLink = `intent://open?code=${code}#Intent;scheme=habittime;package=com.habittime;end`;
        deepLink = `intent://open?code=${codeParam}&affirmation_id=${idParam}` + `#Intent;scheme=pollture;package=com.heal;end`;
        // deepLink = `pollture://open?code=${codeParam}&id=${idParam}&type=${typeParam}&graphType=${graphTypeParam}`;
        console.log(deepLink, "deepLink android");
    }
    // Use a strong random nonce instead of hardcoding in production
    const nonce = "123456";
    res.setHeader("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}';`);
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
}));
app.use("/api/v1", index_1.default);
app.use(config_util_1.handleFileSize);
app.listen(app_constant_1.APP.PORT, () => {
    console.log("Server is running on port", app_constant_1.APP.PORT);
    console.log("Swagger link:", `http://localhost:${app_constant_1.APP.PORT}/swagger`);
});
