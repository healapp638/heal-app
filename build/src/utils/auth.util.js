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
exports.decodeToken = exports.verifyToken = exports.generateAccessRefreshToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_helpers_1 = require("../helpers/db.helpers");
const user_auth_model_1 = __importDefault(require("../modules/UserAuth/user.auth.model"));
const admin_auth_model_1 = __importDefault(require("../modules/AdminAuth/admin.auth.model"));
const response_util_1 = require("./response.util");
const responseMessages_1 = __importDefault(require("../constants/responseMessages"));
const app_constant_1 = require("../constants/app.constant");
const workflow_constant_1 = require("../constants/workflow.constant");
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
//
const generateJwtToken = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, extras = {}, expiresIn = '24h') {
    const API_SECRET = '!@#$%^&*()';
    console.log(API_SECRET, "API_SECRET");
    return new Promise((res, rej) => {
        jsonwebtoken_1.default.sign(Object.assign({ id }, extras), API_SECRET, {
            expiresIn
        }, (err, encoded) => {
            if (err) {
                rej(err.message);
            }
            else {
                res(encoded);
            }
        });
    });
});
exports.generateJwtToken = generateJwtToken;
const generateAccessRefreshToken = (user_id, role, user_type) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = yield (0, exports.generateJwtToken)(user_id, { user_type, type: "access", role }, app_constant_1.APP.ACCESS_EXPIRY);
    const refresh_token = yield (0, exports.generateJwtToken)(user_id, { user_type, type: "refresh", role }, app_constant_1.APP.REFRESH_EXPIRY);
    return { access_token, refresh_token };
});
exports.generateAccessRefreshToken = generateAccessRefreshToken;
const verifyToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        let token = req.headers['access_token'] || req.headers['authorization'] || req.headers['Authorization'];
        // console.log(token, "token token token1")
        if (!token) {
            return (0, response_util_1.showResponse)(false, "Token not present in headers ", {}, statusCodes_1.default.AUTH_TOKEN_ERROR);
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        const API_SECRET = '!@#$%^&*()';
        const decoded = yield new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, API_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                if (err) {
                    reject((0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _a === void 0 ? void 0 : _a.token_expired, {}, statusCodes_1.default.AUTH_TOKEN_ERROR));
                }
                resolve((0, response_util_1.showResponse)(true, 'decode success', decoded, statusCodes_1.default.SUCCESS));
            }));
        });
        //return response if token is not decoded 
        if (!decoded.status) {
            return decoded;
        }
        const decoded_data = decoded.data;
        if (decoded_data.user_type === "user") {
            const response = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: (_a = decoded_data._id) !== null && _a !== void 0 ? _a : decoded_data.id });
            if (!response.status) {
                return (0, response_util_1.showResponse)(false, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.users) === null || _b === void 0 ? void 0 : _b.invalid_user, {}, statusCodes_1.default.AUTH_TOKEN_ERROR);
            }
            const userData = response.data;
            if (userData.status === workflow_constant_1.USER_STATUS.DELETED) {
                return (0, response_util_1.showResponse)(false, (_c = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _c === void 0 ? void 0 : _c.deleted_account, {}, statusCodes_1.default.ACCOUNT_DELETED);
            }
            if (userData.status === workflow_constant_1.USER_STATUS.DEACTIVATED) {
                return (0, response_util_1.showResponse)(false, (_d = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _d === void 0 ? void 0 : _d.deactivated_account, {}, statusCodes_1.default.ACCOUNT_DISABLED);
            }
            return (0, response_util_1.showResponse)(true, 'user data decoded ', Object.assign(Object.assign({}, decoded_data), { user_id: userData._id }), statusCodes_1.default.SUCCESS);
        }
        else if ((decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.user_type) === "admin") {
            const response = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, { _id: (_e = decoded_data._id) !== null && _e !== void 0 ? _e : decoded_data.id });
            if (!response.status) {
                return (0, response_util_1.showResponse)(false, (_f = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.admin) === null || _f === void 0 ? void 0 : _f.admin_not_exist, {}, statusCodes_1.default.AUTH_TOKEN_ERROR);
            }
            const adminData = response.data;
            if (adminData.status === workflow_constant_1.USER_STATUS.DELETED) {
                return (0, response_util_1.showResponse)(false, (_g = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _g === void 0 ? void 0 : _g.deleted_account, {}, statusCodes_1.default.ACCOUNT_DELETED);
            }
            if (adminData.status === workflow_constant_1.USER_STATUS.DEACTIVATED) {
                return (0, response_util_1.showResponse)(false, (_h = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _h === void 0 ? void 0 : _h.deactivated_account, {}, statusCodes_1.default.ACCOUNT_DISABLED);
            }
            return (0, response_util_1.showResponse)(true, 'admin data decoded', Object.assign(Object.assign({}, decoded_data), { admin_id: adminData._id }), statusCodes_1.default.SUCCESS);
        }
        else {
            return (0, response_util_1.showResponse)(false, (_j = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.users) === null || _j === void 0 ? void 0 : _j.invalid_user, {}, statusCodes_1.default.AUTH_TOKEN_ERROR);
        }
    }
    catch (err) {
        const errorMsg = (err === null || err === void 0 ? void 0 : err.message) ? err.message : err;
        return (0, response_util_1.showResponse)(false, errorMsg, {}, statusCodes_1.default.AUTH_TOKEN_ERROR);
    }
});
exports.verifyToken = verifyToken;
const decodeToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const API_SECRET = '!@#$%^&*()';
        return jsonwebtoken_1.default.verify(token, API_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (err) {
                return (0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _a === void 0 ? void 0 : _a.token_expired, null, statusCodes_1.default.AUTH_TOKEN_ERROR);
            }
            return (0, response_util_1.showResponse)(true, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.users) === null || _b === void 0 ? void 0 : _b.token_verification_sucess, decoded, statusCodes_1.default.SUCCESS);
        }));
    }
    catch (error) {
        return (0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _a === void 0 ? void 0 : _a.invalid_access_token, error, statusCodes_1.default.SERVER_TRYCATCH_ERROR);
    }
});
exports.decodeToken = decodeToken;
