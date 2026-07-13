"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMongoPlugin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_config_1 = __importDefault(require("./logger.config"));
const formatQuery = (query) => {
    return JSON.parse(JSON.stringify(query, (key, value) => {
        if ((value === null || value === void 0 ? void 0 : value._bsontype) === "ObjectID" || (value === null || value === void 0 ? void 0 : value._bsontype) === "ObjectId") {
            return value.toString();
        }
        return value;
    }));
};
const registerMongoPlugin = () => {
    mongoose_1.default.plugin((schema) => {
        schema.pre(/^(find|save|update|delete)/, function (next) {
            this._startTime = Date.now();
            next();
        });
        schema.post(/^(find|save|update|delete)/, function (result, next) {
            var _a;
            const duration = Date.now() - this._startTime;
            // console.log("PLUGIN RUNNING"); // 👈 DEBUG
            if (duration > 5000) {
                logger_config_1.default.warn("MONGO_SLOW_QUERY", {
                    type: "mongodb",
                    collection: this.mongooseCollection.name,
                    operation: this.op,
                    duration: `${duration}ms`,
                    query: formatQuery(((_a = this.getQuery) === null || _a === void 0 ? void 0 : _a.call(this)) || {}),
                });
            }
            next();
        });
    });
};
exports.registerMongoPlugin = registerMongoPlugin;
