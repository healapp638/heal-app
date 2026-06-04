import { ApiResponse, tokenUserTypeInterface } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import { findOne, findByIdAndUpdate, findOneAndUpdate, createOne } from "../../helpers/db.helpers";
import { decodeToken, generateAccessRefreshToken } from "../../utils/auth.util";
import * as commonHelper from "../../helpers/common.helper";
import userAuthModel from "../../modules/UserAuth/user.auth.model";
// import { APP } from '../../constants/app.constant';
import { DEACTIVATE_BY, EMAIL_SEND_TYPE, USER_STATUS } from '../../constants/workflow.constant';
import services from '../../services';
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { getMessage } from "../../helpers/messages";
import userModulesCompletePhaseModel from "../UserModules/user.modules.complete.phase.model";
import userDailyChallengesModel from "../UserChallenges/user.daily.challenges.model";
import userWeeklyChallengesModel from "../UserChallenges/user.weekly.challenges.model";

import userRecentHomeThemeModel from "../UserHomeTheme/user.recentHomeTheme.model";
import { ChallengesQueue } from "../../helpers/bullMqWorker";
import userJournalModel from "../UserJournel/user.journel.model";
import moment from "moment-timezone";
// import moment from "moment";
import userDeeplinkModel from "../UserAffirmation/user.deeplink.model";


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

update_social_info: async (findUser: any, model: any, data: any) => {
    try {
        const {login_source,social_auth,email,name,fullName,hearAboutUs,howFellingLately,feelThatWay,likeToFellMore,
            helpFeelBetter,stopFeelBetter,timeYouCommit,goalStartWith,language,timeZone} = data;

        const editObj: any = {
            $set: {}
        };

        // =========================================
        // ROOT USER FIELDS
        // =========================================

        Object.assign(editObj.$set, {
            ...(email?.trim() && { email }),
            ...((fullName || name)?.trim() && {
                fullName: fullName || name
            }),
            ...(language?.trim() && { language }),
            ...(timeZone?.trim() && { timeZone }),
            ...(hearAboutUs?.trim() && { hearAboutUs }),
            ...(howFellingLately?.trim() && { howFellingLately }),
            ...(feelThatWay?.trim() && { feelThatWay }),
            ...(likeToFellMore?.trim() && { likeToFellMore }),
            ...(helpFeelBetter?.trim() && { helpFeelBetter }),
            ...(stopFeelBetter?.trim() && { stopFeelBetter }),
            ...(timeYouCommit?.trim() && { timeYouCommit }),
            ...(goalStartWith?.trim() && { goalStartWith })
        });

        // =========================================
        // SOCIAL ACCOUNT UPDATE
        // =========================================

        if (login_source?.trim()) {
            const social_account: any = {
                ...(email?.trim() && { email }),
                ...(login_source?.trim() && { source: login_source }),
                ...(social_auth?.trim() && { token: social_auth }),
                ...((fullName || name)?.trim() && {
                    fullName: fullName || name
                })
            };

            const accountIndex =
                findUser?.data?.social_account?.findIndex(
                    (info: any) => info?.source === login_source
                );

            if (Object.keys(social_account).length > 0) {
                if (accountIndex !== -1) {
                    editObj.$set[
                        `social_account.${accountIndex}`
                    ] = social_account;
                } else {
                    editObj.$push = {
                        social_account
                    };
                }
            }
        }

        // =========================================
        // NOTHING TO UPDATE
        // =========================================

        if (
            Object.keys(editObj.$set).length === 0 &&
            !editObj.$push
        ) {
            return {
                status: true,
                data: findUser.data
            };
        }

        // =========================================
        // UPDATE USER
        // =========================================

        await model.updateOne(
            { _id: findUser.data._id },
            editObj
        );

        // =========================================
        // GET LATEST USER
        // =========================================

        const updatedUser = await model
            .findById(findUser.data._id)
            .lean();

        if (!updatedUser) {
            return {
                status: false,
                data: null
            };
        }

        // =========================================
        // CHECK ONBOARDING
        // =========================================

        const is_onboarding = [
            updatedUser?.email,
            updatedUser?.hearAboutUs,
            updatedUser?.howFellingLately,
            updatedUser?.feelThatWay,
            updatedUser?.likeToFellMore,
            updatedUser?.helpFeelBetter,
            updatedUser?.stopFeelBetter,
            updatedUser?.timeYouCommit,
            updatedUser?.goalStartWith,
            updatedUser?.fullName
        ].every(
            (value: any) =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ''
        );

        if (updatedUser.is_onboarding !== is_onboarding) {
            await model.updateOne(
                { _id: updatedUser._id },
                {
                    $set: {
                        is_onboarding
                    }
                }
            );

            updatedUser.is_onboarding = is_onboarding;
        }
        const findUserr = await findOne(userAuthModel, { _id: updatedUser._id });
        // console.log(findUserr,"findUserr")

        return {
            status: true,
            data: findUserr.status ? findUserr.data : findUser.data
        };

    } catch (error) {
        console.log(error, "error update_social_info");

        return {
            status: false,
            data: null
        };
    }
},

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
            jobId: userData?._id.toString().concat(Date.now().toString()),

        });

        const is_user_social_login = !!userData.social_account.length;
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        // const is_profile_completed = !!userData.dob && !!userData.country

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
                is_profile_completed: true,
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

        return showResponse(true, getMessage(language || 'en', "login_success"), { is_after_social_login: false, account_type, is_profile_completed: true, ...userData, access_token, refresh_token }, statusCodes.SUCCESS)
    },//ends

    social_login: async (data: any) => {
        const { login_source, social_auth, email, name = undefined, language, timeZone,fullName,hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith } = data;
        // console.log(data,"dattttaaaa")
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
        // const is_profile_completed = !!userData?.dob && !!userData?.country
        //if account already existed then update details and return token with login success
        if (findUser.status) {
            //challenges logic start
            // console.log(goalStartWith,"goalStartWith")
            const existingUserData = findUser?.data
            // console.log(existingUserData,"datatatatta")
            await ChallengesQueue.add('challenges', { userData: existingUserData }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                jobId: existingUserData?._id.toString().concat(Date.now().toString()),
            });

            if (!existingUserData?.profilePic || existingUserData?.profilePic == '') {
                await userAuthModel.findOneAndUpdate({ _id: existingUserData?._id }, { $set: { profilePic: 'file/file-1777357630130.webp' } })
            }

            if (!existingUserData?.language || existingUserData?.language == '') {
                await userAuthModel.findOneAndUpdate({ _id: existingUserData?._id }, { $set: { language } })
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

            const updatedUserDoc = updateSocialInfo.data;

            commonHelper.keysDeleteFromObject(updatedUserDoc)
            const { access_token, refresh_token } = await generateAccessRefreshToken(updatedUserDoc?._id, updatedUserDoc?.user_type, tokenUserTypeInterface.USER)

            const userDataResponse = { is_after_social_login: false, account_type, is_profile_completed: true, ...updatedUserDoc, access_token, refresh_token }

            //if account deactivated by user then activate it again 
            if (updatedUserDoc?.status == USER_STATUS.DEACTIVATED && updatedUserDoc?.deactivateBy === DEACTIVATE_BY.USER) {
                await findOneAndUpdate(userAuthModel, { _id: updatedUserDoc?._id }, { status: USER_STATUS.ACTIVE, deactivateBy: '' })
            }
            return showResponse(true, getMessage(language || 'en', "login_success"), userDataResponse, statusCodes.SUCCESS);

        } else {

            //if not exist then register new user 
            const newObj = {
                social_account: [
                    {
                        source: login_source,
                        email: email,
                        token: social_auth,
                        name: name
                    }
                ],
                email,
                fullName:fullName,
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
                goalStartWith,
                timeZone
            };
            console.log(newObj, "newObj>>>>>>>>>>>>>>>")

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
                jobId: result?.data?._id.toString().concat(Date.now().toString()),
            });

            commonHelper.keysDeleteFromObject(result?.data)
            const { access_token, refresh_token } = await generateAccessRefreshToken(result.data?._id, result.data?.user_type, tokenUserTypeInterface.USER)

        const is_onboarding = [
        result?.data?.email,
        result?.data?.hearAboutUs,
        result?.data?.howFellingLately,
        result?.data?.feelThatWay,
        result?.data?.likeToFellMore,
        result?.data?.helpFeelBetter,
        result?.data?.stopFeelBetter,
        result?.data?.timeYouCommit,
        result?.data?.goalStartWith,
        result?.data?.fullName
        ].every(
        value =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ''
       );

       if (result?.data?.is_onboarding !== is_onboarding) {
        await userAuthModel.updateOne(
            { _id: result.data?._id },
            { $set: { is_onboarding } }
        );
       }

            const userData = { is_after_social_login: false, account_type, is_profile_completed: true, ...result?.data, access_token, refresh_token,is_onboarding:is_onboarding }
            console.log(userData,"userrrrrrrrrdatatatus")
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


    sendMagicLink: async (data: any): Promise<ApiResponse> => {
        try {

            const { hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, email, language } = data;

            // =========================================
            // GENERATE DEEPLINK CODE
            // =========================================

            const code = commonHelper.generateRandomAlphanumeric(8);
            await userDeeplinkModel.updateMany(
                {
                    email: email.toLowerCase().trim(),
                    isUsed: false,
                    expiresAt: { $gt: new Date() }
                },
                {
                    $set: {
                        isUsed: true,
                        usedAt: new Date(),
                        // invalidatedReason: 'NEW_LINK_GENERATED'
                    }
                }
            );

            // save deeplink data
            await userDeeplinkModel.create({
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

            const sendEmail = await services.emailService.sendEmailViaNodemail(EMAIL_SEND_TYPE.MAGIC_LINK, email, emailPayload);

            console.log(sendEmail, "sendEmail");

            if (!sendEmail.status) {

                return showResponse(
                    false,
                    getMessage(language || 'en', "err_while_sending_email"),
                    null,
                    statusCodes.API_ERROR
                );
            }

            return showResponse(
                true,
                getMessage(language || 'en', "verification_email_sent"),
                deeplink,
                statusCodes.SUCCESS
            );

        } catch (err) {

            console.log(err, "register err");

            return showResponse(
                false,
                responseMessage.common.error_while_create_acc,
                null,
                statusCodes.API_ERROR
            );
        }
    },

    magicLinkLogin: async (data: any): Promise<ApiResponse> => {
        const { email, hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language, timeZone, code } = data;

        const lowercaseEmail = email ? email.toLowerCase().trim() : '';

        const queryObject = { email: lowercaseEmail, status: { $ne: USER_STATUS.DELETED } };
        const findUser = await findOne(userAuthModel, queryObject);
        console.log(code, "codeeee")


        const deepLink = await userDeeplinkModel.findOneAndUpdate(
            {
                code,
                isUsed: false,
                expiresAt: { $gt: new Date() },
                status: USER_STATUS.ACTIVE
            },
            {
                $set: {
                    isUsed: true,
                    usedAt: new Date()
                }
            },
            {
                new: true
            }
        );
        console.log(deepLink, "deepLink");

        if (!deepLink) {
            console.log("Magic link is invalid, innnnnnnnnnnnnnn");
            return showResponse(
                false,
                "Magic link is invalid, expired, or already used",
                null,
                statusCodes.API_ERROR
            );
        }

        let userData: any;

        // const updateData: any = {
        //     email: lowercaseEmail,hearAboutUs,howFellingLately,feelThatWay,likeToFellMore,helpFeelBetter,stopFeelBetter,
        //     timeYouCommit,goalStartWith,fullName,language: language || 'en',timeZone,isVerified: true
        // };

        const updateData: any = {
            email: lowercaseEmail,
            isVerified: true,
            ...(hearAboutUs?.trim() && { hearAboutUs }),
            ...(howFellingLately?.trim() && { howFellingLately }),
            ...(feelThatWay?.trim() && { feelThatWay }),
            ...(likeToFellMore?.trim() && { likeToFellMore }),
            ...(helpFeelBetter?.trim() && { helpFeelBetter }),
            ...(stopFeelBetter?.trim() && { stopFeelBetter }),
            ...(timeYouCommit?.trim() && { timeYouCommit }),
            ...(goalStartWith?.trim() && { goalStartWith }),
            ...(fullName?.trim() && { fullName }),
            ...(language?.trim() && { language }),
            ...(timeZone?.trim() && { timeZone }),
        };

        if (findUser.status) {
            const existingUser = findUser.data;
            if (!existingUser?.profilePic || existingUser?.profilePic === '') {
                updateData.profilePic = 'file/file-1777357630130.webp';
            }
            // const updateRes = await findOneAndUpdate(userAuthModel, { _id: existingUser._id }, updateData);
            const updateRes = await userAuthModel.findOneAndUpdate({ _id: existingUser._id }, { $set: updateData }, { new: true });
            if (!updateRes) {
                return showResponse(false, getMessage(language || 'en', "INVALID_CREDENTIALS"), null, statusCodes.API_ERROR);
            }
            userData = updateRes;
        } else {
            updateData.profilePic = 'file/file-1777357630130.webp';
            const newObj = new userAuthModel(updateData);
            const createResult = await createOne(newObj);
            if (!createResult.status) {
                return showResponse(false, getMessage(language || 'en', "err_while_register"), null, statusCodes.API_ERROR);
            }
            userData = createResult.data;
        }

        console.log(timeZone, 'timeZone');

        // challenges logic start
        await ChallengesQueue.add('challenges', { userData }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            jobId: userData?._id.toString().concat(Date.now().toString()),
        });

        const is_user_social_login = !!userData.social_account?.length;
        const is_simple_login = !!userData.password;
        const account_type = is_user_social_login && is_simple_login ? "both" : is_user_social_login ? "social" : "simple";
        // const is_profile_completed = !!userData.dob && !!userData.country;

        //if account deactivated by admin then throw error 
        if (userData?.status == USER_STATUS.DEACTIVATED && userData?.deactivateBy === DEACTIVATE_BY.ADMIN) {
            return showResponse(false, getMessage(language || 'en', "deactivated_account"), null, statusCodes.API_ERROR);
        }

        commonHelper.keysDeleteFromObject(userData); //delete password & other keys from response
        const { access_token, refresh_token } = await generateAccessRefreshToken(userData?._id, userData?.user_type, tokenUserTypeInterface.USER);

        //if account deactivated by user then reactivate account
        if (userData?.status == USER_STATUS.DEACTIVATED && userData?.deactivateBy === DEACTIVATE_BY.USER) {
            await findOneAndUpdate(userAuthModel, { _id: userData?._id }, { status: USER_STATUS.ACTIVE, deactivateBy: '' });   //activate user again
        }

        // =========================================
        // CHECK ONBOARDING STATUS
        // =========================================
        const is_onboarding = [
            userData?.email,
            userData?.hearAboutUs,
            userData?.howFellingLately,
            userData?.feelThatWay,
            userData?.likeToFellMore,
            userData?.helpFeelBetter,
            userData?.stopFeelBetter,
            userData?.timeYouCommit,
            userData?.goalStartWith,
            userData?.fullName
        ].every(
            value =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ''
        );
        console.log(userData?.is_onboarding, is_onboarding, "data")

        if (userData?.is_onboarding !== is_onboarding) {
            console.log("first")
            await findOneAndUpdate(userAuthModel, { _id: userData._id }, { 'is_onboarding': is_onboarding });
            userData.is_onboarding = is_onboarding;
        }

        return showResponse(true, getMessage(language || 'en', "login_success"), { is_after_social_login: false, account_type, is_profile_completed: true, is_onboarding, ...userData, access_token, refresh_token }, statusCodes.SUCCESS);
    },//ends


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
        // const is_profile_completed = !!userData.dob && !!userData.country

        const { access_token, refresh_token } = await generateAccessRefreshToken(exists?.data?._id, exists?.data?.user_type, tokenUserTypeInterface.USER)
        return showResponse(true, getMessage(language || 'en', "otp_verify_success"), { access_token, refresh_token, is_profile_completed: true, account_type, is_after_social_login: false }, statusCodes.SUCCESS);
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
        // const is_profile_completed = !!userData?.dob && !!userData?.country
        if (!result.status) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const language = result?.data?.language || 'en';
        //calculate progress start

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
        const startOfDay = moment().tz(userData?.timeZone || 'America/New_York').startOf('day').toDate();
        const endOfDay = moment().tz(userData?.timeZone || 'America/New_York').endOf('day').toDate();

        const totalJournels = await userJournalModel.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: USER_STATUS.ACTIVE,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalJournelEarnedPoints =
            totalJournels > 0
                ? ((totalJournels - 1) * 10) + 25
                : 0;

        const total_earned_points = (CompletedPhases[0]?.total_points || 0) + (completedWeeklyChallenges[0]?.total_points || 0) + (completedDailyChallenges[0]?.total_points || 0) + totalJournelEarnedPoints || 0 + userData?.streak_credit || 0;
        // console.log("total_earned_points===========>", total_earned_points);
        // console.log("userData.streak_credit===========>", userData?.streak_credit);
        const pointThresholds = [
            99, 235, 460, 740, 1070, 1450, 1875, 2345,
            2860, 3415, 4015, 4650, 5325, 6040, 6795,
            7590, 8420, 9290, 10195, 11140, 12120,
            13135, 14185, 15270, 16390, 17545,
            18730, 19955, 21215, 22505
        ];
        const total_points = pointThresholds.find((curelem) => total_earned_points < curelem) ?? 22505

        const completedPercentage = total_points > 0
            ? (Math.round((total_earned_points / total_points) * 100))
            : 0;

        // Calculate level
        const totalLevels = 30;

        let currentLevel = total_earned_points < 99 ? 1 : total_earned_points < 235 ? 2 : total_earned_points < 460 ? 3 : total_earned_points < 740 ? 4 : total_earned_points < 1070 ? 5 : total_earned_points < 1450 ? 6 : total_earned_points < 1875 ? 7 : total_earned_points < 2345 ? 8 : total_earned_points < 2860 ? 9 : total_earned_points < 3415 ? 10 : total_earned_points < 4015 ? 11 : total_earned_points < 4650 ? 12 : total_earned_points < 5325 ? 13 : total_earned_points < 6040 ? 14 : total_earned_points < 6795 ? 15 : total_earned_points < 7590 ? 16 : total_earned_points < 8420 ? 17 : total_earned_points < 9290 ? 18 : total_earned_points < 10195 ? 19 : total_earned_points < 11140 ? 20 : total_earned_points < 12120 ? 21 : total_earned_points < 13135 ? 22 : total_earned_points < 14185 ? 23 : total_earned_points < 15270 ? 24 : total_earned_points < 16390 ? 25 : total_earned_points < 17545 ? 26 : total_earned_points < 18730 ? 27 : total_earned_points < 19955 ? 28 : total_earned_points < 21215 ? 29 : total_earned_points < 22505 ? 30 : 31;

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
        const result2 = await findOne(userAuthModel, { _id: userId }, { createdAt: 0, updatedAt: 0, otp: 0, password: 0 });
        return showResponse(true, getMessage(language || 'en', "user_detail"), { ...result2.data, account_type, is_profile_completed: true, total_points, total_earned_points, completedPercentage, currentLevel, homeTheme, isOnBoardingComplete, isUnderProgress }, statusCodes.SUCCESS)
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

    uploadFileAdmin: async (data: any): Promise<ApiResponse> => {
        const { file } = data;
        const s3Upload = await services.awsService.uploadFileToS3Theme([file])
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
        const { hearAboutUs, howFellingLately, feelThatWay, likeToFellMore, helpFeelBetter, stopFeelBetter, timeYouCommit, goalStartWith, fullName, language } = data;
        const userDetails = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(userId), status: USER_STATUS.ACTIVE })
        if (!userDetails) {
            return showResponse(false, getMessage('en', "user_not_found"), null, statusCodes.API_ERROR)
        }
        const user_language = userDetails?.language || 'en';
        const updateObj: any = {
            ...(language?.trim() && { language }),
            ...(hearAboutUs?.trim() && { hearAboutUs }),
            ...(feelThatWay?.trim() && { feelThatWay }),
            ...(howFellingLately?.trim() && { howFellingLately }),
            ...(likeToFellMore?.trim() && { likeToFellMore }),
            ...(timeYouCommit?.trim() && { timeYouCommit }),
            ...(helpFeelBetter?.trim() && { helpFeelBetter }),
            ...(stopFeelBetter?.trim() && { stopFeelBetter }),
            ...(goalStartWith?.trim() && { goalStartWith }),
            ...(fullName?.trim() && { fullName }),
        }
        const userOnboarding: any = await userAuthModel.findOneAndUpdate({ _id: commonHelper.convertToObjectId(userId) }, updateObj, { new: true })
        //challenges logic start
        const newDetails = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(userId) })
        await ChallengesQueue.add('challenges', { userData: newDetails }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            jobId: userDetails?._id.toString().concat(Date.now().toString()),
        })

        const is_onboarding = [
            userOnboarding?.email,
            userOnboarding?.hearAboutUs,
            userOnboarding?.howFellingLately,
            userOnboarding?.feelThatWay,
            userOnboarding?.likeToFellMore,
            userOnboarding?.helpFeelBetter,
            userOnboarding?.stopFeelBetter,
            userOnboarding?.timeYouCommit,
            userOnboarding?.goalStartWith,
            userOnboarding?.fullName
        ].every(
            value =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ''
        );
        console.log(userOnboarding?.is_onboarding, is_onboarding, "data")

        if (userOnboarding?.is_onboarding !== is_onboarding) {
            // console.log("first")
            await findOneAndUpdate(userAuthModel, { _id: userOnboarding._id }, { 'is_onboarding': is_onboarding });
            userOnboarding.is_onboarding = is_onboarding;
        }
        return showResponse(true, getMessage(user_language || 'en', "user_onboarding_complete"), null, statusCodes.SUCCESS)
    },

    userTrialSubscription: async (user_id: any): Promise<ApiResponse> => {
        const trialExpireTime = moment().add(3, "days").unix();

        //check already take subscription plan
        const userAlreadyTakeSubscription = await findOne(userAuthModel, { _id: user_id, status: { $ne: 2 }, trial_package_use: true, });
        if (userAlreadyTakeSubscription.status) {
            return showResponse(false, "You already have a free trial plan going on.", null, statusCodes.API_ERROR);
        }
        const updateObj: any = { on_trial_period: true, trial_expire_time: trialExpireTime, trial_package_use: true };

        // Update user auth data with trial subscription information
        const updatedUserSubscriptionData = await findOneAndUpdate(userAuthModel, { _id: commonHelper.convertToObjectId(user_id), status: 1 }, updateObj);
        if (!updatedUserSubscriptionData.status) {
            return showResponse(false, "unable to update", null, statusCodes.API_ERROR);
        }
        return showResponse(true, "Free trial plan activated successfully", { on_trial_period: true, trial_expire_time: trialExpireTime, trial_package_use: true }, statusCodes.SUCCESS);
    }, //ends

    progressTrackerList: async (userId: string): Promise<ApiResponse> => {

        const userData = await userAuthModel.findOne({ _id: userId }).lean();

        if (!userData) {
            return showResponse(
                false,
                getMessage('en', "user_not_found"),
                null,
                statusCodes.API_ERROR
            )
        }

        const language = userData?.language || 'en';

        // ================= COMPLETED PHASE POINTS =================

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

        // ================= COMPLETED WEEKLY CHALLENGES =================

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

        // ================= COMPLETED DAILY CHALLENGES =================

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

        // ================= JOURNAL POINTS =================

        const startOfDay = moment()
            .tz(userData?.timeZone || 'America/New_York')
            .startOf('day')
            .toDate();

        const endOfDay = moment()
            .tz(userData?.timeZone || 'America/New_York')
            .endOf('day')
            .toDate();

        const totalJournels = await userJournalModel.countDocuments({
            user_id: commonHelper.convertToObjectId(userId),
            status: USER_STATUS.ACTIVE,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        const totalJournelEarnedPoints =
            totalJournels > 0
                ? ((totalJournels - 1) * 10) + 25
                : 0;

        // ================= TOTAL EARNED POINTS =================

        const total_earned_points =
            (CompletedPhases[0]?.total_points || 0) +
            (completedWeeklyChallenges[0]?.total_points || 0) +
            (completedDailyChallenges[0]?.total_points || 0) +
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

        let currentLevel =
            pointThresholds.findIndex(
                (points) => total_earned_points < points
            ) + 1;

        // if user completed all levels
        if (currentLevel === 0) {
            currentLevel = 30;
        }

        // ================= CURRENT LEVEL TOTAL POINTS =================

        const currentLevelTotalPoints =
            pointThresholds[currentLevel - 1] || 22505;

        // ================= OVERALL PROGRESS =================

        const completedPercentage =
            currentLevelTotalPoints > 0
                ? Math.min(
                    Math.round(
                        (total_earned_points / currentLevelTotalPoints) * 100
                    ),
                    100
                )
                : 0;

        // ================= LEVEL LISTING =================

        const progressListing = pointThresholds.map((threshold, index) => {

            const levelNumber = index + 1;

            let earned_point = 0;

            let progress = 0;

            let level_status:
                'completed'
                | 'inprogress'
                | 'pending' = 'pending';

            // COMPLETED LEVEL
            if (total_earned_points >= threshold) {

                earned_point = threshold;

                progress = 100;

                level_status = 'completed';
            }

            // CURRENT RUNNING LEVEL
            else if (levelNumber === currentLevel) {

                earned_point = total_earned_points;

                progress = Math.min(
                    Math.round((earned_point / threshold) * 100),
                    100
                );

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

        return showResponse(
            true,
            getMessage(language, "success"),
            {
                total_earned_points,
                currentLevel,
                completedPercentage,
                progressListing
            },
            statusCodes.SUCCESS
        );
    }, 


claimStreak: async (user_id: string): Promise<ApiResponse> => {
const STREAK_REWARDS: any = {
    3: 50,
    7: 100,
    14: 175,
    30: 250,
    60: 450,
    100: 1000,
};
    try {

        const user = await userAuthModel.findOne({
            _id: commonHelper.convertToObjectId(user_id),
            status: USER_STATUS.ACTIVE
        });

        if (!user) {
            return showResponse(
                false,
                "User not found",
                null,
                statusCodes.NOT_FOUND
            );
        }

        const userTimeZone = user.timeZone || "America/New_York";

        // =========================================
        // CURRENT DATE IN USER TIMEZONE
        // =========================================

        const today = moment().tz(userTimeZone).format("YYYY-MM-DD");
        console.log("today =====================================>>", today);

        const yesterday = moment()
            .tz(userTimeZone)
            .subtract(1, "day")
            .format("YYYY-MM-DD");
        console.log("yesterday =====================================>>", yesterday);

        console.log("user.last_streak_date =====================================>>", user.last_streak_date);

        // =========================================
        // ALREADY CLAIMED TODAY
        // =========================================

        if (user.last_streak_date === today) {

            return showResponse(
                true,
                "Streak already claimed today",
                {
                    is_hit: true,
                    streak_count: user.streak_count || 0,
                    streak_credit: user.streak_credit || 0,
                    rewardXP: 0,
                    streak_days: user.streak_days || []
                },
                statusCodes.SUCCESS
            );
        }

        let streakCount = user.streak_count || 0;
        let streakDays = user.streak_days || [];
        let streakCredit = user.streak_credit || 0;

        // =========================================
        // RESET IF DAY MISSED
        // =========================================

        if (
            user.last_streak_date &&
            user.last_streak_date !== yesterday
        ) {
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

        const unix = moment().unix();

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

        await userAuthModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    streak_count: streakCount,
                    streak_credit: streakCredit,
                    streak_days: streakDays,
                    last_streak_date: today,
                }
            }
        );

        return showResponse(
            true,
            "Streak claimed successfully",
            {
                is_hit:false,
                streak_count: streakCount,
                streak_credit: streakCredit,
                rewardXP,
                streak_days: streakDays
            },
            statusCodes.SUCCESS
        );

    } catch (error) {

        console.log(error, "CLAIM_STREAK_ERROR");

        return showResponse(
            false,
            responseMessage.common.server_error,
            null,
            statusCodes.API_ERROR
        );
    }
}


}

export default UserAuthHandler 
