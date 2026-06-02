import { Queue } from "bullmq";
import IORedis from "ioredis";
import { REDIS_CREDENTIAL } from "../constants/app.constant";

const connection = new IORedis({
  host: REDIS_CREDENTIAL.REDIS_HOST,
  port: REDIS_CREDENTIAL.PORT,
});

export const excelQueue = new Queue("excel-import", {
  connection,
});

export const affirmationQueue = new Queue("affirmation-import",{
   connection, 
})