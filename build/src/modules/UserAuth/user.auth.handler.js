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
const user_modules_complete_phase_model_1 = __importDefault(require("../UserModules/user.modules.complete.phase.model"));
const user_daily_challenges_model_1 = __importDefault(require("../UserChallenges/user.daily.challenges.model"));
const user_weekly_challenges_model_1 = __importDefault(require("../UserChallenges/user.weekly.challenges.model"));
const user_recentHomeTheme_model_1 = __importDefault(require("../UserHomeTheme/user.recentHomeTheme.model"));
const bullMqWorker_1 = require("../../helpers/bullMqWorker");
const user_journel_model_1 = __importDefault(require("../UserJournel/user.journel.model"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// import moment from "moment";
const user_deeplink_model_1 = __importDefault(require("../UserAffirmation/user.deeplink.model"));
const UserAuthHandler = {
    // update_social_info: async (findUser: any, model: any, data: any) => {
    //     try {
    //         const { login_source, social_auth, email, name, hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith } = data
    //         const editObj: any = {}
    //         const social_account = {
    //             email,
    //             source: login_source,
    //             token: social_auth,
    //             fullName: name,
    //             hearAboutUs: hearAboutUs,
    //             howFellingLately: howFellingLately,
    //             feelThatWay: feelThatWay,
    //             likeToFellMore: likeToFellMore,
    //             helpFeelBetter: helpFeelBetter,
    //             stopFeelBetter: stopFeelBetter,
    //             timeYouCommit: timeYouCommit,
    //             goalStartWith: goalStartWith
    //         }
    //         // Check if social account exists in device_info array
    //         const accountIndex = findUser?.data?.social_account?.findIndex((info: any) => info?.source === data?.login_source);
    //         //if exist then update else add new
    //         if (accountIndex !== -1) {
    //             editObj[`social_account.${accountIndex}`] = social_account;
    //         } else {
    //             editObj.$push = { social_account: social_account }
    //         }
    //         const response = await findAndUpdatePushOrSet(model, { _id: findUser.data?._id }, editObj);
    //     const is_onboarding = [
    //     response?.data?.email,
    //     response?.data?.hearAboutUs,
    //     response?.data?.howFellingLately,
    //     response?.data?.feelThatWay,
    //     response?.data?.likeToFellMore,
    //     response?.data?.helpFeelBetter,
    //     response?.data?.stopFeelBetter,
    //     response?.data?.timeYouCommit,
    //     response?.data?.goalStartWith,
    //     response?.data?.fullName
    //     ].every(
    //     value =>
    //         value !== undefined &&
    //         value !== null &&
    //         String(value).trim() !== ''
    //    );
    //    if (response?.data?.is_onboarding !== is_onboarding) {
    //     await userAuthModel.updateOne(
    //         { _id: response.data?._id },
    //         { $set: { is_onboarding } }
    //     );
    //    }
    //    console.log(response, "response update_social_info")
    //         //return update result
    //         if (response.status) {
    //             return { status: true, data: response.data }
    //         } else {
    //             return { status: false, data: null }
    //         }
    //     } catch (error) {
    //         console.log(error, "error update_device_idd")
    //         return { status: false }
    //     }
    // },//ends
    update_social_info: (findUser, model, data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const { login_source, social_auth, email, name, hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, language, timeZone } = data;
            console.log(data, "dtaaaaa");
            const editObj = {
                $set: {}
            };
            console.log(data, "data");
            // =========================================
            // UPDATE ROOT USER FIELDS
            // =========================================
            if (email !== undefined)
                editObj.$set.email = email;
            if (name !== undefined)
                editObj.$set.fullName = name;
            if (language !== undefined)
                editObj.$set.language = language;
            if (timeZone !== undefined)
                editObj.$set.timeZone = timeZone;
            if (hearAboutUs !== undefined)
                editObj.$set.hearAboutUs = hearAboutUs;
            if (howFellingLately !== undefined)
                editObj.$set.howFellingLately = howFellingLately;
            if (feelThatWay !== undefined)
                editObj.$set.feelThatWay = feelThatWay;
            if (likeToFellMore !== undefined)
                editObj.$set.likeToFellMore = likeToFellMore;
            if (helpFeelBetter !== undefined)
                editObj.$set.helpFeelBetter = helpFeelBetter;
            if (stopFeelBetter !== undefined)
                editObj.$set.stopFeelBetter = stopFeelBetter;
            if (timeYouCommit !== undefined)
                editObj.$set.timeYouCommit = timeYouCommit;
            if (goalStartWith !== undefined)
                editObj.$set.goalStartWith = goalStartWith;
            // =========================================
            // SOCIAL ACCOUNT OBJECT
            // =========================================
            const social_account = {
                email,
                source: login_source,
                token: social_auth,
                fullName: name
            };
            const accountIndex = (_b = (_a = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _a === void 0 ? void 0 : _a.social_account) === null || _b === void 0 ? void 0 : _b.findIndex((info) => (info === null || info === void 0 ? void 0 : info.source) === login_source);
            if (accountIndex !== -1) {
                editObj.$set[`social_account.${accountIndex}`] = social_account;
            }
            else {
                editObj.$push = {
                    social_account
                };
            }
            // =========================================
            // UPDATE USER
            // =========================================
            yield model.updateOne({ _id: (_c = findUser.data) === null || _c === void 0 ? void 0 : _c._id }, editObj);
            // =========================================
            // GET UPDATED USER
            // =========================================
            const updatedUser = yield model
                .findById((_d = findUser.data) === null || _d === void 0 ? void 0 : _d._id)
                .lean();
            // =========================================
            // CHECK ONBOARDING STATUS
            // =========================================
            const is_onboarding = [
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.hearAboutUs,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.howFellingLately,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.feelThatWay,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.likeToFellMore,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.helpFeelBetter,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.stopFeelBetter,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.timeYouCommit,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.goalStartWith,
                updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.fullName
            ].every(value => value !== undefined &&
                value !== null &&
                String(value).trim() !== '');
            console.log(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.is_onboarding, is_onboarding, "data");
            if ((updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.is_onboarding) !== is_onboarding) {
                yield model.updateOne({ _id: updatedUser._id }, { $set: { is_onboarding } });
                updatedUser.is_onboarding = is_onboarding;
            }
            return {
                status: true,
                data: updatedUser
            };
        }
        catch (error) {
            console.log(error, "error update_social_info");
            return {
                status: false,
                data: null
            };
        }
    }),
    login: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password, language, timeZone } = data;
        const queryObject = { email, isVerified: true, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!findUser.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "INVALID_CREDENTIALS"), null, statusCodes_1.default.API_ERROR);
        }
        const userData = findUser === null || findUser === void 0 ? void 0 : findUser.data;
        console.log(timeZone, 'timeZone');
        yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { timeZone: timeZone } });
        // challenges logic start
        yield bullMqWorker_1.ChallengesQueue.add('challenges', { userData }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            jobId: userData === null || userData === void 0 ? void 0 : userData._id.toString(),
        });
        const is_user_social_login = !!userData.social_account.length;
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        // const is_profile_completed = !!userData.dob && !!userData.country
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
                is_profile_completed: true,
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
        const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)(userData === null || userData === void 0 ? void 0 : userData._id, userData === null || userData === void 0 ? void 0 : userData.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
        //if account deactivated by user then reactivate account
        if ((userData === null || userData === void 0 ? void 0 : userData.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && (userData === null || userData === void 0 ? void 0 : userData.deactivateBy) === workflow_constant_1.DEACTIVATE_BY.USER) {
            yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: userData === null || userData === void 0 ? void 0 : userData._id }, { status: workflow_constant_1.USER_STATUS.ACTIVE, deactivateBy: '' }); //activate user again
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "login_success"), Object.assign(Object.assign({ is_after_social_login: false, account_type, is_profile_completed: true }, userData), { access_token, refresh_token }), statusCodes_1.default.SUCCESS);
    }), //ends
    social_login: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        const { login_source, social_auth, email, name = undefined, language, timeZone, hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith } = data;
        console.log(data, "dattttaaaa");
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
        // const is_profile_completed = !!userData?.dob && !!userData?.country
        //if account already existed then update details and return token with login success
        if (findUser.status) {
            //challenges logic start
            // console.log(goalStartWith,"goalStartWith")
            const data = findUser === null || findUser === void 0 ? void 0 : findUser.data;
            // console.log(data,"datatatatta")
            const updatedata = yield user_auth_model_1.default.findOneAndUpdate({ _id: data === null || data === void 0 ? void 0 : data._id }, { $set: { timeZone: timeZone, hearAboutUs: hearAboutUs, howFellingLately: howFellingLately, feelThatWay: feelThatWay, likeToFellMore: likeToFellMore, helpFeelBetter: helpFeelBetter, stopFeelBetter: stopFeelBetter, timeYouCommit: timeYouCommit, goalStartWith: goalStartWith } }, { new: true });
            // console.log(updatedata,"updatedata")
            yield bullMqWorker_1.ChallengesQueue.add('challenges', { userData: data }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                jobId: data === null || data === void 0 ? void 0 : data._id.toString(),
            });
            // const challengesDetails = await commonHelper.challengsFn(data);
            // const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
            // const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
            // const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
            // const payload: any = challengesDetails?.payload;
            // if (isOnBoardingComplete && !isDailyChallengeExist) {
            //     const res = await generateUserChallengesDaily(payload, data?._id);
            //     console.log(res, 'res')
            //     const result = await userDailyChallengesModel.insertMany(res.data)
            //     if (result) {
            //         await userAuthModel.findOneAndUpdate({ _id: data?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date() } })
            //     }
            // }
            // if (isOnBoardingComplete && !isWeeklyChallengeExist) {
            //     const res = await generateUserChallengesWeekly(payload, data?._id)
            //     const result = await userWeeklyChallengesModel.insertMany(res.data)
            //     if (result) {
            //         await userAuthModel.findOneAndUpdate({ _id: data?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date() } })
            //     }
            // }
            //end
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
            const updateSocialInfo = yield UserAuthHandler.update_social_info(findUser, user_auth_model_1.default, updatedata);
            if (!updateSocialInfo.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "login_error"), null, statusCodes_1.default.API_ERROR);
            }
            commonHelper.keysDeleteFromObject(findUser === null || findUser === void 0 ? void 0 : findUser.data);
            const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)((_k = findUser.data) === null || _k === void 0 ? void 0 : _k._id, (_l = findUser.data) === null || _l === void 0 ? void 0 : _l.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
            const userData = Object.assign(Object.assign({ is_after_social_login: false, account_type, is_profile_completed: true }, findUser === null || findUser === void 0 ? void 0 : findUser.data), { access_token, refresh_token });
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
                hearAboutUs,
                howFellingLately,
                feelThatWay,
                likeToFellMore,
                helpFeelBetter,
                stopFeelBetter,
                timeYouCommit,
                goalStartWith
            };
            console.log(newObj, "newObj>>>>>>>>>>>>>>>");
            const userRef = new user_auth_model_1.default(newObj);
            const result = yield (0, db_helpers_1.createOne)(userRef);
            if (!result.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "login_error"), null, statusCodes_1.default.API_ERROR);
            }
            //challenges logic start
            yield bullMqWorker_1.ChallengesQueue.add('challenges', { userData: result === null || result === void 0 ? void 0 : result.data }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                jobId: (_q = result === null || result === void 0 ? void 0 : result.data) === null || _q === void 0 ? void 0 : _q._id.toString(),
            });
            // const challengesDetails = await commonHelper.challengsFn(result?.data);
            // const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
            // const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
            // const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
            // const payload: any = challengesDetails?.payload;
            // if (isOnBoardingComplete && !isDailyChallengeExist) {
            //     const res = await generateUserChallengesDaily(payload, result?.data?._id);
            //     const results = await userDailyChallengesModel.insertMany(res.data)
            //     if (results) {
            //         await userAuthModel.findOneAndUpdate({ _id: result?.data?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date() } })
            //     }
            // }
            // if (isOnBoardingComplete && !isWeeklyChallengeExist) {
            //     const res = await generateUserChallengesWeekly(payload, result?.data?._id);
            //     const results = await userWeeklyChallengesModel.insertMany(res.data)
            //     if (results) {
            //         await userAuthModel.findOneAndUpdate({ _id: result?.data?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date() } })
            //     }
            // }
            //end
            commonHelper.keysDeleteFromObject(result === null || result === void 0 ? void 0 : result.data);
            const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)((_r = result.data) === null || _r === void 0 ? void 0 : _r._id, (_s = result.data) === null || _s === void 0 ? void 0 : _s.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
            const is_onboarding = [
                (_t = result === null || result === void 0 ? void 0 : result.data) === null || _t === void 0 ? void 0 : _t.email,
                (_u = result === null || result === void 0 ? void 0 : result.data) === null || _u === void 0 ? void 0 : _u.hearAboutUs,
                (_v = result === null || result === void 0 ? void 0 : result.data) === null || _v === void 0 ? void 0 : _v.howFellingLately,
                (_w = result === null || result === void 0 ? void 0 : result.data) === null || _w === void 0 ? void 0 : _w.feelThatWay,
                (_x = result === null || result === void 0 ? void 0 : result.data) === null || _x === void 0 ? void 0 : _x.likeToFellMore,
                (_y = result === null || result === void 0 ? void 0 : result.data) === null || _y === void 0 ? void 0 : _y.helpFeelBetter,
                (_z = result === null || result === void 0 ? void 0 : result.data) === null || _z === void 0 ? void 0 : _z.stopFeelBetter,
                (_0 = result === null || result === void 0 ? void 0 : result.data) === null || _0 === void 0 ? void 0 : _0.timeYouCommit,
                (_1 = result === null || result === void 0 ? void 0 : result.data) === null || _1 === void 0 ? void 0 : _1.goalStartWith,
                (_2 = result === null || result === void 0 ? void 0 : result.data) === null || _2 === void 0 ? void 0 : _2.fullName
            ].every(value => value !== undefined &&
                value !== null &&
                String(value).trim() !== '');
            if (((_3 = result === null || result === void 0 ? void 0 : result.data) === null || _3 === void 0 ? void 0 : _3.is_onboarding) !== is_onboarding) {
                yield user_auth_model_1.default.updateOne({ _id: (_4 = result.data) === null || _4 === void 0 ? void 0 : _4._id }, { $set: { is_onboarding } });
            }
            const userData = Object.assign(Object.assign({ is_after_social_login: false, account_type, is_profile_completed: true }, result === null || result === void 0 ? void 0 : result.data), { access_token, refresh_token, is_onboarding: is_onboarding });
            console.log(userData, "userrrrrrrrrdatatatus");
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
            console.log(emailPayload, "emailPayload");
            // const payload = { ...data, account_source: 'email', password: hashed, otp }
            // check if user exists
            const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
            //if user exist with same account source then throw error
            if (findUser.status && ((_a = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _a === void 0 ? void 0 : _a.account_source) == 'email' && ((_b = findUser === null || findUser === void 0 ? void 0 : findUser.data) === null || _b === void 0 ? void 0 : _b.isVerified)) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "email_already_exists"), null, statusCodes_1.default.API_ERROR);
            }
            console.log(findUser, "findUser");
            //if exist with different source (through google apple login) then update details and account source else insert new account entry
            const result = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, obj, true);
            if (!result.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_register"), null, statusCodes_1.default.API_ERROR);
            }
            console.log(result, "result");
            console.log(workflow_constant_1.EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload, "send emailllll");
            const sendEmail = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload);
            console.log(sendEmail, "sendEmail");
            if (!sendEmail.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_sending_email"), null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "verification_email_sent"), null, statusCodes_1.default.SUCCESS);
        });
    },
    sendMagicLink: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, email, language } = data;
            // =========================================
            // GENERATE DEEPLINK CODE
            // =========================================
            const code = commonHelper.generateRandomAlphanumeric(8);
            yield user_deeplink_model_1.default.updateMany({
                email: email.toLowerCase().trim(),
                isUsed: false,
                expiresAt: { $gt: new Date() }
            }, {
                $set: {
                    isUsed: true,
                    usedAt: new Date(),
                    // invalidatedReason: 'NEW_LINK_GENERATED'
                }
            });
            // save deeplink data
            yield user_deeplink_model_1.default.create({
                email: email.toLowerCase().trim(),
                code,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            });
            console.log(code, "code");
            // =========================================
            // DEEPLINK URL
            // =========================================
            const deeplink = `https://apidev.heal-app.com/link/${code}?email=${email}&hearAboutUs=${hearAboutUs}&howFellingLately=${howFellingLately}&feelThatWay=${feelThatWay}&likeToFellMore=${likeToFellMore}&helpFeelBetter=${helpFeelBetter}&stopFeelBetter=${stopFeelBetter}&timeYouCommit=${timeYouCommit}&goalStartWith=${goalStartWith}&language=${language}&fullName=${fullName}`;
            console.log(deeplink, "deeplink");
            // =========================================
            // EMAIL PAYLOAD
            // =========================================
            const emailPayload = {
                user_name: fullName,
                magic_link: deeplink,
            };
            console.log(emailPayload, "emailPayload");
            // =========================================
            // SEND EMAIL
            // =========================================
            const sendEmail = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.MAGIC_LINK, email, emailPayload);
            console.log(sendEmail, "sendEmail");
            if (!sendEmail.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_sending_email"), null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "verification_email_sent"), deeplink, statusCodes_1.default.SUCCESS);
        }
        catch (err) {
            console.log(err, "register err");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.error_while_create_acc, null, statusCodes_1.default.API_ERROR);
        }
    }),
    magicLinkLogin: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { email, hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language, timeZone, code } = data;
        const lowercaseEmail = email ? email.toLowerCase().trim() : '';
        const queryObject = { email: lowercaseEmail, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } };
        const findUser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        console.log(code, "codeeee");
        const deepLink = yield user_deeplink_model_1.default.findOneAndUpdate({
            code,
            isUsed: false,
            expiresAt: { $gt: new Date() },
            status: workflow_constant_1.USER_STATUS.ACTIVE
        }, {
            $set: {
                isUsed: true,
                usedAt: new Date()
            }
        }, {
            new: true
        });
        console.log(deepLink, "deepLink");
        if (!deepLink) {
            console.log("Magic link is invalid, innnnnnnnnnnnnnn");
            return (0, response_util_1.showResponse)(false, "Magic link is invalid, expired, or already used", null, statusCodes_1.default.API_ERROR);
        }
        let userData;
        // const updateData: any = {
        //     email: lowercaseEmail,hearAboutUs,howFellingLately,feelThatWay,likeToFellMore,helpFeelBetter,stopFeelBetter,
        //     timeYouCommit,goalStartWith,fullName,language: language || 'en',timeZone,isVerified: true
        // };
        const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ email: lowercaseEmail, isVerified: true }, ((hearAboutUs === null || hearAboutUs === void 0 ? void 0 : hearAboutUs.trim()) && { hearAboutUs })), ((howFellingLately === null || howFellingLately === void 0 ? void 0 : howFellingLately.trim()) && { howFellingLately })), ((feelThatWay === null || feelThatWay === void 0 ? void 0 : feelThatWay.trim()) && { feelThatWay })), ((likeToFellMore === null || likeToFellMore === void 0 ? void 0 : likeToFellMore.trim()) && { likeToFellMore })), ((helpFeelBetter === null || helpFeelBetter === void 0 ? void 0 : helpFeelBetter.trim()) && { helpFeelBetter })), ((stopFeelBetter === null || stopFeelBetter === void 0 ? void 0 : stopFeelBetter.trim()) && { stopFeelBetter })), ((timeYouCommit === null || timeYouCommit === void 0 ? void 0 : timeYouCommit.trim()) && { timeYouCommit })), ((goalStartWith === null || goalStartWith === void 0 ? void 0 : goalStartWith.trim()) && { goalStartWith })), ((fullName === null || fullName === void 0 ? void 0 : fullName.trim()) && { fullName })), ((language === null || language === void 0 ? void 0 : language.trim()) && { language })), ((timeZone === null || timeZone === void 0 ? void 0 : timeZone.trim()) && { timeZone }));
        if (findUser.status) {
            const existingUser = findUser.data;
            if (!(existingUser === null || existingUser === void 0 ? void 0 : existingUser.profilePic) || (existingUser === null || existingUser === void 0 ? void 0 : existingUser.profilePic) === '') {
                updateData.profilePic = 'file/file-1777357630130.webp';
            }
            const updateRes = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: existingUser._id }, updateData);
            if (!updateRes.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "INVALID_CREDENTIALS"), null, statusCodes_1.default.API_ERROR);
            }
            userData = updateRes.data;
        }
        else {
            updateData.profilePic = 'file/file-1777357630130.webp';
            const newObj = new user_auth_model_1.default(updateData);
            const createResult = yield (0, db_helpers_1.createOne)(newObj);
            if (!createResult.status) {
                return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "err_while_register"), null, statusCodes_1.default.API_ERROR);
            }
            userData = createResult.data;
        }
        console.log(timeZone, 'timeZone');
        // challenges logic start
        yield bullMqWorker_1.ChallengesQueue.add('challenges', { userData }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            jobId: userData === null || userData === void 0 ? void 0 : userData._id.toString(),
        });
        const is_user_social_login = !!((_a = userData.social_account) === null || _a === void 0 ? void 0 : _a.length);
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        // const is_profile_completed = !!userData.dob && !!userData.country;
        //if account deactivated by admin then throw error 
        if ((userData === null || userData === void 0 ? void 0 : userData.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && (userData === null || userData === void 0 ? void 0 : userData.deactivateBy) === workflow_constant_1.DEACTIVATE_BY.ADMIN) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(language || 'en', "deactivated_account"), null, statusCodes_1.default.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(userData); //delete password & other keys from response
        const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)(userData === null || userData === void 0 ? void 0 : userData._id, userData === null || userData === void 0 ? void 0 : userData.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
        //if account deactivated by user then reactivate account
        if ((userData === null || userData === void 0 ? void 0 : userData.status) == workflow_constant_1.USER_STATUS.DEACTIVATED && (userData === null || userData === void 0 ? void 0 : userData.deactivateBy) === workflow_constant_1.DEACTIVATE_BY.USER) {
            yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: userData === null || userData === void 0 ? void 0 : userData._id }, { status: workflow_constant_1.USER_STATUS.ACTIVE, deactivateBy: '' }); //activate user again
        }
        // =========================================
        // CHECK ONBOARDING STATUS
        // =========================================
        const is_onboarding = [
            userData === null || userData === void 0 ? void 0 : userData.email,
            userData === null || userData === void 0 ? void 0 : userData.hearAboutUs,
            userData === null || userData === void 0 ? void 0 : userData.howFellingLately,
            userData === null || userData === void 0 ? void 0 : userData.feelThatWay,
            userData === null || userData === void 0 ? void 0 : userData.likeToFellMore,
            userData === null || userData === void 0 ? void 0 : userData.helpFeelBetter,
            userData === null || userData === void 0 ? void 0 : userData.stopFeelBetter,
            userData === null || userData === void 0 ? void 0 : userData.timeYouCommit,
            userData === null || userData === void 0 ? void 0 : userData.goalStartWith,
            userData === null || userData === void 0 ? void 0 : userData.fullName
        ].every(value => value !== undefined &&
            value !== null &&
            String(value).trim() !== '');
        console.log(userData === null || userData === void 0 ? void 0 : userData.is_onboarding, is_onboarding, "data");
        if ((userData === null || userData === void 0 ? void 0 : userData.is_onboarding) !== is_onboarding) {
            console.log("first");
            yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: userData._id }, { 'is_onboarding': is_onboarding });
            userData.is_onboarding = is_onboarding;
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "login_success"), Object.assign(Object.assign({ is_after_social_login: false, account_type, is_profile_completed: true, is_onboarding }, userData), { access_token, refresh_token }), statusCodes_1.default.SUCCESS);
    }), //ends
    //ends
    // toggleBiometric: async (userId: string): Promise<ApiResponse> => {
    //     try {
    //         // find user
    //         const user = await userAuthModel.findOne({
    //             _id: commonHelper.convertToObjectId(userId),
    //             status: USER_STATUS.ACTIVE,
    //         });
    //         if (!user) {
    //             return showResponse(
    //                 false,
    //                 responseMessage.common.data_not_found,
    //                 null
    //             );
    //         }
    //         // toggle value
    //         user.is_biometric = !user.is_biometric;
    //         await user.save();
    //         return showResponse(
    //             true,
    //             "Biometric status updated successfully",
    //             {
    //                 is_biometric: user.is_biometric,
    //             },
    //             statusCodes.SUCCESS
    //         );
    //     } catch {
    //         return showResponse(
    //             false,
    //             "err while updating status",
    //             null
    //         );
    //     }
    // },
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
        // const is_profile_completed = !!userData.dob && !!userData.country
        const { access_token, refresh_token } = yield (0, auth_util_1.generateAccessRefreshToken)((_b = exists === null || exists === void 0 ? void 0 : exists.data) === null || _b === void 0 ? void 0 : _b._id, (_c = exists === null || exists === void 0 ? void 0 : exists.data) === null || _c === void 0 ? void 0 : _c.user_type, interfaces_util_1.tokenUserTypeInterface.USER);
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "otp_verify_success"), { access_token, refresh_token, is_profile_completed: true, account_type, is_after_social_login: false }, statusCodes_1.default.SUCCESS);
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
        var _a, _b, _c, _d, _e, _f;
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: userId }, { createdAt: 0, updatedAt: 0, otp: 0 });
        const userData = result === null || result === void 0 ? void 0 : result.data;
        const is_user_social_login = !!((_a = userData === null || userData === void 0 ? void 0 : userData.social_account) === null || _a === void 0 ? void 0 : _a.length);
        const is_simple_login = !!(userData === null || userData === void 0 ? void 0 : userData.password);
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        // const is_profile_completed = !!userData?.dob && !!userData?.country
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const language = ((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.language) || 'en';
        //calculate progress start
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
        const completedWeeklyChallenges = yield user_weekly_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        const completedDailyChallenges = yield user_daily_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        const startOfDay = (0, moment_timezone_1.default)().tz((userData === null || userData === void 0 ? void 0 : userData.timeZone) || 'America/New_York').startOf('day').toDate();
        const endOfDay = (0, moment_timezone_1.default)().tz((userData === null || userData === void 0 ? void 0 : userData.timeZone) || 'America/New_York').endOf('day').toDate();
        const totalJournels = yield user_journel_model_1.default.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalJournelEarnedPoints = totalJournels > 0
            ? ((totalJournels - 1) * 10) + 25
            : 0;
        const total_earned_points = (((_c = CompletedPhases[0]) === null || _c === void 0 ? void 0 : _c.total_points) || 0) + (((_d = completedWeeklyChallenges[0]) === null || _d === void 0 ? void 0 : _d.total_points) || 0) + (((_e = completedDailyChallenges[0]) === null || _e === void 0 ? void 0 : _e.total_points) || 0) + totalJournelEarnedPoints || 0 + (userData === null || userData === void 0 ? void 0 : userData.streak_credit) || 0;
        // console.log("total_earned_points===========>", total_earned_points);
        // console.log("userData.streak_credit===========>", userData?.streak_credit);
        const pointThresholds = [
            99, 235, 460, 740, 1070, 1450, 1875, 2345,
            2860, 3415, 4015, 4650, 5325, 6040, 6795,
            7590, 8420, 9290, 10195, 11140, 12120,
            13135, 14185, 15270, 16390, 17545,
            18730, 19955, 21215, 22505
        ];
        const total_points = (_f = pointThresholds.find((curelem) => total_earned_points < curelem)) !== null && _f !== void 0 ? _f : 22505;
        const completedPercentage = total_points > 0
            ? (Math.round((total_earned_points / total_points) * 100))
            : 0;
        // Calculate level
        const totalLevels = 30;
        let currentLevel = total_earned_points < 99 ? 1 : total_earned_points < 235 ? 2 : total_earned_points < 460 ? 3 : total_earned_points < 740 ? 4 : total_earned_points < 1070 ? 5 : total_earned_points < 1450 ? 6 : total_earned_points < 1875 ? 7 : total_earned_points < 2345 ? 8 : total_earned_points < 2860 ? 9 : total_earned_points < 3415 ? 10 : total_earned_points < 4015 ? 11 : total_earned_points < 4650 ? 12 : total_earned_points < 5325 ? 13 : total_earned_points < 6040 ? 14 : total_earned_points < 6795 ? 15 : total_earned_points < 7590 ? 16 : total_earned_points < 8420 ? 17 : total_earned_points < 9290 ? 18 : total_earned_points < 10195 ? 19 : total_earned_points < 11140 ? 20 : total_earned_points < 12120 ? 21 : total_earned_points < 13135 ? 22 : total_earned_points < 14185 ? 23 : total_earned_points < 15270 ? 24 : total_earned_points < 16390 ? 25 : total_earned_points < 17545 ? 26 : total_earned_points < 18730 ? 27 : total_earned_points < 19955 ? 28 : total_earned_points < 21215 ? 29 : total_earned_points < 22505 ? 30 : 31;
        // Edge case fix
        if (currentLevel === 0)
            currentLevel = 1;
        if (currentLevel > totalLevels)
            currentLevel = totalLevels;
        //calculating progress end
        const homeThemeAggregate = [
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "homethemeschemas",
                    localField: "homeTheme_id",
                    foreignField: "_id",
                    as: "themeData",
                },
            },
            {
                $unwind: {
                    path: "$themeData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: "$themeData._id",
                    imgUrl: "$themeData.imgUrl",
                    categoryTheme_id: "$themeData.categoryTheme_id",
                    createdAt: "$themeData.createdAt",
                    updatedAt: "$themeData.updatedAt",
                },
            },
        ];
        const homeThemeResult = yield user_recentHomeTheme_model_1.default.aggregate(homeThemeAggregate);
        const homeTheme = (homeThemeResult === null || homeThemeResult === void 0 ? void 0 : homeThemeResult[0]) || null;
        const is_onboarding_complete = yield commonHelper.challengsFn(userData);
        const isOnBoardingComplete = is_onboarding_complete === null || is_onboarding_complete === void 0 ? void 0 : is_onboarding_complete.isOnBoardingComplete;
        const totalDailyChallenges = yield user_daily_challenges_model_1.default.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            createdAt: {
                $gte: (0, moment_timezone_1.default)().startOf('day').toDate(),
                $lte: (0, moment_timezone_1.default)().endOf('day').toDate()
            }
        });
        const totalWeeklyChallanges = yield user_weekly_challenges_model_1.default.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            createdAt: {
                $gte: (0, moment_timezone_1.default)().startOf('week').toDate(),
                $lte: (0, moment_timezone_1.default)().endOf('week').toDate()
            }
        });
        let isUnderProgress = false;
        if (isOnBoardingComplete && totalDailyChallenges == 0 && totalWeeklyChallanges == 0) {
            isUnderProgress = true;
        }
        const result2 = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: userId }, { createdAt: 0, updatedAt: 0, otp: 0, password: 0 });
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language || 'en', "user_detail"), Object.assign(Object.assign({}, result2.data), { account_type, is_profile_completed: true, total_points, total_earned_points, completedPercentage, currentLevel, homeTheme, isOnBoardingComplete, isUnderProgress }), statusCodes_1.default.SUCCESS);
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
    completeOnboarding: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language } = data;
        const userDetails = yield user_auth_model_1.default.findOne({ _id: commonHelper.convertToObjectId(userId), status: workflow_constant_1.USER_STATUS.ACTIVE });
        if (!userDetails) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const user_language = (userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en';
        const updateObj = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((language === null || language === void 0 ? void 0 : language.trim()) && { language })), ((hearAboutUs === null || hearAboutUs === void 0 ? void 0 : hearAboutUs.trim()) && { hearAboutUs })), ((feelThatWay === null || feelThatWay === void 0 ? void 0 : feelThatWay.trim()) && { feelThatWay })), ((howFellingLately === null || howFellingLately === void 0 ? void 0 : howFellingLately.trim()) && { howFellingLately })), ((likeToFellMore === null || likeToFellMore === void 0 ? void 0 : likeToFellMore.trim()) && { likeToFellMore })), ((timeYouCommit === null || timeYouCommit === void 0 ? void 0 : timeYouCommit.trim()) && { timeYouCommit })), ((helpFeelBetter === null || helpFeelBetter === void 0 ? void 0 : helpFeelBetter.trim()) && { helpFeelBetter })), ((stopFeelBetter === null || stopFeelBetter === void 0 ? void 0 : stopFeelBetter.trim()) && { stopFeelBetter })), ((goalStartWith === null || goalStartWith === void 0 ? void 0 : goalStartWith.trim()) && { goalStartWith })), ((fullName === null || fullName === void 0 ? void 0 : fullName.trim()) && { fullName }));
        const userOnboarding = yield user_auth_model_1.default.findOneAndUpdate({ _id: commonHelper.convertToObjectId(userId) }, updateObj, { new: true });
        //challenges logic start
        const newDetails = yield user_auth_model_1.default.findOne({ _id: commonHelper.convertToObjectId(userId) });
        yield bullMqWorker_1.ChallengesQueue.add('challenges', { userData: newDetails }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            jobId: userDetails === null || userDetails === void 0 ? void 0 : userDetails._id.toString(),
        });
        // const challengesDetails = await commonHelper.challengsFn(userDetails);
        // const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
        // const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
        // const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
        // const payload: any = challengesDetails?.payload;
        // if (isOnBoardingComplete && !isDailyChallengeExist) {
        //     const res = await generateUserChallengesDaily(payload, userDetails?._id.toString());
        //     const result = await userDailyChallengesModel.insertMany(res.data)
        //     if (result) {
        //         await userAuthModel.findOneAndUpdate({ _id: userDetails?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date() } })
        //     }
        // }
        // if (isOnBoardingComplete && !isWeeklyChallengeExist) {
        //     const res = await generateUserChallengesWeekly(payload, userDetails?._id.toString())
        //     const result = await userWeeklyChallengesModel.insertMany(res.data)
        //     if (result) {
        //         await userAuthModel.findOneAndUpdate({ _id: userDetails?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date() } })
        //     }
        // }
        //end
        const is_onboarding = [
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.email,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.hearAboutUs,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.howFellingLately,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.feelThatWay,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.likeToFellMore,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.helpFeelBetter,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.stopFeelBetter,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.timeYouCommit,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.goalStartWith,
            userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.fullName
        ].every(value => value !== undefined &&
            value !== null &&
            String(value).trim() !== '');
        console.log(userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.is_onboarding, is_onboarding, "data");
        if ((userOnboarding === null || userOnboarding === void 0 ? void 0 : userOnboarding.is_onboarding) !== is_onboarding) {
            // console.log("first")
            yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: userOnboarding._id }, { 'is_onboarding': is_onboarding });
            userOnboarding.is_onboarding = is_onboarding;
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(user_language || 'en', "user_onboarding_complete"), null, statusCodes_1.default.SUCCESS);
    }),
    userTrialSubscription: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        const trialExpireTime = (0, moment_timezone_1.default)().add(3, "days").unix();
        //check already take subscription plan
        const userAlreadyTakeSubscription = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: user_id, status: { $ne: 2 }, trial_package_use: true, });
        if (userAlreadyTakeSubscription.status) {
            return (0, response_util_1.showResponse)(false, "You already have a free trial plan going on.", null, statusCodes_1.default.API_ERROR);
        }
        const updateObj = { on_trial_period: true, trial_expire_time: trialExpireTime, trial_package_use: true };
        // Update user auth data with trial subscription information
        const updatedUserSubscriptionData = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { _id: commonHelper.convertToObjectId(user_id), status: 1 }, updateObj);
        if (!updatedUserSubscriptionData.status) {
            return (0, response_util_1.showResponse)(false, "unable to update", null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, "Free trial plan activated successfully", { on_trial_period: true, trial_expire_time: trialExpireTime, trial_package_use: true }, statusCodes_1.default.SUCCESS);
    }), //ends
    progressTrackerList: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const userData = yield user_auth_model_1.default.findOne({ _id: userId }).lean();
        if (!userData) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)('en', "user_not_found"), null, statusCodes_1.default.API_ERROR);
        }
        const language = (userData === null || userData === void 0 ? void 0 : userData.language) || 'en';
        // ================= COMPLETED PHASE POINTS =================
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
        // ================= COMPLETED WEEKLY CHALLENGES =================
        const completedWeeklyChallenges = yield user_weekly_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        // ================= COMPLETED DAILY CHALLENGES =================
        const completedDailyChallenges = yield user_daily_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        // ================= JOURNAL POINTS =================
        const startOfDay = (0, moment_timezone_1.default)()
            .tz((userData === null || userData === void 0 ? void 0 : userData.timeZone) || 'America/New_York')
            .startOf('day')
            .toDate();
        const endOfDay = (0, moment_timezone_1.default)()
            .tz((userData === null || userData === void 0 ? void 0 : userData.timeZone) || 'America/New_York')
            .endOf('day')
            .toDate();
        const totalJournels = yield user_journel_model_1.default.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        const totalJournelEarnedPoints = totalJournels > 0
            ? ((totalJournels - 1) * 10) + 25
            : 0;
        // ================= TOTAL EARNED POINTS =================
        const total_earned_points = (((_a = CompletedPhases[0]) === null || _a === void 0 ? void 0 : _a.total_points) || 0) +
            (((_b = completedWeeklyChallenges[0]) === null || _b === void 0 ? void 0 : _b.total_points) || 0) +
            (((_c = completedDailyChallenges[0]) === null || _c === void 0 ? void 0 : _c.total_points) || 0) +
            totalJournelEarnedPoints;
        // ================= LEVEL THRESHOLDS =================
        const pointThresholds = [
            99, 235, 460, 740, 1070, 1450, 1875, 2345,
            2860, 3415, 4015, 4650, 5325, 6040, 6795,
            7590, 8420, 9290, 10195, 11140, 12120,
            13135, 14185, 15270, 16390, 17545,
            18730, 19955, 21215, 22505
        ];
        // ================= CURRENT LEVEL =================
        let currentLevel = pointThresholds.findIndex((points) => total_earned_points < points) + 1;
        // if user completed all levels
        if (currentLevel === 0) {
            currentLevel = 30;
        }
        // ================= CURRENT LEVEL TOTAL POINTS =================
        const currentLevelTotalPoints = pointThresholds[currentLevel - 1] || 22505;
        // ================= OVERALL PROGRESS =================
        const completedPercentage = currentLevelTotalPoints > 0
            ? Math.min(Math.round((total_earned_points / currentLevelTotalPoints) * 100), 100)
            : 0;
        // ================= LEVEL LISTING =================
        const progressListing = pointThresholds.map((threshold, index) => {
            const levelNumber = index + 1;
            let earned_point = 0;
            let progress = 0;
            let level_status = 'pending';
            // COMPLETED LEVEL
            if (total_earned_points >= threshold) {
                earned_point = threshold;
                progress = 100;
                level_status = 'completed';
            }
            // CURRENT RUNNING LEVEL
            else if (levelNumber === currentLevel) {
                earned_point = total_earned_points;
                progress = Math.min(Math.round((earned_point / threshold) * 100), 100);
                level_status = 'inprogress';
            }
            // PENDING LEVELS
            else {
                earned_point = 0;
                progress = 0;
                level_status = 'pending';
            }
            return {
                level_number: levelNumber,
                total_points: threshold,
                earned_point,
                progress,
                level_status
            };
        });
        // ================= RESPONSE =================
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(language, "success"), {
            total_earned_points,
            currentLevel,
            completedPercentage,
            progressListing
        }, statusCodes_1.default.SUCCESS);
    }),
    claimStreak: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        const STREAK_REWARDS = {
            3: 50,
            7: 100,
            14: 175,
            30: 250,
            60: 450,
            100: 1000,
        };
        try {
            const user = yield user_auth_model_1.default.findOne({
                _id: commonHelper.convertToObjectId(user_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE
            });
            if (!user) {
                return (0, response_util_1.showResponse)(false, "User not found", null, statusCodes_1.default.NOT_FOUND);
            }
            const userTimeZone = user.timeZone || "America/New_York";
            // =========================================
            // CURRENT DATE IN USER TIMEZONE
            // =========================================
            const today = (0, moment_timezone_1.default)().tz(userTimeZone).format("YYYY-MM-DD");
            console.log("today =====================================>>", today);
            const yesterday = (0, moment_timezone_1.default)()
                .tz(userTimeZone)
                .subtract(1, "day")
                .format("YYYY-MM-DD");
            console.log("yesterday =====================================>>", yesterday);
            console.log("user.last_streak_date =====================================>>", user.last_streak_date);
            // =========================================
            // ALREADY CLAIMED TODAY
            // =========================================
            if (user.last_streak_date === today) {
                return (0, response_util_1.showResponse)(true, "Streak already claimed today", null, statusCodes_1.default.SUCCESS);
            }
            let streakCount = user.streak_count || 0;
            let streakDays = user.streak_days || [];
            let streakCredit = user.streak_credit || 0;
            // =========================================
            // RESET IF DAY MISSED
            // =========================================
            if (user.last_streak_date &&
                user.last_streak_date !== yesterday) {
                streakCount = 0;
                streakDays = [];
            }
            // =========================================
            // INCREASE STREAK
            // =========================================
            streakCount += 1;
            // =========================================
            // SAVE UNIX
            // =========================================
            const unix = (0, moment_timezone_1.default)().unix();
            streakDays.push(unix);
            // =========================================
            // REWARD XP
            // =========================================
            const rewardXP = STREAK_REWARDS[streakCount] || 0;
            console.log("rewardXP =====================================>>", rewardXP);
            if (rewardXP > 0) {
                streakCredit += rewardXP;
            }
            // =========================================
            // UPDATE USER
            // =========================================
            yield user_auth_model_1.default.updateOne({ _id: user._id }, {
                $set: {
                    streak_count: streakCount,
                    streak_credit: streakCredit,
                    streak_days: streakDays,
                    last_streak_date: today,
                }
            });
            return (0, response_util_1.showResponse)(true, "Streak claimed successfully", {
                streak_count: streakCount,
                streak_credit: streakCredit,
                rewardXP,
                streak_days: streakDays
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "CLAIM_STREAK_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    })
};
exports.default = UserAuthHandler;
