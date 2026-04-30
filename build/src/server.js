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
const app = (0, express_1.default)();
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, app_constant_1.initializeAwsCredential)();
    yield (0, mongoose_config_1.connection)()
        .then(() => {
        (0, bootstrap_util_1.bootstrapAdmin)(() => {
            console.log("Bootstrapping finished!");
        });
    })
        .catch((err) => {
        console.log(err, "error Bootstrapping");
    });
});
init();
//  SECURITY MIDDLEWARE
app.use((0, helmet_1.default)());
//  CORS CONFIG (FIXED)
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://dev.heal-app.com", "https://admindev.heal-app.com", "https://www.heal-app.com"];
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
app.use("/api/v1", index_1.default);
app.use(config_util_1.handleFileSize);
app.listen(app_constant_1.APP.PORT, () => {
    console.log("Server is running on port", app_constant_1.APP.PORT);
    console.log("Swagger link:", `http://localhost:${app_constant_1.APP.PORT}/swagger`);
});
