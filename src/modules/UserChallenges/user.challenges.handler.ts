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


const UserChallengesHandler = {


    list: async (userId: string, challenge_type: string): Promise<ApiResponse> => {
        const userLang = await userAuthModel.findOne({ _id: userId });
        const user_language = userLang?.language || 'en';
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
                }
            ])
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
                }
            ])
            return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, weeklyChallenges, statusCodes.SUCCESS)
        }
        return showResponse(false, responseMessage?.common?.invalid_challenge_type, {}, statusCodes.API_ERROR)
    },

    completeChallenges: async (userId: string, challenge_type: string, challenge_id: string): Promise<ApiResponse> => {
        const userDetails: any = await userAuthModel.findOne({ _id: userId })
        if (!userDetails) {
            return showResponse(false, getMessage(userDetails?.language || 'en', 'user_not_found'), {}, statusCodes.API_ERROR)
        }
        if (challenge_type == 'daily') {
            await userDailyChallengesModel.findByIdAndUpdate(challenge_id, { isCompleted: true })
            return showResponse(true, getMessage(userDetails?.language || 'en', 'challenges_completed_successfully'), {}, statusCodes.SUCCESS)
        }
        if (challenge_type == 'weekly') {
            await userWeeklyChallengesModel.findByIdAndUpdate(challenge_id, { isCompleted: true })
            return showResponse(true, getMessage(userDetails?.language || 'en', 'challenges_completed_successfully'), {}, statusCodes.SUCCESS)
        }
        return showResponse(false, getMessage(userDetails?.language || 'en', 'invalid_challenge_type'), {}, statusCodes.API_ERROR)
    }


}

export default UserChallengesHandler 
