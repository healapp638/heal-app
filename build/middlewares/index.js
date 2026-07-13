"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
const busBoy_middleware_1 = __importDefault(require("./busBoy.middleware"));
const multer_middleware_1 = __importDefault(require("./multer.middleware"));
const validation_middleware_1 = __importDefault(require("./validation.middleware"));
exports.default = {
    fileUpload: {
        busboy: busBoy_middleware_1.default,
        multer: multer_middleware_1.default
    },
    auth: auth_middleware_1.default,
    joiValidation: validation_middleware_1.default
};
