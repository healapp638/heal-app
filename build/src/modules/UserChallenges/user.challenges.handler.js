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
const response_util_1 = require("../../utils/response.util");
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_daily_challenges_model_1 = __importDefault(require("./user.daily.challenges.model"));
const user_weekly_challenges_model_1 = __importDefault(require("./user.weekly.challenges.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const moment_1 = __importDefault(require("moment"));
const messages_1 = require("../../helpers/messages");
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const common_helper_1 = require("../../helpers/common.helper");
// import { ChallengesQueue } from "../../helpers/bullMqWorker";
const UserChallengesHandler = {
    list: (userId, challenge_type) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const userLang = yield user_auth_model_1.default.findOne({ _id: userId }).lean();
        const user_language = (userLang === null || userLang === void 0 ? void 0 : userLang.language) || 'en';
        // const isOnBoardingComplete = !!(userLang?.bringsYouHere && userLang?.howFellingLately && userLang?.likeToFellMore && userLang?.timeYouCommit && userLang?.startShowingOfYourSelf);
        const isOnBoardingComplete = [
            userLang === null || userLang === void 0 ? void 0 : userLang.email,
            userLang === null || userLang === void 0 ? void 0 : userLang.hearAboutUs,
            userLang === null || userLang === void 0 ? void 0 : userLang.howFellingLately,
            userLang === null || userLang === void 0 ? void 0 : userLang.feelThatWay,
            userLang === null || userLang === void 0 ? void 0 : userLang.likeToFellMore,
            userLang === null || userLang === void 0 ? void 0 : userLang.helpFeelBetter,
            userLang === null || userLang === void 0 ? void 0 : userLang.stopFeelBetter,
            userLang === null || userLang === void 0 ? void 0 : userLang.timeYouCommit,
            userLang === null || userLang === void 0 ? void 0 : userLang.goalStartWith,
            userLang === null || userLang === void 0 ? void 0 : userLang.fullName
        ].every(value => value !== undefined &&
            value !== null &&
            String(value).trim() !== '');
        // const isDailyExist = await userDailyChallengesModel.countDocuments({
        //     user_id: convertToObjectId(userId),
        //     createdAt: {
        //         $gte: moment().startOf('day').toDate(),
        //         $lte: moment().endOf('day').toDate()
        //     },
        //     status: USER_STATUS.ACTIVE
        // });
        // const isWeeklyExist = await userWeeklyChallengesModel.countDocuments({
        //     user_id: convertToObjectId(userId),
        //     createdAt: {
        //         $gte: moment().startOf('week').toDate(),
        //         $lte: moment().endOf('week').toDate()
        //     },
        //     status: USER_STATUS.ACTIVE
        // });
        // if (isDailyExist == 0 && isOnBoardingComplete) {
        //     setTimeout(async () => {
        //         // challenges logic start
        //         await ChallengesQueue.add('challenges', { userLang }, {
        //             attempts: 3,
        //             backoff: {
        //                 type: 'exponential',
        //                 delay: 1000
        //             },
        //             removeOnComplete: true,
        //             jobId: userLang?._id.toString(),
        //         });
        //     }, 5000)
        // }
        // if (isWeeklyExist == 0 && isOnBoardingComplete) {
        //     setTimeout(async () => {
        //         // challenges logic start
        //         await ChallengesQueue.add('challenges', { userLang }, {
        //             attempts: 3,
        //             backoff: {
        //                 type: 'exponential',
        //                 delay: 1000
        //             },
        //             removeOnComplete: true,
        //             jobId: userLang?._id.toString(),
        //         });
        //     }, 5000)
        // }
        if (challenge_type == 'daily') {
            const dailyChallenges = yield user_daily_challenges_model_1.default.aggregate([
                {
                    $match: {
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
                        user_id: (0, common_helper_1.convertToObjectId)(userId),
                        createdAt: {
                            $gte: (0, moment_1.default)().startOf('day').toDate(),
                            $lte: (0, moment_1.default)().endOf('day').toDate()
                        }
                    }
                },
                {
                    $addFields: {
                        title: `$title.${user_language}`,
                        description: `$description.${user_language}`
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        points: 1,
                        isCompleted: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        challenge_type: 1,
                        end_date_unix: 1,
                    }
                },
                {
                    $limit: 3
                }
            ]);
            if (dailyChallenges.length == 0 && isOnBoardingComplete) {
                return (0, response_util_1.showResponse)(true, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.challenges_fetched_successfully, { isUnderProgress: true }, statusCodes_1.default.SUCCESS);
            }
            return (0, response_util_1.showResponse)(true, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _b === void 0 ? void 0 : _b.challenges_fetched_successfully, dailyChallenges, statusCodes_1.default.SUCCESS);
        }
        if (challenge_type == 'weekly') {
            const weeklyChallenges = yield user_weekly_challenges_model_1.default.aggregate([
                {
                    $match: {
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
                        user_id: (0, common_helper_1.convertToObjectId)(userId),
                        createdAt: {
                            $gte: (0, moment_1.default)().startOf('week').toDate(),
                            $lte: (0, moment_1.default)().endOf('week').toDate()
                        }
                    }
                },
                {
                    $addFields: {
                        title: `$title.${user_language}`,
                        description: `$description.${user_language}`
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        points: 1,
                        isCompleted: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        challenge_type: 1,
                        end_date_unix: 1,
                    }
                },
                {
                    $limit: 3
                }
            ]);
            if (weeklyChallenges.length == 0 && isOnBoardingComplete) {
                return (0, response_util_1.showResponse)(true, (_c = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _c === void 0 ? void 0 : _c.challenges_fetched_successfully, { isUnderProgress: true }, statusCodes_1.default.SUCCESS);
            }
            return (0, response_util_1.showResponse)(true, (_d = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _d === void 0 ? void 0 : _d.challenges_fetched_successfully, weeklyChallenges, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, (_e = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _e === void 0 ? void 0 : _e.invalid_challenge_type, {}, statusCodes_1.default.API_ERROR);
    }),
    challengeDetails: (userId, challenge_type, challenge_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const userDetails = yield user_auth_model_1.default.findOne({ _id: userId });
        if (!userDetails) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)((userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en', 'user_not_found'), {}, statusCodes_1.default.API_ERROR);
        }
        const user_language = (userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en';
        if (challenge_type == 'daily') {
            const dailyChallenge = yield user_daily_challenges_model_1.default.aggregate([
                {
                    $match: {
                        _id: (0, common_helper_1.convertToObjectId)(challenge_id),
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
                        user_id: (0, common_helper_1.convertToObjectId)(userId),
                        createdAt: {
                            $gte: (0, moment_1.default)().startOf('day').toDate(),
                            $lte: (0, moment_1.default)().endOf('day').toDate()
                        }
                    }
                },
                {
                    $addFields: {
                        concept_title: `$concept_title.${user_language}`,
                        concept_description: `$concept_description.${user_language}`,
                        about_challenge: `$about_challenge.${user_language}`,
                        exercises: {
                            $map: {
                                input: "$exercises",
                                as: "exercise",
                                in: {
                                    _id: "$$exercise._id",
                                    step_number: "$$exercise.step_number",
                                    title: `$$exercise.title.${user_language}`
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        concept_title: 1,
                        concept_description: 1,
                        about_challenge: 1,
                        points: 1,
                        exercises: 1
                    }
                }
            ]);
            return (0, response_util_1.showResponse)(true, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.challenges_fetched_successfully, dailyChallenge, statusCodes_1.default.SUCCESS);
        }
        if (challenge_type == 'weekly') {
            const weeklyChallenge = yield user_weekly_challenges_model_1.default.aggregate([
                {
                    $match: {
                        _id: (0, common_helper_1.convertToObjectId)(challenge_id),
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
                        user_id: (0, common_helper_1.convertToObjectId)(userId),
                        createdAt: {
                            $gte: (0, moment_1.default)().startOf('day').toDate(),
                            $lte: (0, moment_1.default)().endOf('day').toDate()
                        }
                    }
                },
                {
                    $addFields: {
                        concept_title: `$concept_title.${user_language}`,
                        concept_description: `$concept_description.${user_language}`,
                        about_challenge: `$about_challenge.${user_language}`,
                        exercises: {
                            $map: {
                                input: "$exercises",
                                as: "exercise",
                                in: {
                                    _id: "$$exercise._id",
                                    step_number: "$$exercise.step_number",
                                    title: `$$exercise.title.${user_language}`
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        concept_title: 1,
                        concept_description: 1,
                        about_challenge: 1,
                        points: 1,
                        exercises: 1
                    }
                }
            ]);
            return (0, response_util_1.showResponse)(true, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _b === void 0 ? void 0 : _b.challenges_fetched_successfully, weeklyChallenge, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)((userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en', 'invalid_challenge_type'), {}, statusCodes_1.default.API_ERROR);
    }),
    completeChallenges: (userId, challenge_type, challenge_id) => __awaiter(void 0, void 0, void 0, function* () {
        const userDetails = yield user_auth_model_1.default.findOne({ _id: userId });
        if (!userDetails) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)((userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en', 'user_not_found'), {}, statusCodes_1.default.API_ERROR);
        }
        if (challenge_type == 'daily') {
            yield user_daily_challenges_model_1.default.findByIdAndUpdate(challenge_id, { isCompleted: true });
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)((userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en', 'challenges_completed_successfully'), { points: 10 }, statusCodes_1.default.SUCCESS);
        }
        if (challenge_type == 'weekly') {
            yield user_weekly_challenges_model_1.default.findByIdAndUpdate(challenge_id, { isCompleted: true });
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)((userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en', 'challenges_completed_successfully'), { points: 25 }, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)((userDetails === null || userDetails === void 0 ? void 0 : userDetails.language) || 'en', 'invalid_challenge_type'), {}, statusCodes_1.default.API_ERROR);
    })
};
exports.default = UserChallengesHandler;
