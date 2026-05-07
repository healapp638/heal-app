import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from "../../constants/responseMessages";
import statusCodes from "../../constants/statusCodes";
import {  USER_STATUS } from "../../constants/workflow.constant";
// import { translateText } from "../../helpers/langauge.translate.helper";
import userAffirmationModel from "./user.affirmation.model";
// import OpenAI from "openai";
// import { APP } from "../../constants/app.constant";
import { findOne } from "../../helpers/db.helpers";
import userAuthModel from "../UserAuth/user.auth.model";
import { convertToObjectId } from "../../helpers/common.helper";

const affirmationHandler = {

getAIAffirmation: async (user_id: any): Promise<ApiResponse> => {

    const userdata = await findOne(
        userAuthModel,
        {
            _id: convertToObjectId(user_id),
            status: USER_STATUS.ACTIVE
        }
    );

    if (!userdata) {
        return showResponse(
            false,
            responseMessage.common.data_not_found,
            null,
            statusCodes.NOT_FOUND
        );
    }

    // user selected language
    const language =
        userdata?.data?.language || "en";

    // latest AI affirmation
    const aiAffirmation:any =
        await userAffirmationModel
            .findOne({
                type: "AI",
                status: USER_STATUS.ACTIVE
            })
            .sort({ createdAt: -1 });

    if (!aiAffirmation) {
        return showResponse(
            false,
            "No AI affirmation found",
            null,
            statusCodes.NOT_FOUND
        );
    }

    // return only user's language
    const responseData = {
        _id: aiAffirmation._id,
        affirmation:
            aiAffirmation?.affirmation?.[language] ||
            aiAffirmation?.affirmation?.en,
        type: aiAffirmation.type,
        createdAt: aiAffirmation.createdAt
    };

    return showResponse(
        true,
        responseMessage.common.data_retreive_sucess,
        responseData,
        statusCodes.SUCCESS
    );
},
addView: async (
    data: any,
    user_id: any
): Promise<ApiResponse> => {
        const { affirmation_id } = data;

        const updateAffirmation =
            await userAffirmationModel.findOneAndUpdate(
                {
                    _id: convertToObjectId(affirmation_id),
                    status: USER_STATUS.ACTIVE,
                },
                {
                    // add user_id only if not already exists
                    $addToSet: {
                        user_id: convertToObjectId(user_id),
                    },
                },
                {
                    new: true,
                }
            );

        if (!updateAffirmation) {

            return showResponse(
                false,
                "Affirmation not found",
                null,
                statusCodes.API_ERROR
            );
        }

        return showResponse(
            true,
            "User added successfully",
            updateAffirmation,
            statusCodes.SUCCESS
        );
},


};

export default affirmationHandler;
