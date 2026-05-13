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


const UserChallengesHandler = {


    list: async (userId: string): Promise<ApiResponse> => {
        const [dailyChallenges, weeklyChallenges] = await Promise.all([
            await userDailyChallengesModel.find({ user_id: userId, status: USER_STATUS.ACTIVE, createdAt: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } }),
            await userWeeklyChallengesModel.find({ user_id: userId, status: USER_STATUS.ACTIVE, createdAt: { $gte: moment().startOf('week').toDate(), $lte: moment().endOf('week').toDate() } })
        ])
        return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, { dailyChallenges, weeklyChallenges }, statusCodes.SUCCESS)
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
