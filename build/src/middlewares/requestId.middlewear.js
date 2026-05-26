"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
const crypto_1 = __importDefault(require("crypto"));
const requestIdMiddleware = (req, res, next) => {
    const requestId = req.header('x-request-id') || crypto_1.default.randomUUID(); //If request already has ID → use itElse → create new
    req.id = requestId; //Attach to request
    // default userId
    req.userId = req.userId || "anonymous";
    res.setHeader('x-request-id', requestId); //Send it back to frontend
    res.setHeader("Access-Control-Expose-Headers", "x-request-id");
    next(); //Pass request to next step
};
exports.requestIdMiddleware = requestIdMiddleware;
