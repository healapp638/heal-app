import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import userDailyChallengesModel from "./user.daily.challenges.model";
import userWeeklyChallengesModel from "./user.weekly.challenges.model";
import { USER_STATUS } from "../../constants/workflow.constant";
import moment from "moment";
import { getMessage } from "../../helpers/messages";
import userAuthModel from "../UserAuth/user.auth.model";
import { convertToObjectId } from "../../helpers/common.helper";
// import { ChallengesQueue } from "../../helpers/bullMqWorker";


const UserChallengesHandler = {


    list: async (userId: string, challenge_type: string): Promise<ApiResponse> => {
        const userLang = await userAuthModel.findOne({ _id: userId }).lean();
        const user_language = userLang?.language || 'en';
        // const isOnBoardingComplete = !!(userLang?.bringsYouHere && userLang?.howFellingLately && userLang?.likeToFellMore && userLang?.timeYouCommit && userLang?.startShowingOfYourSelf);
        const isOnBoardingComplete = [
            userLang?.email,
            userLang?.hearAboutUs,
            userLang?.howFellingLately,
            userLang?.feelThatWay,
            userLang?.likeToFellMore,
            userLang?.helpFeelBetter,
            userLang?.stopFeelBetter,
            userLang?.timeYouCommit,
            userLang?.goalStartWith,
            userLang?.fullName
        ].every(
            value =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ''
        );

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
            const dailyChallenges = await userDailyChallengesModel.aggregate([
                {
                    $match: {
                        status: USER_STATUS.ACTIVE,
                        user_id: convertToObjectId(userId),
                        createdAt: {
                            $gte: moment().startOf('day').toDate(),
                            $lte: moment().endOf('day').toDate()
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
                return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, { isUnderProgress: true }, statusCodes.SUCCESS);
            }
            return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, dailyChallenges, statusCodes.SUCCESS)
        }
        if (challenge_type == 'weekly') {
            const weeklyChallenges = await userWeeklyChallengesModel.aggregate([
                {
                    $match: {
                        status: USER_STATUS.ACTIVE,
                        user_id: convertToObjectId(userId),
                        createdAt: {
                            $gte: moment().startOf('week').toDate(),
                            $lte: moment().endOf('week').toDate()
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
                return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, { isUnderProgress: true }, statusCodes.SUCCESS)
            }
            return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, weeklyChallenges, statusCodes.SUCCESS)
        }


        return showResponse(false, responseMessage?.common?.invalid_challenge_type, {}, statusCodes.API_ERROR)
    },

    challengeDetails: async (userId: string, challenge_type: string, challenge_id: string): Promise<ApiResponse> => {
        const userDetails: any = await userAuthModel.findOne({ _id: userId })
        if (!userDetails) {
            return showResponse(false, getMessage(userDetails?.language || 'en', 'user_not_found'), {}, statusCodes.API_ERROR)
        }
        const user_language = userDetails?.language || 'en';
        if (challenge_type == 'daily') {
            const dailyChallenge = await userDailyChallengesModel.aggregate([
                {
                    $match: {
                        _id: convertToObjectId(challenge_id),
                        status: USER_STATUS.ACTIVE,
                        user_id: convertToObjectId(userId),
                        createdAt: {
                            $gte: moment().startOf('day').toDate(),
                            $lte: moment().endOf('day').toDate()
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
            ])
            return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, dailyChallenge, statusCodes.SUCCESS)
        }
        if (challenge_type == 'weekly') {
            const weeklyChallenge = await userWeeklyChallengesModel.aggregate([
                {
                    $match: {
                        _id: convertToObjectId(challenge_id),
                        status: USER_STATUS.ACTIVE,
                        user_id: convertToObjectId(userId),
                        createdAt: {
                            $gte: moment().startOf('day').toDate(),
                            $lte: moment().endOf('day').toDate()
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
            ])
            return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, weeklyChallenge, statusCodes.SUCCESS)
        }
        return showResponse(false, getMessage(userDetails?.language || 'en', 'invalid_challenge_type'), {}, statusCodes.API_ERROR)
    },

    completeChallenges: async (userId: string, challenge_type: string, challenge_id: string): Promise<ApiResponse> => {
        const userDetails: any = await userAuthModel.findOne({ _id: userId })
        if (!userDetails) {
            return showResponse(false, getMessage(userDetails?.language || 'en', 'user_not_found'), {}, statusCodes.API_ERROR)
        }
        if (challenge_type == 'daily') {
            await userDailyChallengesModel.findByIdAndUpdate(challenge_id, { isCompleted: true })
            return showResponse(true, getMessage(userDetails?.language || 'en', 'challenges_completed_successfully'), { points: 10 }, statusCodes.SUCCESS)
        }
        if (challenge_type == 'weekly') {
            await userWeeklyChallengesModel.findByIdAndUpdate(challenge_id, { isCompleted: true })
            return showResponse(true, getMessage(userDetails?.language || 'en', 'challenges_completed_successfully'), { points: 25 }, statusCodes.SUCCESS)
        }
        return showResponse(false, getMessage(userDetails?.language || 'en', 'invalid_challenge_type'), {}, statusCodes.API_ERROR)
    }


}

export default UserChallengesHandler 
