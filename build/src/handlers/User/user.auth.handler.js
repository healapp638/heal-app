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
const user_auth_model_1 = __importDefault(require("../../models/User/user.auth.model"));
// import { APP } from '../../constants/app.constant';
const workflow_constant_1 = require("../../constants/workflow.constant");
const services_1 = __importDefault(require("../../services"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const UserAuthHandler = {
    update_social_info: (findUser, model, data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const { login_source, social_auth, email, name } = data;
            const editObj = {};
            const social_account = {
                email,
                source: login_source,
                token: social_auth,
                name: name
            };
            // Check if social account exists in device_info array
            const accountIndex = (_b = (_a = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _a === void 0 ? void 0 : _a.social_account) === null || _b === void 0 ? void 0 : _b.findIndex((info) => (info === null || info === void 0 ? void 0 : info.source) === (data === null || data === void 0 ? void 0 : data.login_source));
            //if exist then update else add new
            if (accountIndex !== -1) {
                editObj[`social_account.${accountIndex}`] = social_account;
            }
            else {
                editObj.$push = { social_account: social_account };
            }
            const response = yield (0, db_helpers_1.findAndUpdatePushOrSet)(model, { _id: (_c = findUser.data) === null || _c === void 0 ? void 0 : _c._id }, editObj);
            //return update result
            if (response.status) {
                return { status: true, data: response.data };
            }
            else {
                return { status: false, data: null };
            }
        }
        catch (error) {
            console.log(error, "error update_device_idd");
            return { status: false };
        }
    }), //ends
    login: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = data;
        const queryObject = { email, is_verified: true, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        //****if social login is used in project then user this query**** 
        //   const queryObject = { email, is_verified: true, account_source: 'email', status: { $ne: USER_STATUS.DELETED } }
        const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!findUser.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        const userData = findUser === null || findUser === void 0 ? void 0 : findUser.data;
        //if account deactivated by admin then throw error 
        if ((userData === null || userData === void 0 ? void 0 : userData.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && (userData === null || userData === void 0 ? void 0 : userData.deactivate_by) === workflow_constant_1.DEACTIVATE_BY.ADMIN) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.middleware.deactivated_account, null, statusCodes_1.default.API_ERROR);
        }
        const isValid = yield commonHelper.verifyBycryptHash(password, userData === null || userData === void 0 ? void 0 : userData.password);
        if (!isValid) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.password_incorrect, null, statusCodes_1.default.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(userData); //delete password & other keys from response
        const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)(userData === null || userData === void 0 ? void 0 : userData._id, userData === null || userData === void 0 ? void 0 : userData.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
        //if account deactivated by user then reactivate account
        if ((userData === null || userData === void 0 ? void 0 : userData.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && (userData === null || userData === void 0 ? void 0 : userData.deactivate_by) === workflow_constant_1.DEACTIVATE_BY.USER) {
            yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: userData === null || userData === void 0 ? void 0 : userData._id }, { status: workflow_constant_1.USER_STATUS.ACTIVE, deactivate_by: '' }); //activate user again
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.login_success, Object.assign(Object.assign({}, userData), { access_token, refresh_token }), statusCodes_1.default.SUCCESS);
    }), //ends
    // social_login: async (data: any) => {
    //     const { login_source, social_auth, email, name = undefined, user_type, profile_pic } = data;
    //     const queryObject = {
    //         status: { $ne: USER_STATUS.DELETED }, //user not deleted
    //         $or: [
    //             {
    //                 email: email, //if main email match 
    //             },
    //             {
    //                 social_account: {
    //                     $elemMatch: { email: email } //if social email match
    //                 }
    //             },
    //             {
    //                 social_account: {
    //                     $elemMatch: { token: social_auth } //if social token match
    //                 }
    //             },
    //         ]
    //     } //match condition ends 
    //     //check user exist or not 
    //     const findUser = await findOne(userAuthModel, queryObject);
    //     //if account already existed then update details and return token with login success
    //     if (findUser.status) {
    //         //if account deactivate by admin throw error 
    //         if (findUser?.data?.status == USER_STATUS.DEACTIVATED && findUser.data?.deactivate_by === DEACTIVATE_BY.ADMIN) {
    //             return showResponse(false, responseMessage.middleware.deactivated_account, null, statusCodes.API_ERROR);
    //         }
    //         //update social account array 
    //         const updateSocialInfo = await UserAuthHandler.update_social_info(findUser, userAuthModel, data)
    //         if (!updateSocialInfo.status) {
    //             return showResponse(false, responseMessage.users.login_error, null, statusCodes.API_ERROR);
    //         }
    //         commonHelper.keysDeleteFromObject(findUser?.data)
    //         const { access_token, refresh_token } = await generateAccessRefreshToken(findUser.data?._id, findUser.data?.user_type, tokenUserTypeInterface.USER)
    //         const userData = { ...findUser?.data, access_token, refresh_token }
    //         //if account deactivated by user then activate it again 
    //         if (findUser?.data?.status == USER_STATUS.DEACTIVATED && findUser.data?.deactivate_by === DEACTIVATE_BY.USER) {
    //             await findOneAndUpdate(userAuthModel, { _id: findUser.data?._id }, { status: USER_STATUS.ACTIVE, deactivate_by: '' })
    //         }
    //         return showResponse(true, responseMessage.users.login_success, userData, statusCodes.SUCCESS);
    //     } else {
    //         //if not exist then register new user 
    //         const newObj = {
    //             social_account: [
    //                 {
    //                     source: login_source,
    //                     email: email,
    //                     token: social_auth,
    //                     name: name
    //                 }
    //             ],
    //             email,
    //             first_name: name ? name : commonHelper.getFirstNameFromEmail(email),
    //             account_source: login_source,
    //             is_verified: false,
    //         };
    //         const userRef = new userAuthModel(newObj)
    //         const result = await createOne(userRef);
    //         if (!result.status) {
    //             return showResponse(false, responseMessage.users.login_error, null, statusCodes.API_ERROR);
    //         }
    //         commonHelper.keysDeleteFromObject(result?.data)
    //         const { access_token, refresh_token } = await generateAccessRefreshToken(result.data?._id, result.data?.user_type, tokenUserTypeInterface.USER)
    //         const userData = { ...result?.data, access_token, refresh_token }
    //         return showResponse(true, responseMessage.users.login_success, userData, statusCodes.SUCCESS);
    //     }
    // },
    //***********SOCIAL LOGIN NOT USED : if social login not used in this project then use this function ************************ */
    register: (data, profile_pic) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { email, password } = data;
        const queryObject = { email, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        // check if user exists && if email is verified 
        const exists = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (exists.status && ((_a = exists.data) === null || _a === void 0 ? void 0 : _a.is_verified)) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_already, null, statusCodes_1.default.API_ERROR);
        }
        //else create or update new entry 
        const otp = commonHelper.generateOtp();
        const hashed = yield commonHelper.bycrptPasswordHash(password);
        data.password = hashed;
        data.otp = otp;
        if (profile_pic) {
            //upload image to aws s3 bucket
            const s3Upload = yield services_1.default.awsService.uploadFileToS3([profile_pic]);
            if (!s3Upload.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.file_upload_error, null, statusCodes_1.default.FILE_UPLOAD_ERROR);
            }
            data.profile_pic = s3Upload === null || s3Upload === void 0 ? void 0 : s3Upload.data[0];
        }
        const result = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, data, true); //upsert true
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.error_while_create_acc, null, statusCodes_1.default.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(result === null || result === void 0 ? void 0 : result.data); //delete password & other keys from response
        // const userData = result?.data
        // const to = userData?.email
        // const user_name = `${userData?.first_name} ${userData?.last_name}`
        // const payload = { user_name, otp }
        // const emailSend = await services.emailService.sendEmailViaNodemail(EMAIL_SEND_TYPE.REGISTER_EMAIL, to, payload)
        // if (!emailSend.status) {
        //     await findOneAndDelete(userAuthModel, { _id: userData?._id })
        //     return showResponse(false, responseMessage.common.error_while_create_acc, null, statusCodes.API_ERROR)
        // }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.verification_email_sent, {}, statusCodes_1.default.SUCCESS);
    }), //ends
    //***********SOCIAL LOGIN USED : if social login used in this project then use this function ************************ */
    // async register(data: any, profile_pic: any): Promise<ApiResponse> {
    //     const { email, password } = data;
    //     //check if match or not by email
    //     const queryObject = {
    //         status: { $ne: USER_STATUS.DELETED },
    //         $or: [
    //             { email },//if account email find then throw error already existed 
    //             {
    //                 social_account: {
    //                     $elemMatch: { email: email }  //if account finds with social email then update account
    //                 }
    //             },
    //         ]
    //     }
    //     const hashed = await commonHelper.bycrptPasswordHash(password);
    //     const otp = commonHelper.generateOtp()
    //     const emailPayload = { user_name: data?.first_name, otp }
    //     const payload = { ...data, account_source: 'email', password: hashed, otp }
    //     if (profile_pic) {
    //         //upload image to aws s3 bucket
    //         const s3Upload = await services.awsService.uploadFileToS3([profile_pic])
    //         if (!s3Upload.status) {
    //             return showResponse(false, responseMessage?.common.file_upload_error, null, statusCodes.FILE_UPLOAD_ERROR);
    //         }
    //         payload.profile_pic = s3Upload?.data[0]
    //     }
    //     // check if user exists
    //     const findUser = await findOne(userAuthModel, queryObject);
    //     //if user exist with same account source then throw error
    // if (findUser.status && findUser?.data?.account_source == 'email' && findUser?.data?.is_verified) {
    //     return showResponse(false, responseMessage.users.email_already, null, statusCodes.API_ERROR);
    // }
    //     //if exist with different source (through google apple login) then update details and account source else insert new account entry
    //     const result = await findOneAndUpdate(userAuthModel, queryObject, payload, true);//upsert true
    //     if (!result.status) {
    //         return showResponse(false, responseMessage.users.register_error, null, statusCodes.API_ERROR);
    //     }
    //     const sendEmail = await services.emailService.sendEmailViaNodemail(EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload)
    //     if (!sendEmail.status) {
    //         return showResponse(false, responseMessage.users.register_error, null, statusCodes.API_ERROR);
    //     }
    //     return showResponse(true, responseMessage.users.verification_email_sent, null, statusCodes.SUCCESS);
    // },
    //ends
    forgotPassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { email } = data;
        const queryObject = { email, is_verified: true, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        // check if user exists
        const exists = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        const userData = exists === null || exists === void 0 ? void 0 : exists.data;
        const otp = commonHelper.generateOtp();
        const to = `${(_a = exists === null || exists === void 0 ? void 0 : exists.data) === null || _a === void 0 ? void 0 : _a.email}`;
        const user_name = `${userData === null || userData === void 0 ? void 0 : userData.first_name} ${userData === null || userData === void 0 ? void 0 : userData.last_name}`;
        const payload = { user_name, otp };
        const emailSend = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.FORGOT_PASSWORD_EMAIL, to, payload);
        if (!emailSend.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.forgot_password_email_error, null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, userData === null || userData === void 0 ? void 0 : userData._id, { otp }); //update otp in database
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.otp_send, null, statusCodes_1.default.SUCCESS);
    }), //ends
    resetPassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { email, new_password, otp } = data;
        const queryObject = { email, is_verified: true, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        if (((_a = result.data) === null || _a === void 0 ? void 0 : _a.otp) !== Number(otp)) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_otp, null, statusCodes_1.default.API_ERROR);
        }
        const hashed = yield commonHelper.bycrptPasswordHash(new_password);
        const updateObj = { otp: '', password: hashed };
        const updated = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b._id, updateObj);
        if (!updated.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.password_reset_error, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.password_reset_success, null, statusCodes_1.default.SUCCESS);
    }), //ends
    verifyOtp: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, otp } = data;
        const queryObject = { email, otp, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const exists = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_otp, null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, { is_verified: true });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.otp_verify_success, null, statusCodes_1.default.SUCCESS);
    }), //ends
    resendOtp: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = data;
        const queryObject = { email, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_email, null, statusCodes_1.default.API_ERROR);
        }
        const userData = result === null || result === void 0 ? void 0 : result.data;
        const otp = commonHelper.generateOtp();
        const to = userData === null || userData === void 0 ? void 0 : userData.email;
        const user_name = `${userData === null || userData === void 0 ? void 0 : userData.first_name} ${userData === null || userData === void 0 ? void 0 : userData.last_name}`;
        const payload = { user_name, otp };
        const emailSend = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.SEND_OTP_EMAIL, to, payload);
        if (!emailSend.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.otp_send_error, null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, { otp });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.otp_resend, null, statusCodes_1.default.SUCCESS);
    }), //ends
    changePassword: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { old_password, new_password } = data;
        const exists = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: userId });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.not_registered, null, statusCodes_1.default.API_ERROR);
        }
        const comparePassword = yield commonHelper.verifyBycryptHash(old_password, (_a = exists.data) === null || _a === void 0 ? void 0 : _a.password);
        if (!comparePassword) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_old_password, null, statusCodes_1.default.API_ERROR);
        }
        //new password and old password cannot be same
        if (new_password === old_password) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.cannot_same_old_new_password, null, statusCodes_1.default.API_ERROR);
        }
        const hashed = yield commonHelper.bycrptPasswordHash(new_password);
        const result = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, userId, { password: hashed });
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.password_change_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.password_change_successfull, null, statusCodes_1.default.SUCCESS);
    }), //ends
    getUserDetails: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: userId }, { password: 0, createdAt: 0, updatedAt: 0, social_account: 0, otp: 0 });
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_user, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.user_detail, result.data, statusCodes_1.default.SUCCESS);
    }), //ends
    updateUserProfile: (data, user_id, profile_pic) => __awaiter(void 0, void 0, void 0, function* () {
        const { first_name, last_name, phone_number, country_code } = data;
        const updateObj = Object.assign(Object.assign(Object.assign(Object.assign({}, (first_name && { first_name })), (last_name && { last_name })), (phone_number && { phone_number })), (country_code && { country_code }));
        if (profile_pic) {
            //upload image to aws s3 bucket
            const s3Upload = yield services_1.default.awsService.uploadFileToS3([profile_pic]);
            if (!s3Upload.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.file_upload_error, null, statusCodes_1.default.FILE_UPLOAD_ERROR);
            }
            updateObj.profile_pic = s3Upload === null || s3Upload === void 0 ? void 0 : s3Upload.data[0];
        }
        const result = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, user_id, updateObj);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.user_account_update_error, null, statusCodes_1.default.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(result === null || result === void 0 ? void 0 : result.data);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.user_account_updated, result.data, statusCodes_1.default.SUCCESS);
    }), //ends
    deleteOrDeactivateAccount(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, reason } = data;
            const updateObj = Object.assign({ status, deactivate_by: workflow_constant_1.DEACTIVATE_BY.USER }, (reason && { reason }));
            const result = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, user_id, updateObj);
            if (!result.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.user_account_update_error, null, statusCodes_1.default.API_ERROR);
            }
            const msg = status == workflow_constant_1.USER_STATUS.DELETED ? 'deleted' : 'deactivated';
            return (0, response_util_1.showResponse)(true, `${responseMessages_1.default.users.user_account_has_been} ${msg} Successfully`, null, statusCodes_1.default.SUCCESS);
        });
    }, //ends
    refreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const { refresh_token } = data;
            const response = yield (0, auth_util_1.decodeToken)(refresh_token);
            if (!response.status) {
                return (0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.middleware) === null || _a === void 0 ? void 0 : _a.token_expired, null, statusCodes_1.default.REFRESH_TOKEN_ERROR);
            }
            const user_id = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.id;
            const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: user_id });
            if (!findUser.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_user, null, statusCodes_1.default.API_ERROR);
            }
            if (((_c = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _c === void 0 ? void 0 : _c.status) == workflow_constant_1.USER_STATUS.DEACTIVATED) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.middleware.deactivated_account, null, statusCodes_1.default.ACCOUNT_DISABLED);
            }
            if (((_d = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _d === void 0 ? void 0 : _d.status) == workflow_constant_1.USER_STATUS.DELETED) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.middleware.deleted_account, null, statusCodes_1.default.ACCOUNT_DELETED);
            }
            const tokens = yield (0, auth_util_1.generateAccessRefreshToken)((_e = findUser.data) === null || _e === void 0 ? void 0 : _e._id, (_f = findUser.data) === null || _f === void 0 ? void 0 : _f.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
            return (0, response_util_1.showResponse)(true, 'Tokens Generated Successfully', { access_token: tokens.access_token, refresh_token: tokens.refresh_token }, statusCodes_1.default.SUCCESS);
        });
    }, //ends
    logoutUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.logout_success, null, statusCodes_1.default.SUCCESS);
        });
    }, //ends
    uploadFile: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { file } = data;
        const s3Upload = yield services_1.default.awsService.uploadFileToS3([file]);
        if (!s3Upload.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.file_upload_error, {}, statusCodes_1.default.FILE_UPLOAD_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.file_upload_success, s3Upload === null || s3Upload === void 0 ? void 0 : s3Upload.data, statusCodes_1.default.SUCCESS);
    }),
}; //ends
exports.default = UserAuthHandler;
