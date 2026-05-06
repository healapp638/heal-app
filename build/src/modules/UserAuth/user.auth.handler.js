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
const user_auth_model_1 = __importDefault(require("../../modules/UserAuth/user.auth.model"));
// import { APP } from '../../constants/app.constant';
const workflow_constant_1 = require("../../constants/workflow.constant");
const services_1 = __importDefault(require("../../services"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const messages_1 = require("../../helpers/messages");
const admin_phases_model_1 = __importDefault(require("../AdminPhases/admin.phases.model"));
const user_modules_complete_phase_model_1 = __importDefault(require("../UserModules/user.modules.complete.phase.model"));
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
                fullName: name
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
        const { email, password, language } = data;
        console.log(data, 'data');
        const queryObject = { email, isVerified: true, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        console.log(findUser, 'findUser');
        if (!findUser.status) {
            console.log('user not found');
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "INVALID_CREDENTIALS"), null, statusCodes_1.default.API_ERROR);
        }
        const userData = findUser === null || findUser === void 0 ? void 0 : findUser.data;
        const is_user_social_login = !!userData.social_account.length;
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        const is_profile_completed = !!userData.dob && !!userData.country;
        if (language) {
            yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { language: language } });
        }
        if (!(userData === null || userData === void 0 ? void 0 : userData.profilePic) || (userData === null || userData === void 0 ? void 0 : userData.profilePic) == '') {
            yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { profilePic: 'file/file-1777357630130.webp' } });
        }
        if (!userData.password) {
            const otp = commonHelper.generateRandomOtp(6);
            const otpCreatedAt = new Date();
            const obj = {
                otp,
                otpCreatedAt
            };
            if (!(userData === null || userData === void 0 ? void 0 : userData.profilePic) || (userData === null || userData === void 0 ? void 0 : userData.profilePic) == '') {
                obj.profilePic = 'file/file-1777357630130.webp';
            }
            const emailPayload = {
                user_name: userData === null || userData === void 0 ? void 0 : userData.fullName,
                otp: otp,
            };
            const sendEmail = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload);
            if (!sendEmail.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_sending_email"), null, statusCodes_1.default.API_ERROR);
            }
            const res = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: userData === null || userData === void 0 ? void 0 : userData._id }, obj);
            if (!res.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "otp_sent_error"), null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "otp_sent"), {
                is_after_social_login: true,
                account_type,
                is_profile_completed,
                password: password,
            }, statusCodes_1.default.SUCCESS);
        }
        //if account deactivated by admin then throw error 
        if ((userData === null || userData === void 0 ? void 0 : userData.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && (userData === null || userData === void 0 ? void 0 : userData.deactivateBy) === workflow_constant_1.DEACTIVATE_BY.ADMIN) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "deactivated_account"), null, statusCodes_1.default.API_ERROR);
        }
        const isValid = yield commonHelper.verifyBycryptHash(password, userData === null || userData === void 0 ? void 0 : userData.password);
        if (!isValid) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "password_incorrect"), null, statusCodes_1.default.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(userData); //delete password & other keys from response
        console.log(userData, "userData");
        const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)(userData === null || userData === void 0 ? void 0 : userData._id, userData === null || userData === void 0 ? void 0 : userData.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
        //if account deactivated by user then reactivate account
        if ((userData === null || userData === void 0 ? void 0 : userData.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && (userData === null || userData === void 0 ? void 0 : userData.deactivateBy) === workflow_constant_1.DEACTIVATE_BY.USER) {
            yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: userData === null || userData === void 0 ? void 0 : userData._id }, { status: workflow_constant_1.USER_STATUS.ACTIVE, deactivateBy: '' }); //activate user again
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "login_success"), Object.assign(Object.assign({ is_after_social_login: false, account_type, is_profile_completed }, userData), { access_token, refresh_token }), statusCodes_1.default.SUCCESS);
    }), //ends
    social_login: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const { login_source, social_auth, email, name = undefined, language } = data;
        const queryObject = {
            status: { $ne: workflow_constant_1.USER_STATUS.DELETED }, //user not deleted
            $or: [
                {
                    email: email, //if main email match 
                },
                {
                    social_account: {
                        $elemMatch: { email: email } //if social email match
                    }
                },
                {
                    social_account: {
                        $elemMatch: { token: social_auth } //if social token match
                    }
                },
            ]
        }; //match condition ends 
        //check user exist or not 
        const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        const userData = findUser === null || findUser === void 0 ? void 0 : findUser.data;
        const is_user_social_login = !!((_a = userData === null || userData === void 0 ? void 0 : userData.social_account) === null || _a === void 0 ? void 0 : _a.length);
        const is_simple_login = !!(userData === null || userData === void 0 ? void 0 : userData.password);
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        const is_profile_completed = !!(userData === null || userData === void 0 ? void 0 : userData.dob) && !!(userData === null || userData === void 0 ? void 0 : userData.country);
        //if account already existed then update details and return token with login success
        if (findUser.status) {
            if (!((_b = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _b === void 0 ? void 0 : _b.profilePic) || ((_c = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _c === void 0 ? void 0 : _c.profilePic) == '') {
                yield user_auth_model_1.default.findOneAndUpdate({ _id: (_d = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _d === void 0 ? void 0 : _d._id }, { $set: { profilePic: 'file/file-1777357630130.webp' } });
            }
            if (!((_e = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _e === void 0 ? void 0 : _e.language) || ((_f = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _f === void 0 ? void 0 : _f.language) == '') {
                yield user_auth_model_1.default.findOneAndUpdate({ _id: (_g = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _g === void 0 ? void 0 : _g._id }, { $set: { language } });
            }
            //if account deactivate by admin throw error 
            if (((_h = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _h === void 0 ? void 0 : _h.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && ((_j = findUser.data) === null || _j === void 0 ? void 0 : _j.deactivateBy) === workflow_constant_1.DEACTIVATE_BY.ADMIN) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "deactivated_account"), null, statusCodes_1.default.API_ERROR);
            }
            //update social account array 
            const updateSocialInfo = yield UserAuthHandler.update_social_info(findUser, user_auth_model_1.default, data);
            if (!updateSocialInfo.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "login_error"), null, statusCodes_1.default.API_ERROR);
            }
            commonHelper.keysDeleteFromObject(findUser === null || findUser === void 0 ? void 0 : findUser.data);
            const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)((_k = findUser.data) === null || _k === void 0 ? void 0 : _k._id, (_l = findUser.data) === null || _l === void 0 ? void 0 : _l.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
            const userData = Object.assign(Object.assign({ is_after_social_login: false, account_type, is_profile_completed }, findUser === null || findUser === void 0 ? void 0 : findUser.data), { access_token, refresh_token });
            //if account deactivated by user then activate it again 
            if (((_m = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _m === void 0 ? void 0 : _m.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && ((_o = findUser.data) === null || _o === void 0 ? void 0 : _o.deactivateBy) === workflow_constant_1.DEACTIVATE_BY.USER) {
                yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: (_p = findUser.data) === null || _p === void 0 ? void 0 : _p._id }, { status: workflow_constant_1.USER_STATUS.ACTIVE, deactivateBy: '' });
            }
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "login_success"), userData, statusCodes_1.default.SUCCESS);
        }
        else {
            //if not exist then register new user 
            const newObj = {
                social_account: [
                    {
                        source: login_source,
                        email: email,
                        token: social_auth,
                        fullName: name
                    }
                ],
                email,
                fullName: name ? name : commonHelper.getFirstNameFromEmail(email),
                account_source: login_source,
                isVerified: true,
                language: language || 'en',
                profilePic: 'file/file-1777357630130.webp',
            };
            const userRef = new user_auth_model_1.default(newObj);
            const result = yield (0, db_helpers_1.createOne)(userRef);
            if (!result.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "login_error"), null, statusCodes_1.default.API_ERROR);
            }
            commonHelper.keysDeleteFromObject(result === null || result === void 0 ? void 0 : result.data);
            const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)((_q = result.data) === null || _q === void 0 ? void 0 : _q._id, (_r = result.data) === null || _r === void 0 ? void 0 : _r.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
            const userData = Object.assign(Object.assign({ is_after_social_login: false, account_type, is_profile_completed }, result === null || result === void 0 ? void 0 : result.data), { access_token, refresh_token });
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "login_success"), userData, statusCodes_1.default.SUCCESS);
        }
    }),
    register(data, profile_pic) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(profile_pic, "profile_pic");
            const { hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf, fullName, country, email, dob, password, language } = data;
            const obj = {
                hearAboutUs,
                bringsYouHere,
                howFellingLately,
                likeToFellMore,
                timeYouCommit,
                startShowingOfYourSelf,
                fullName,
                country,
                email,
                dob,
                password,
                language: language || 'en',
                account_source: 'email',
                profilePic: profile_pic || 'file/file-1777357630130.webp',
            };
            //check if match or not by email
            const queryObject = {
                status: { $ne: workflow_constant_1.USER_STATUS.DELETED },
                $or: [
                    { email }, //if account email find then throw error already existed 
                    {
                        social_account: {
                            $elemMatch: { email: email } //if account finds with social email then update account
                        }
                    },
                ]
            };
            const hashed = yield commonHelper.bycrptPasswordHash(password);
            obj.password = hashed;
            const otp = commonHelper.generateRandomOtp(6);
            obj.otp = otp;
            const emailPayload = { user_name: fullName, otp };
            // const payload = { ...data, account_source: 'email', password: hashed, otp }
            // check if user exists
            const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
            //if user exist with same account source then throw error
            if (findUser.status && ((_a = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _a === void 0 ? void 0 : _a.account_source) == 'email' && ((_b = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _b === void 0 ? void 0 : _b.isVerified)) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "email_already_exists"), null, statusCodes_1.default.API_ERROR);
            }
            //if exist with different source (through google apple login) then update details and account source else insert new account entry
            const result = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, obj, true);
            if (!result.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_register"), null, statusCodes_1.default.API_ERROR);
            }
            const sendEmail = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload);
            if (!sendEmail.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_sending_email"), null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "verification_email_sent"), null, statusCodes_1.default.SUCCESS);
        });
    },
    //ends
    forgotPassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { email } = data;
        const queryObject = { email, isVerified: true, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        // check if user exists
        const exists = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const userData = exists === null || exists === void 0 ? void 0 : exists.data;
        const language = (userData === null || userData === void 0 ? void 0 : userData.language) || 'en';
        const otp = commonHelper.generateRandomOtp(6);
        const to = `${(_a = exists === null || exists === void 0 ? void 0 : exists.data) === null || _a === void 0 ? void 0 : _a.email}`;
        const user_name = `${userData === null || userData === void 0 ? void 0 : userData.fullName}`;
        const payload = { user_name, otp };
        const emailSend = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.FORGOT_PASSWORD_EMAIL, to, payload);
        if (!emailSend.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_sending_email"), null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, userData === null || userData === void 0 ? void 0 : userData._id, { otp }); //update otp in database
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "otp_send_success"), null, statusCodes_1.default.SUCCESS);
    }), //ends
    resetPassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const { email, new_password, otp } = data;
        const queryObject = { email, isVerified: true, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const language = ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.language) || 'en';
        if (((_b = result.data) === null || _b === void 0 ? void 0 : _b.otp) !== otp) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "invalid_otp"), null, statusCodes_1.default.API_ERROR);
        }
        const hashed = yield commonHelper.bycrptPasswordHash(new_password);
        const updateObj = { otp: '', password: hashed };
        const updated = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, (_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c._id, updateObj);
        if (!updated.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_reset_password"), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "password_reset_success"), null, statusCodes_1.default.SUCCESS);
    }),
    verifyOtp: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const { email, otp, password } = data;
        if (password) {
            const hashed = yield commonHelper.bycrptPasswordHash(password);
            data.password = hashed;
        }
        const queryObject = { email, otp, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const exists = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "invalid_otp"), null, statusCodes_1.default.API_ERROR);
        }
        const language = ((_a = exists === null || exists === void 0 ? void 0 : exists.data) === null || _a === void 0 ? void 0 : _a.language) || 'en';
        yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, { isVerified: true, password: data.password });
        const userData = exists === null || exists === void 0 ? void 0 : exists.data;
        const is_user_social_login = !!userData.social_account.length;
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        const is_profile_completed = !!userData.dob && !!userData.country;
        const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)((_b = exists === null || exists === void 0 ? void 0 : exists.data) === null || _b === void 0 ? void 0 : _b._id, (_c = exists === null || exists === void 0 ? void 0 : exists.data) === null || _c === void 0 ? void 0 : _c.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "otp_verify_success"), { access_token, refresh_token, is_profile_completed, account_type, is_after_social_login: false }, statusCodes_1.default.SUCCESS);
    }),
    resendOtp: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = data;
        const queryObject = { email, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "invalid_email"), null, statusCodes_1.default.API_ERROR);
        }
        const userData = result === null || result === void 0 ? void 0 : result.data;
        const language = (userData === null || userData === void 0 ? void 0 : userData.language) || 'en';
        const otp = commonHelper.generateRandomOtp(6);
        const to = userData === null || userData === void 0 ? void 0 : userData.email;
        const user_name = `${userData === null || userData === void 0 ? void 0 : userData.fullName}`;
        const payload = { user_name, otp };
        const emailSend = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.SEND_OTP_EMAIL, to, payload);
        if (!emailSend.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "otp_send_error"), null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, { otp });
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "otp_resend"), null, statusCodes_1.default.SUCCESS);
    }), //ends
    changePassword: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { old_password, new_password } = data;
        const exists = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: userId });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const language = ((_a = exists === null || exists === void 0 ? void 0 : exists.data) === null || _a === void 0 ? void 0 : _a.language) || 'en';
        const comparePassword = yield commonHelper.verifyBycryptHash(old_password, (_b = exists.data) === null || _b === void 0 ? void 0 : _b.password);
        if (!comparePassword) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "invalid_old_password"), null, statusCodes_1.default.API_ERROR);
        }
        //new password and old password cannot be same
        if (new_password === old_password) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "cannot_same_old_new_password"), null, statusCodes_1.default.API_ERROR);
        }
        const hashed = yield commonHelper.bycrptPasswordHash(new_password);
        const result = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, userId, { password: hashed });
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_reset_password"), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "password_reset_success"), null, statusCodes_1.default.SUCCESS);
    }),
    getUserDetails: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: userId }, { createdAt: 0, updatedAt: 0, otp: 0 });
        const userData = result === null || result === void 0 ? void 0 : result.data;
        console.log(userData, 'userData');
        const is_user_social_login = !!((_a = userData === null || userData === void 0 ? void 0 : userData.social_account) === null || _a === void 0 ? void 0 : _a.length);
        console.log(is_user_social_login, 'is_user_social_login');
        const is_simple_login = !!(userData === null || userData === void 0 ? void 0 : userData.password);
        console.log(is_simple_login, 'is_simple_login');
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        console.log(account_type, 'account_type');
        const is_profile_completed = !!(userData === null || userData === void 0 ? void 0 : userData.dob) && !!(userData === null || userData === void 0 ? void 0 : userData.country);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const language = ((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.language) || 'en';
        //calculate progress
        const Allpahses = yield admin_phases_model_1.default.aggregate([
            {
                $match: {
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        const total_points = ((_c = Allpahses[0]) === null || _c === void 0 ? void 0 : _c.total_points) || 0;
        const CompletedPhases = yield user_modules_complete_phase_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "phases",
                    localField: "phase_id",
                    foreignField: "_id",
                    as: "phase"
                }
            },
            {
                $unwind: "$phase"
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: "$phase.points" }
                }
            }
        ]);
        const total_earned_points = ((_d = CompletedPhases[0]) === null || _d === void 0 ? void 0 : _d.total_points) || 0;
        const completedPercentage = total_points > 0
            ? (total_earned_points / total_points) * 100
            : 0;
        // Calculate level
        const totalLevels = 5;
        let currentLevel = Math.ceil((completedPercentage / 100) * totalLevels);
        // Edge case fix
        if (currentLevel === 0)
            currentLevel = 1;
        if (currentLevel > totalLevels)
            currentLevel = totalLevels;
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "user_detail"), Object.assign(Object.assign({}, result.data), { account_type, is_profile_completed, total_points, total_earned_points, completedPercentage, currentLevel }), statusCodes_1.default.SUCCESS);
    }),
    updateUserProfile: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        const { fullName, country, dob, profilePic, language } = data;
        const updateObj = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (fullName && { fullName })), (country && { country })), (dob && { dob })), (language && { language })), (profilePic && { profilePic }));
        const user = yield user_auth_model_1.default.findOne({ _id: user_id });
        console.log(user, 'user');
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const user_language = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        console.log(user_id, '0');
        const result = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, user_id, updateObj);
        console.log(result, 'result');
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(user_language || 'en', "user_account_update_error"), null, statusCodes_1.default.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(result === null || result === void 0 ? void 0 : result.data);
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(user_language || 'en', "user_account_updated"), result.data, statusCodes_1.default.SUCCESS);
    }),
    deleteOrDeactivateAccount(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, reason } = data;
            const updateObj = Object.assign({ status, deactivateBy: workflow_constant_1.DEACTIVATE_BY.USER }, (reason && { reason }));
            const user = yield user_auth_model_1.default.findOne({ _id: user_id });
            if (!user) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
            }
            const user_language = (user === null || user === void 0 ? void 0 : user.language) || 'en';
            const result = yield (0, db_helpers_1.findByIdAndUpdate)(user_auth_model_1.default, user_id, updateObj);
            if (!result.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(user_language || 'en', "user_account_update_error"), null, statusCodes_1.default.API_ERROR);
            }
            const msg = status == workflow_constant_1.USER_STATUS.DELETED ? (0, messages_1.getMessage)(user_language || 'en', "user_account_has_been_deleted") : (0, messages_1.getMessage)(user_language || 'en', "user_account_has_been_deactivated");
            return (0, response_util_1.showResponse)(true, msg, null, statusCodes_1.default.SUCCESS);
        });
    }, //ends
    refreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const { refresh_token } = data;
            const response = yield (0, auth_util_1.decodeToken)(refresh_token);
            if (!response.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "token_expired"), null, statusCodes_1.default.REFRESH_TOKEN_ERROR);
            }
            const user_id = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.id;
            const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: user_id });
            if (!findUser.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
            }
            const user_language = ((_b = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _b === void 0 ? void 0 : _b.language) || 'en';
            if (((_c = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _c === void 0 ? void 0 : _c.status) == workflow_constant_1.USER_STATUS.DEACTIVATED) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(user_language || 'en', "user_account_has_been_deactivated"), null, statusCodes_1.default.ACCOUNT_DISABLED);
            }
            if (((_d = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _d === void 0 ? void 0 : _d.status) == workflow_constant_1.USER_STATUS.DELETED) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(user_language || 'en', "user_account_has_been_deleted"), null, statusCodes_1.default.ACCOUNT_DELETED);
            }
            const tokens = yield (0, auth_util_1.generateAccessRefreshToken)((_e = findUser.data) === null || _e === void 0 ? void 0 : _e._id, (_f = findUser.data) === null || _f === void 0 ? void 0 : _f.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(user_language || 'en', "tokens_generated_successfully"), { access_token: tokens.access_token, refresh_token: tokens.refresh_token }, statusCodes_1.default.SUCCESS);
        });
    },
    logoutUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)('en', "logout_success"), null, statusCodes_1.default.SUCCESS);
        });
    },
    uploadFile: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { file } = data;
        const s3Upload = yield services_1.default.awsService.uploadFileToS3([file]);
        console.log(s3Upload, 's3Upload');
        if (!s3Upload.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.file_upload_error, {}, statusCodes_1.default.FILE_UPLOAD_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.file_upload_success, s3Upload === null || s3Upload === void 0 ? void 0 : s3Upload.data, statusCodes_1.default.SUCCESS);
    }),
    getUserDetailsUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: userId }, { password: 0, createdAt: 0, updatedAt: 0, social_account: 0, otp: 0 });
        const language = ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.language) || 'en';
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "user_detail"), result.data, statusCodes_1.default.SUCCESS);
    }),
};
exports.default = UserAuthHandler;
