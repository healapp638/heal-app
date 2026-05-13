import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import userDailyChallengesModel from "./user.daily.challenges.model";
import userWeeklyChallengesModel from "./user.weekly.challenges.model";
import { USER_STATUS } from "../../constants/workflow.constant";
import moment from "moment";


const UserChallengesHandler = {


    list: async (userId: string): Promise<ApiResponse> => {
        const [dailyChallenges, weeklyChallenges] = await Promise.all([
            await userDailyChallengesModel.find({ user_id: userId, status: USER_STATUS.ACTIVE, createdAt: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } }),
            await userWeeklyChallengesModel.find({ user_id: userId, status: USER_STATUS.ACTIVE, createdAt: { $gte: moment().startOf('week').toDate(), $lte: moment().endOf('week').toDate() } })
        ])
        return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, { dailyChallenges, weeklyChallenges }, statusCodes.SUCCESS)
    },

    completeChallenges: async (userId: string): Promise<ApiResponse> => {
        console.log(userId, "userId")
        return showResponse(true, "Challenges completed successfully", {}, statusCodes.SUCCESS)
    }


}

export default UserChallengesHandler 
