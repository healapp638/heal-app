"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const interfaces_util_1 = require("../../utils/interfaces.util");
const response_util_1 = require("../../utils/response.util");
const db_helpers_1 = require("../../helpers/db.helpers");
const auth_util_1 = require("../../utils/auth.util");
const commonHelper = __importStar(require("../../helpers/common.helper"));
const admin_auth_model_1 = __importDefault(require("../../models/Admin/admin.auth.model"));
const services_1 = __importDefault(require("../../services"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const AdminAuthHandler = {
    login: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = data;
        const exists = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, { email });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        const isValid = yield commonHelper.verifyBycryptHash(password, exists.data.password);
        if (!isValid) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.password_incorrect, null, statusCodes_1.default.API_ERROR);
        }
        const adminData = exists === null || exists === void 0 ? void 0 : exists.data;
        const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)(adminData === null || adminData === void 0 ? void 0 : adminData._id, adminData === null || adminData === void 0 ? void 0 : adminData.user_type, interfaces_util_1.tokenUserTypeInterface.ADMIN);
        commonHelper.keysDeleteFromObject(adminData); //delete password & other keys from response
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.login_success, Object.assign(Object.assign({}, adminData), { access_token, refresh_token }), statusCodes_1.default.SUCCESS);
    }), //ends
    forgotPassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { email } = data;
        // check if user exists
        const exists = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, { email });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        const userData = exists === null || exists === void 0 ? void 0 : exists.data;
        const otp = commonHelper.generateOtp();
        const to = `${(_a = exists === null || exists === void 0 ? void 0 : exists.data) === null || _a === void 0 ? void 0 : _a.email}`;
        const user_name = `${userData === null || userData === void 0 ? void 0 : userData.first_name} ${userData === null || userData === void 0 ? void 0 : userData.last_name}`;
        const payload = { user_name, otp };
        const emailSend = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.FORGOT_PASSWORD_EMAIL, to, payload);
        if (!emailSend.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.forgot_password_email_error, null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findByIdAndUpdate)(admin_auth_model_1.default, userData === null || userData === void 0 ? void 0 : userData._id, { otp }); //update otp in database
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.otp_send, null, statusCodes_1.default.SUCCESS);
    }), //ends
    resetPassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { email, new_password, otp } = data;
        const queryObject = { email };
        const result = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, queryObject);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        if (((_a = result.data) === null || _a === void 0 ? void 0 : _a.otp) !== Number(otp)) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.invalid_otp, null, statusCodes_1.default.API_ERROR);
        }
        const hashed = yield commonHelper.bycrptPasswordHash(new_password);
        const updateObj = { otp: '', password: hashed };
        const updated = yield (0, db_helpers_1.findByIdAndUpdate)(admin_auth_model_1.default, (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b._id, updateObj);
        if (!updated.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.password_reset_error, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.password_reset_success, null, statusCodes_1.default.SUCCESS);
    }), //ends
    verifyOtp: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, otp } = data;
        const queryObject = { email, otp };
        const exists = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, queryObject);
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.invalid_otp, null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findOneAndUpdate)(admin_auth_model_1.default, queryObject, { is_verified: true });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.otp_verify_success, null, statusCodes_1.default.SUCCESS);
    }), //ends
    resendOtp: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = data;
        const queryObject = { email };
        const result = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, queryObject);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        const adminData = result === null || result === void 0 ? void 0 : result.data;
        const otp = commonHelper.generateOtp();
        const to = adminData === null || adminData === void 0 ? void 0 : adminData.email;
        const user_name = `${adminData === null || adminData === void 0 ? void 0 : adminData.first_name} ${adminData === null || adminData === void 0 ? void 0 : adminData.last_name}`;
        const payload = { user_name, otp };
        const emailSend = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.SEND_OTP_EMAIL, to, payload);
        if (!emailSend.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.otp_send_error, null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findOneAndUpdate)(admin_auth_model_1.default, queryObject, { otp });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.otp_resend, null, statusCodes_1.default.SUCCESS);
    }), //ends
    changePassword: (data, adminId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { old_password, new_password } = data;
        const exists = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, { _id: adminId });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.invalid_admin, null, statusCodes_1.default.API_ERROR);
        }
        const comparePassword = yield commonHelper.verifyBycryptHash(old_password, (_a = exists.data) === null || _a === void 0 ? void 0 : _a.password);
        if (!comparePassword) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.invalid_old_password, null, statusCodes_1.default.API_ERROR);
        }
        //new password and old password cannot be same
        if (new_password === old_password) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.cannot_same_old_new_password, null, statusCodes_1.default.API_ERROR);
        }
        const hashed = yield commonHelper.bycrptPasswordHash(new_password);
        const result = yield (0, db_helpers_1.findByIdAndUpdate)(admin_auth_model_1.default, adminId, { password: hashed });
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.password_change_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.password_change_successfull, null, statusCodes_1.default.SUCCESS);
    }), //ends
    getAdminDetails: (adminId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, { _id: adminId }, { password: 0, createdAt: 0, updatedAt: 0, otp: 0 });
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.invalid_admin, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.admin_details, result.data, statusCodes_1.default.SUCCESS);
    }), //ends
    updateAdminProfile: (data, admin_id, profile_pic) => __awaiter(void 0, void 0, void 0, function* () {
        const { first_name, last_name, phone_number, country_code, greet_msg } = data;
        const updateObj = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (first_name && { first_name })), (last_name && { last_name })), (phone_number && { phone_number })), (country_code && { country_code })), (greet_msg && { greet_msg }));
        if (profile_pic) {
            //upload image to aws s3 bucket
            const s3Upload = yield services_1.default.awsService.uploadFileToS3([profile_pic]);
            if (!s3Upload.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.file_upload_error, null, statusCodes_1.default.FILE_UPLOAD_ERROR);
            }
            updateObj.profile_pic = s3Upload === null || s3Upload === void 0 ? void 0 : s3Upload.data[0];
        }
        const result = yield (0, db_helpers_1.findByIdAndUpdate)(admin_auth_model_1.default, admin_id, updateObj);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.account_update_error, null, statusCodes_1.default.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(result === null || result === void 0 ? void 0 : result.data);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.account_update_success, result.data, statusCodes_1.default.SUCCESS);
    }), //ends
    refreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { refresh_token } = data;
            const response = yield (0, auth_util_1.decodeToken)(refresh_token);
            if (!response.status) {
                return (0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _a === void 0 ? void 0 : _a.token_expired, null, statusCodes_1.default.REFRESH_TOKEN_ERROR);
            }
            const admin_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.id;
            const findAdmin = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, { _id: admin_id });
            if (!findAdmin.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.admin_not_exist, null, statusCodes_1.default.API_ERROR);
            }
            const tokens = yield (0, auth_util_1.generateAccessRefreshToken)((_c = findAdmin.data) === null || _c === void 0 ? void 0 : _c._id, (_d = findAdmin.data) === null || _d === void 0 ? void 0 : _d.user_type, interfaces_util_1.tokenUserTypeInterface.ADMIN);
            return (0, response_util_1.showResponse)(true, 'Token Generated Successfully', Object.assign(Object.assign({}, findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin.data), { access_token: tokens.access_token, refresh_token: tokens.refresh_token }), statusCodes_1.default.SUCCESS);
        });
    }, //ends
    logoutUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.logout_success, null, statusCodes_1.default.SUCCESS);
        });
    }, //ends
};
exports.default = AdminAuthHandler;
