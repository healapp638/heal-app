import { ApiResponse, tokenUserTypeInterface } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import { findOne, findByIdAndUpdate, findOneAndUpdate, findAndUpdatePushOrSet, createOne } from "../../helpers/db.helpers";
import { decodeToken, generateAccessRefreshToken } from "../../utils/auth.util";
import * as commonHelper from "../../helpers/common.helper";
import userAuthModel from "../../modules/UserAuth/user.auth.model";
// import { APP } from '../../constants/app.constant';
import { DEACTIVATE_BY, EMAIL_SEND_TYPE, USER_STATUS } from '../../constants/workflow.constant';
import services from '../../services';
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { getMessage } from "../../helpers/messages";
import adminPhasesModel from "../AdminPhases/admin.phases.model";
import userModulesCompletePhaseModel from "../UserModules/user.modules.complete.phase.model";
import userDailyChallengesModel from "../UserChallenges/user.daily.challenges.model";
import userWeeklyChallengesModel from "../UserChallenges/user.weekly.challenges.model";

import userRecentHomeThemeModel from "../UserHomeTheme/user.recentHomeTheme.model";
import { ChallengesQueue } from "../../helpers/bullMqWorker";
import userJournalModel from "../UserJournel/user.journel.model";
import moment from "moment-timezone";

const UserAuthHandler = {
    update_social_info: async (findUser: any, model: any, data: any) => {
        try {
            const { login_source, social_auth, email, name } = data

            const editObj: any = {}

            const social_account = {
                email,
                source: login_source,
                token: social_auth,
                fullName: name
            }

            // Check if social account exists in device_info array
            const accountIndex = findUser?.data?.social_account?.findIndex((info: any) => info?.source === data?.login_source);

            //if exist then update else add new
            if (accountIndex !== -1) {
                editObj[`social_account.${accountIndex}`] = social_account;
            } else {
                editObj.$push = { social_account: social_account }
            }

            const response = await findAndUpdatePushOrSet(model, { _id: findUser.data?._id }, editObj);
            //return update result
            if (response.status) {
                return { status: true, data: response.data }

            } else {
                return { status: false, data: null }
            }

        } catch (error) {
            console.log(error, "error update_device_idd")
            return { status: false }
        }
    },//ends

    login: async (data: any): Promise<ApiResponse> => {
        const { email, password, language, timeZone } = data;
        const queryObject = { email, isVerified: true, status: { $ne: USER_STATUS.DELETED } }
        const findUser = await findOne(userAuthModel, queryObject);
        if (!findUser.status) {
            return showResponse(false, getMessage(language || 'en', "INVALID_CREDENTIALS"), null, statusCodes.API_ERROR)
        }
        const userData = findUser?.data
        console.log(timeZone, 'timeZone')
        await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { timeZone: timeZone } })

        // challenges logic start
        await ChallengesQueue.add('challenges', { userData }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            jobId: userData?._id.toString(),

        });

        const is_user_social_login = !!userData.social_account.length;
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        const is_profile_completed = !!userData.dob && !!userData.country

        if (language) {
            await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { language: language } })
        }
        if (!userData?.profilePic || userData?.profilePic == '') {
            await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { profilePic: 'file/file-1777357630130.webp' } })
        }


        if (!userData.password) {
            const otp = commonHelper.generateRandomOtp(6);
            const otpCreatedAt = new Date();
            const obj: any = {
                otp,
                otpCreatedAt
            }
            if (!userData?.profilePic || userData?.profilePic == '') {
                obj.profilePic = 'file/file-1777357630130.webp'
            }
            const emailPayload = {
                user_name: userData?.fullName,
                otp: otp,
            }
            const sendEmail = await services.emailService.sendEmailViaNodemail(EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload)
            if (!sendEmail.status) {
                return showResponse(false, getMessage(language || 'en', "err_while_sending_email"), null, statusCodes.API_ERROR);
            }
            const res = await findOneAndUpdate(userAuthModel, { _id: userData?._id }, obj)
            if (!res.status) {
                return showResponse(false, getMessage(language || 'en', "otp_sent_error"), null, statusCodes.API_ERROR);
            }
            return showResponse(true, getMessage(language || 'en', "otp_sent"), {
                is_after_social_login: true,
                account_type,
                is_profile_completed,
                password: password,
            }, statusCodes.SUCCESS);
        }

        //if account deactivated by admin then throw error 
        if (userData?.status == USER_STATUS.DEACTIVATED && userData?.deactivateBy === DEACTIVATE_BY.ADMIN) {
            return showResponse(false, getMessage(language || 'en', "deactivated_account"), null, statusCodes.API_ERROR);
        }

        const isValid = await commonHelper.verifyBycryptHash(password, userData?.password);
        if (!isValid) {
            return showResponse(false, getMessage(language || 'en', "password_incorrect"), null, statusCodes.API_ERROR)
        }

        commonHelper.keysDeleteFromObject(userData) //delete password & other keys from response
        const { access_token, refresh_token } = await generateAccessRefreshToken(userData?._id, userData?.user_type, tokenUserTypeInterface.USER)

        //if account deactivated by user then reactivate account
        if (userData?.status == USER_STATUS.DEACTIVATED && userData?.deactivateBy === DEACTIVATE_BY.USER) {
            await findOneAndUpdate(userAuthModel, { _id: userData?._id }, { status: USER_STATUS.ACTIVE, deactivateBy: '' })   //activate user again
        }

        return showResponse(true, getMessage(language || 'en', "login_success"), { is_after_social_login: false, account_type, is_profile_completed, ...userData, access_token, refresh_token }, statusCodes.SUCCESS)
    },//ends

    social_login: async (data: any) => {
        const { login_source, social_auth, email, name = undefined, language, timeZone } = data;
        const queryObject = {
            status: { $ne: USER_STATUS.DELETED }, //user not deleted
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
        } //match condition ends 

        //check user exist or not 
        const findUser = await findOne(userAuthModel, queryObject);
        const userData = findUser?.data
        const is_user_social_login = !!userData?.social_account?.length;
        const is_simple_login = !!userData?.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        const is_profile_completed = !!userData?.dob && !!userData?.country
        //if account already existed then update details and return token with login success
        if (findUser.status) {
            //challenges logic start

            const data = findUser?.data
            await userAuthModel.findOneAndUpdate({ _id: data?._id }, { $set: { timeZone: timeZone } });

            await ChallengesQueue.add('challenges', { userData: data }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                jobId: data?._id.toString(),
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

            if (!findUser?.data?.profilePic || findUser?.data?.profilePic == '') {
                await userAuthModel.findOneAndUpdate({ _id: findUser?.data?._id }, { $set: { profilePic: 'file/file-1777357630130.webp' } })
            }

            if (!findUser?.data?.language || findUser?.data?.language == '') {
                await userAuthModel.findOneAndUpdate({ _id: findUser?.data?._id }, { $set: { language } })
            }

            //if account deactivate by admin throw error 
            if (findUser?.data?.status == USER_STATUS.DEACTIVATED && findUser.data?.deactivateBy === DEACTIVATE_BY.ADMIN) {
                return showResponse(false, getMessage(language || 'en', "deactivated_account"), null, statusCodes.API_ERROR);
            }

            //update social account array 
            const updateSocialInfo = await UserAuthHandler.update_social_info(findUser, userAuthModel, data)
            if (!updateSocialInfo.status) {
                return showResponse(false, getMessage(language || 'en', "login_error"), null, statusCodes.API_ERROR);
            }

            commonHelper.keysDeleteFromObject(findUser?.data)
            const { access_token, refresh_token } = await generateAccessRefreshToken(findUser.data?._id, findUser.data?.user_type, tokenUserTypeInterface.USER)

            const userData = { is_after_social_login: false, account_type, is_profile_completed, ...findUser?.data, access_token, refresh_token }

            //if account deactivated by user then activate it again 
            if (findUser?.data?.status == USER_STATUS.DEACTIVATED && findUser.data?.deactivateBy === DEACTIVATE_BY.USER) {
                await findOneAndUpdate(userAuthModel, { _id: findUser.data?._id }, { status: USER_STATUS.ACTIVE, deactivateBy: '' })
            }
            return showResponse(true, getMessage(language || 'en', "login_success"), userData, statusCodes.SUCCESS);

        } else {

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

            const userRef = new userAuthModel(newObj)
            const result = await createOne(userRef);

            if (!result.status) {
                return showResponse(false, getMessage(language || 'en', "login_error"), null, statusCodes.API_ERROR);
            }

            //challenges logic start
            await ChallengesQueue.add('challenges', { userData: result?.data }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                jobId: result?.data?._id.toString(),
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

            commonHelper.keysDeleteFromObject(result?.data)
            const { access_token, refresh_token } = await generateAccessRefreshToken(result.data?._id, result.data?.user_type, tokenUserTypeInterface.USER)

            const userData = { is_after_social_login: false, account_type, is_profile_completed, ...result?.data, access_token, refresh_token }

            return showResponse(true, getMessage(language || 'en', "login_success"), userData, statusCodes.SUCCESS);
        }
    },

    async register(data: any, profile_pic: any): Promise<ApiResponse> {
        console.log(profile_pic, "profile_pic")
        const { hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf, fullName, country, email, dob, password, language } = data;
        const obj: any = {
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

        }

        //check if match or not by email
        const queryObject = {
            status: { $ne: USER_STATUS.DELETED },
            $or: [
                { email },//if account email find then throw error already existed 
                {
                    social_account: {
                        $elemMatch: { email: email }  //if account finds with social email then update account
                    }
                },
            ]
        }

        const hashed = await commonHelper.bycrptPasswordHash(password);
        obj.password = hashed
        const otp = commonHelper.generateRandomOtp(6)
        obj.otp = otp
        const emailPayload = { user_name: fullName, otp }
        console.log(emailPayload, "emailPayload")
        // const payload = { ...data, account_source: 'email', password: hashed, otp }


        // check if user exists
        const findUser = await findOne(userAuthModel, queryObject);
        //if user exist with same account source then throw error
        if (findUser.status && findUser?.data?.account_source == 'email' && findUser?.data?.isVerified) {
            return showResponse(false, getMessage(language || 'en', "email_already_exists"), null, statusCodes.API_ERROR);
        }
        console.log(findUser, "findUser")

        //if exist with different source (through google apple login) then update details and account source else insert new account entry
        const result = await findOneAndUpdate(userAuthModel, queryObject, obj, true);
        if (!result.status) {
            return showResponse(false, getMessage(language || 'en', "err_while_register"), null, statusCodes.API_ERROR);
        }
        console.log(result, "result")
        console.log(EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload, "send emailllll")

        const sendEmail = await services.emailService.sendEmailViaNodemail(EMAIL_SEND_TYPE.REGISTER_EMAIL, email, emailPayload)
        console.log(sendEmail, "sendEmail")
        if (!sendEmail.status) {
            return showResponse(false, getMessage(language || 'en', "err_while_sending_email"), null, statusCodes.API_ERROR);
        }

        return showResponse(true, getMessage(language || 'en', "verification_email_sent"), null, statusCodes.SUCCESS);
    },
    //ends
    toggleBiometric: async (userId: string): Promise<ApiResponse> => {
        try {
            // find user
            const user = await userAuthModel.findOne({
                _id: commonHelper.convertToObjectId(userId),
                status: USER_STATUS.ACTIVE,
            });

            if (!user) {
                return showResponse(
                    false,
                    responseMessage.common.data_not_found,
                    null
                );
            }

            // toggle value
            user.is_biometric = !user.is_biometric;

            await user.save();

            return showResponse(
                true,
                "Biometric status updated successfully",
                {
                    is_biometric: user.is_biometric,
                },
                statusCodes.SUCCESS
            );
        } catch {
            return showResponse(
                false,
                "err while updating status",
                null
            );
        }
    },

    forgotPassword: async (data: any): Promise<ApiResponse> => {
        const { email } = data;

        const queryObject = { email, isVerified: true, status: { $ne: USER_STATUS.DELETED } }
        // check if user exists
        const exists = await findOne(userAuthModel, queryObject);
        if (!exists.status) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }

        const userData = exists?.data;
        const language = userData?.language || 'en';

        const otp = commonHelper.generateRandomOtp(6);
        const to = `${exists?.data?.email}`
        const user_name = `${userData?.fullName}`
        const payload = { user_name, otp }

        const emailSend = await services.emailService.sendEmailViaNodemail(EMAIL_SEND_TYPE.FORGOT_PASSWORD_EMAIL, to, payload)
        if (!emailSend.status) {
            return showResponse(false, getMessage(language || 'en', "err_while_sending_email"), null, statusCodes.API_ERROR)
        }

        await findByIdAndUpdate(userAuthModel, userData?._id, { otp });  //update otp in database
        return showResponse(true, getMessage(language || 'en', "otp_send_success"), null, statusCodes.SUCCESS);

    },//ends

    resetPassword: async (data: any): Promise<ApiResponse> => {
        const { email, new_password, otp } = data;

        const queryObject = { email, isVerified: true, status: { $ne: USER_STATUS.DELETED } }

        const result = await findOne(userAuthModel, queryObject);
        if (!result.status) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR);
        }
        const language = result?.data?.language || 'en';
        if (result.data?.otp !== otp) {
            return showResponse(false, getMessage(language || 'en', "invalid_otp"), null, statusCodes.API_ERROR);
        }

        const hashed = await commonHelper.bycrptPasswordHash(new_password)
        const updateObj = { otp: '', password: hashed }

        const updated = await findByIdAndUpdate(userAuthModel, result?.data?._id, updateObj)
        if (!updated.status) {
            return showResponse(false, getMessage(language || 'en', "err_while_reset_password"), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(language || 'en', "password_reset_success"), null, statusCodes.SUCCESS)
    },

    verifyOtp: async (data: any): Promise<ApiResponse> => {
        const { email, otp, password } = data;
        if (password) {
            const hashed = await commonHelper.bycrptPasswordHash(password)
            data.password = hashed
        }
        const queryObject = { email, otp, status: { $ne: USER_STATUS.DELETED } }
        const exists = await findOne(userAuthModel, queryObject)
        if (!exists.status) {
            return showResponse(false, getMessage('en', "invalid_otp"), null, statusCodes.API_ERROR);
        }
        const language = exists?.data?.language || 'en';
        await findOneAndUpdate(userAuthModel, queryObject, { isVerified: true, password: data.password })

        const userData = exists?.data
        const is_user_social_login = !!userData.social_account.length;
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        const is_profile_completed = !!userData.dob && !!userData.country

        const { access_token, refresh_token } = await generateAccessRefreshToken(exists?.data?._id, exists?.data?.user_type, tokenUserTypeInterface.USER)
        return showResponse(true, getMessage(language || 'en', "otp_verify_success"), { access_token, refresh_token, is_profile_completed, account_type, is_after_social_login: false }, statusCodes.SUCCESS);
    },

    resendOtp: async (data: any): Promise<ApiResponse> => {
        const { email } = data;
        const queryObject = { email, status: { $ne: USER_STATUS.DELETED } }
        const result = await findOne(userAuthModel, queryObject);
        if (!result.status) {
            return showResponse(false, getMessage('en', "invalid_email"), null, statusCodes.API_ERROR);
        }
        const userData = result?.data;
        const language = userData?.language || 'en';

        const otp = commonHelper.generateRandomOtp(6);
        const to = userData?.email
        const user_name = `${userData?.fullName}`
        const payload = { user_name, otp }

        const emailSend = await services.emailService.sendEmailViaNodemail(EMAIL_SEND_TYPE.SEND_OTP_EMAIL, to, payload)
        if (!emailSend.status) {
            return showResponse(false, getMessage(language || 'en', "otp_send_error"), null, statusCodes.API_ERROR)
        }

        await findOneAndUpdate(userAuthModel, queryObject, { otp })
        return showResponse(true, getMessage(language || 'en', "otp_resend"), null, statusCodes.SUCCESS);
    },//ends

    changePassword: async (data: any, userId: string): Promise<ApiResponse> => {
        const { old_password, new_password } = data;

        const exists = await findOne(userAuthModel, { _id: userId })
        if (!exists.status) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const language = exists?.data?.language || 'en';

        const comparePassword = await commonHelper.verifyBycryptHash(old_password, exists.data?.password);
        if (!comparePassword) {
            return showResponse(false, getMessage(language || 'en', "invalid_old_password"), null, statusCodes.API_ERROR)
        }

        //new password and old password cannot be same
        if (new_password === old_password) {
            return showResponse(false, getMessage(language || 'en', "cannot_same_old_new_password"), null, statusCodes.API_ERROR)
        }

        const hashed = await commonHelper.bycrptPasswordHash(new_password)
        const result = await findByIdAndUpdate(userAuthModel, userId, { password: hashed })
        if (!result.status) {
            return showResponse(false, getMessage(language || 'en', "err_while_reset_password"), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(language || 'en', "password_reset_success"), null, statusCodes.SUCCESS)
    },

    getUserDetails: async (userId: string): Promise<ApiResponse> => {
        const result = await findOne(userAuthModel, { _id: userId }, { createdAt: 0, updatedAt: 0, otp: 0 });
        const userData = result?.data
        const is_user_social_login = !!userData?.social_account?.length;
        const is_simple_login = !!userData?.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        const is_profile_completed = !!userData?.dob && !!userData?.country
        if (!result.status) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const language = result?.data?.language || 'en';
        //calculate progress start
        const Allpahses = await adminPhasesModel.aggregate([
            {
                $match: {
                    status: USER_STATUS.ACTIVE
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        console.log(Allpahses, 'Allpahses')
        // const total_points = Allpahses[0]?.total_points || 0;

        const weeklyChallengesTotalpoints = await userWeeklyChallengesModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        console.log(weeklyChallengesTotalpoints, 'allChallengesTotalpoints')

        const dailyChallengesTotalpoints = await userDailyChallengesModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        console.log(dailyChallengesTotalpoints, 'allChallengesTotalpoints')
        // const total_points = Allpahses[0]?.total_points + weeklyChallengesTotalpoints[0]?.total_points + dailyChallengesTotalpoints[0]?.total_points;
        // const total_points = 500
        const CompletedPhases = await userModulesCompletePhaseModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE
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
        console.log(userId, 'userId')
        const completedWeeklyChallenges = await userWeeklyChallengesModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE,
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
        const completedDailyChallenges = await userDailyChallengesModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE,
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
        const startOfDay = moment().tz(userData?.timezone).startOf('day').toDate();
        const endOfDay = moment().tz(userData?.timezone).endOf('day').toDate();

        const totalJournels = await userJournalModel.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: USER_STATUS.ACTIVE,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalJournelEarnedPoints = (totalJournels * 10) + 25 || 0
        console.log(completedWeeklyChallenges[0]?.total_points, 'completedWeeklyChallenges')
        console.log(completedDailyChallenges[0]?.total_points, 'completedDailyChallenges')
        console.log(CompletedPhases[0]?.total_points, 'CompletedPhases')
        console.log(totalJournelEarnedPoints, 'totalJournelEarnedPoints')
        const total_earned_points = (CompletedPhases[0]?.total_points || 0) + (completedWeeklyChallenges[0]?.total_points || 0) + (completedDailyChallenges[0]?.total_points || 0) + totalJournelEarnedPoints;
        const pointThresholds = [
            99, 235, 460, 740, 1070, 1450, 1875, 2345,
            2860, 3415, 4015, 4650, 5325, 6040, 6795,
            7590, 8420, 9290, 10195, 11140, 12120,
            13135, 14185, 15270, 16390, 17545,
            18730, 19955, 21215, 22505
        ];
        const total_points = pointThresholds.find((curelem) => total_earned_points < curelem) ?? 22505

        const completedPercentage = total_points > 0
            ? (total_earned_points / total_points) * 100
            : 0;

        // Calculate level
        const totalLevels = 5;

        let currentLevel = Math.ceil((completedPercentage / 100) * totalLevels);

        // Edge case fix
        if (currentLevel === 0) currentLevel = 1;
        if (currentLevel > totalLevels) currentLevel = totalLevels;

        //calculating progress end

        const homeThemeAggregate: any = [

            {
                $match: {
                    user_id: commonHelper.convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE,
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
                    categoryTheme_id:
                        "$themeData.categoryTheme_id",
                    createdAt: "$themeData.createdAt",
                    updatedAt: "$themeData.updatedAt",
                },
            },
        ];

        const homeThemeResult =
            await userRecentHomeThemeModel.aggregate(
                homeThemeAggregate
            );

        const homeTheme = homeThemeResult?.[0] || null;
        const is_onboarding_complete = await commonHelper.challengsFn(userData);
        const isOnBoardingComplete = is_onboarding_complete?.isOnBoardingComplete;
        const totalDailyChallenges = await userDailyChallengesModel.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: USER_STATUS.ACTIVE,
            createdAt: {
                $gte: moment().startOf('day').toDate(),
                $lte: moment().endOf('day').toDate()
            }
        });
        const totalWeeklyChallanges = await userWeeklyChallengesModel.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: USER_STATUS.ACTIVE,
            createdAt: {
                $gte: moment().startOf('week').toDate(),
                $lte: moment().endOf('week').toDate()
            }
        });
        let isUnderProgress = false
        if (isOnBoardingComplete && totalDailyChallenges == 0 && totalWeeklyChallanges == 0) {
            isUnderProgress = true
        }
        return showResponse(true, getMessage(language || 'en', "user_detail"), { ...result.data, account_type, is_profile_completed, total_points, total_earned_points, completedPercentage, currentLevel, homeTheme, isOnBoardingComplete, isUnderProgress }, statusCodes.SUCCESS)
    },

    updateUserProfile: async (data: any, user_id: string): Promise<ApiResponse> => {
        const { fullName, country, dob, profilePic, language } = data
        const updateObj: any = {
            ...(fullName && { fullName }),
            ...(country && { country }),
            ...(dob && { dob }),
            ...(language && { language }),
            ...(profilePic && { profilePic }),
        };
        const user = await userAuthModel.findOne({ _id: user_id })
        console.log(user, 'user')
        if (!user) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const user_language = user?.language || 'en';
        console.log(user_id, '0')
        const result = await findByIdAndUpdate(userAuthModel, user_id, updateObj);
        console.log(result, 'result')
        if (!result.status) {
            return showResponse(false, getMessage(user_language || 'en', "user_account_update_error"), null, statusCodes.API_ERROR);
        }
        commonHelper.keysDeleteFromObject(result?.data)
        return showResponse(true, getMessage(user_language || 'en', "user_account_updated"), result.data, statusCodes.SUCCESS);
    },

    async deleteOrDeactivateAccount(data: any, user_id: string): Promise<ApiResponse> {
        const { status, reason } = data
        const updateObj = {
            status,
            deactivateBy: DEACTIVATE_BY.USER,
            ...(reason && { reason }),
        }
        const user = await userAuthModel.findOne({ _id: user_id })
        if (!user) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const user_language = user?.language || 'en';
        const result = await findByIdAndUpdate(userAuthModel, user_id, updateObj);
        if (!result.status) {
            return showResponse(false, getMessage(user_language || 'en', "user_account_update_error"), null, statusCodes.API_ERROR);
        }
        const msg = status == USER_STATUS.DELETED ? getMessage(user_language || 'en', "user_account_has_been_deleted") : getMessage(user_language || 'en', "user_account_has_been_deactivated")
        return showResponse(true, msg, null, statusCodes.SUCCESS);
    },//ends

    async refreshToken(data: any): Promise<ApiResponse> {
        const { refresh_token } = data
        const response: any = await decodeToken(refresh_token)
        if (!response.status) {
            return showResponse(false, getMessage('en', "token_expired"), null, statusCodes.REFRESH_TOKEN_ERROR);
        }
        const user_id = response?.data?.id
        const findUser = await findOne(userAuthModel, { _id: user_id });
        if (!findUser.status) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const user_language = findUser?.data?.language || 'en';
        if (findUser?.data?.status == USER_STATUS.DEACTIVATED) {
            return showResponse(false, getMessage(user_language || 'en', "user_account_has_been_deactivated"), null, statusCodes.ACCOUNT_DISABLED);
        }
        if (findUser?.data?.status == USER_STATUS.DELETED) {
            return showResponse(false, getMessage(user_language || 'en', "user_account_has_been_deleted"), null, statusCodes.ACCOUNT_DELETED);
        }
        const tokens = await generateAccessRefreshToken(findUser.data?._id, findUser.data?.user_type, tokenUserTypeInterface.USER)
        return showResponse(true, getMessage(user_language || 'en', "tokens_generated_successfully"), { access_token: tokens.access_token, refresh_token: tokens.refresh_token }, statusCodes.SUCCESS)
    },

    async logoutUser(): Promise<ApiResponse> {
        return showResponse(true, getMessage('en', "logout_success"), null, statusCodes.SUCCESS)
    },

    uploadFile: async (data: any): Promise<ApiResponse> => {
        const { file } = data;
        const s3Upload = await services.awsService.uploadFileToS3([file])
        console.log(s3Upload, 's3Upload')
        if (!s3Upload.status) {
            return showResponse(false, responseMessage?.common.file_upload_error, {}, statusCodes.FILE_UPLOAD_ERROR);
        }
        return showResponse(true, responseMessage.common.file_upload_success, s3Upload?.data, statusCodes.SUCCESS)
    },

    getUserDetailsUser: async (userId: string): Promise<ApiResponse> => {
        const result = await findOne(userAuthModel, { _id: userId }, { password: 0, createdAt: 0, updatedAt: 0, social_account: 0, otp: 0 });
        const language = result?.data?.language || 'en';
        if (!result.status) {
            return showResponse(false, getMessage(language || 'en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(language || 'en', "user_detail"), result.data, statusCodes.SUCCESS)
    },

    completeOnboarding: async (data: any, userId: string): Promise<ApiResponse> => {
        const { language, hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf } = data;
        const userDetails = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(userId), status: USER_STATUS.ACTIVE })
        if (!userDetails) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const user_language = userDetails?.language || 'en';
        const updateObj: any = {
            ...(language && { language }),
            ...(hearAboutUs && { hearAboutUs }),
            ...(bringsYouHere && { bringsYouHere }),
            ...(howFellingLately && { howFellingLately }),
            ...(likeToFellMore && { likeToFellMore }),
            ...(timeYouCommit && { timeYouCommit }),
            ...(startShowingOfYourSelf && { startShowingOfYourSelf }),
        }
        await userAuthModel.findOneAndUpdate({ _id: commonHelper.convertToObjectId(userId) }, updateObj)
        //challenges logic start
        const newDetails = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(userId) })
        await ChallengesQueue.add('challenges', { userData: newDetails }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            jobId: userDetails?._id.toString(),
        })

        return showResponse(true, getMessage(user_language || 'en', "user_onboarding_complete"), null, statusCodes.SUCCESS)
    },
}

export default UserAuthHandler 
