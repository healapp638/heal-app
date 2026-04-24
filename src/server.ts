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

const app: Application = express();

const init = async () => {
  await initializeAwsCredential()
  await connection()
    .then(() => {
      bootstrapAdmin(() => {
        console.log("Bootstrapping finished!");
      });
    })
    .catch((err: any) => {
      console.log(err, "error Bootstrapping");
    });
}
init();


//  SECURITY MIDDLEWARE
app.use(helmet());


//  CORS CONFIG (FIXED)
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
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


app.use("/api/v1", Routes);
app.use(handleFileSize as any);


app.listen(APP.PORT, () => {
  console.log("Server is running on port", APP.PORT);
  console.log("Swagger link:", `http://localhost:${APP.PORT}/swagger`);
});