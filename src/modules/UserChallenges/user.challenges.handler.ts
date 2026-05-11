import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import userDailyChallengesModel from "./user.daily.challenges.model";
import userWeeklyChallengesModel from "./user.weekly.challenges.model";
import { USER_STATUS } from "../../constants/workflow.constant";
import moment from "moment";


const UserChallengesHandler = {

    add: async (userId: string): Promise<ApiResponse> => {
        await userAuthModel.findOne({ _id: userId });
        return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, {}, statusCodes.SUCCESS)
    },

    list: async ( userId: string): Promise<ApiResponse> => {
        // const startOfDay = moment().startOf('day').toDate();
        // const endOfDay = moment().endOf('day').toDate();
        
        const [dailyChallenges, weeklyChallenges] = await Promise.all([
            await userDailyChallengesModel.find({ user_id: userId, status: USER_STATUS.ACTIVE }),
            await userWeeklyChallengesModel.find({ user_id: userId, status: USER_STATUS.ACTIVE })
        ])
        return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, { dailyChallenges, weeklyChallenges }, statusCodes.SUCCESS)
    }


}

export default UserChallengesHandler 
