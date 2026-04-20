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
exports.verifyTokenBoth = exports.verifyTokenAdmin = exports.verifyTokenUser = void 0;
const auth_util_1 = require("../utils/auth.util");
const response_util_1 = require("../utils/response.util");
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const responseMessages_1 = __importDefault(require("../constants/responseMessages"));
const verifyTokenUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const decoded = yield (0, auth_util_1.verifyToken)(req);
        if (decoded.status && ((_a = decoded === null || decoded === void 0 ? void 0 : decoded.data) === null || _a === void 0 ? void 0 : _a.user_type) == 'user') {
            req.body.user = decoded.data;
            next();
        }
        else if (!decoded.status) {
            return (0, response_util_1.showOutput)(res, { status: decoded.status, message: decoded === null || decoded === void 0 ? void 0 : decoded.message, data: null, code: decoded === null || decoded === void 0 ? void 0 : decoded.code }, decoded === null || decoded === void 0 ? void 0 : decoded.code);
        }
        else {
            return (0, response_util_1.showOutput)(res, { status: false, message: "Invalid User", data: null, code: statusCodes_1.default.AUTH_TOKEN_ERROR }, statusCodes_1.default.AUTH_TOKEN_ERROR);
        }
    }
    catch (error) {
        return (0, response_util_1.showOutput)(res, { status: false, message: responseMessages_1.default.users.unauthorised_user, data: error, code: statusCodes_1.default.AUTH_TOKEN_ERROR }, statusCodes_1.default.AUTH_TOKEN_ERROR);
    }
}); //ends
exports.verifyTokenUser = verifyTokenUser;
const verifyTokenAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const decoded = yield (0, auth_util_1.verifyToken)(req);
        if (decoded.status && ((_a = decoded === null || decoded === void 0 ? void 0 : decoded.data) === null || _a === void 0 ? void 0 : _a.user_type) == 'admin') {
            req.body.user = decoded.data;
            next();
        }
        else {
            return (0, response_util_1.showOutput)(res, { status: false, message: "Invalid Admin", data: null, code: statusCodes_1.default.AUTH_TOKEN_ERROR }, statusCodes_1.default.AUTH_TOKEN_ERROR);
        }
    }
    catch (error) {
        return (0, response_util_1.showOutput)(res, { status: false, message: responseMessages_1.default.admin.unauthorized_access, data: error, code: statusCodes_1.default.AUTH_TOKEN_ERROR }, statusCodes_1.default.AUTH_TOKEN_ERROR);
    }
}); //ends
exports.verifyTokenAdmin = verifyTokenAdmin;
const verifyTokenBoth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const decoded = yield (0, auth_util_1.verifyToken)(req);
        if (decoded.status && ((_a = decoded === null || decoded === void 0 ? void 0 : decoded.data) === null || _a === void 0 ? void 0 : _a.user_type) == 'user' || ((_b = decoded === null || decoded === void 0 ? void 0 : decoded.data) === null || _b === void 0 ? void 0 : _b.user_type) == 'admin') {
            req.body.user = decoded.data;
            next();
        }
        else if (!decoded.status) {
            return (0, response_util_1.showOutput)(res, { status: decoded.status, message: decoded === null || decoded === void 0 ? void 0 : decoded.message, data: null, code: decoded === null || decoded === void 0 ? void 0 : decoded.code }, decoded === null || decoded === void 0 ? void 0 : decoded.code);
        }
        else {
            return (0, response_util_1.showOutput)(res, { status: false, message: "Invalid User", data: null, code: statusCodes_1.default.AUTH_TOKEN_ERROR }, statusCodes_1.default.AUTH_TOKEN_ERROR);
        }
    }
    catch (error) {
        return (0, response_util_1.showOutput)(res, { status: false, message: responseMessages_1.default.admin.unauthorized_access, data: error, code: statusCodes_1.default.AUTH_TOKEN_ERROR }, statusCodes_1.default.AUTH_TOKEN_ERROR);
    }
}); //ends
exports.verifyTokenBoth = verifyTokenBoth;
exports.default = {
    verifyTokenAdmin: exports.verifyTokenAdmin,
    verifyTokenBoth: exports.verifyTokenBoth,
    verifyTokenUser: exports.verifyTokenUser
};
