import mongoose from "mongoose";
import logger from "./logger.config";

const formatQuery = (query: any) => {
  return JSON.parse(
    JSON.stringify(query, (key, value) => {
      if (value?._bsontype === "ObjectID" || value?._bsontype === "ObjectId") {
        return value.toString();
      }
      return value;
    })
  );
};

export const registerMongoPlugin = () => {
  mongoose.plugin((schema) => {

    schema.pre(/^(find|save|update|delete)/, function (this: any, next) {
      this._startTime = Date.now();
      next();
    });

    schema.post(/^(find|save|update|delete)/, function (this: any, result: any, next) {
      const duration = Date.now() - this._startTime;

      // console.log("PLUGIN RUNNING"); // 👈 DEBUG

      if (duration > 5000) {
        logger.warn("MONGO_SLOW_QUERY", {
          type: "mongodb",
          collection: this.mongooseCollection.name,
          operation: this.op,
          duration: `${duration}ms`,
          query: formatQuery(this.getQuery?.() || {}),
        });
      }

      next();
    });

  });
};