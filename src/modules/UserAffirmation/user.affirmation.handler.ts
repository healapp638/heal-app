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
import * as commonHelper from "../../helpers/common.helper";

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
getAffirmationListing: async (data: any,user_id: any): Promise<ApiResponse> => {

    try {

        const {
            sort_column = "createdAt",
            sort_direction = "desc",
            page = 1,
            limit = 10
        } = data;

        // ================= USER =================
        const userData = await findOne(
            userAuthModel,
            {
                _id: convertToObjectId(user_id),
                status: USER_STATUS.ACTIVE,
            }
        );

        if (!userData) {

            return showResponse(
                false,
                responseMessage.common.not_exist,
                null,
                statusCodes.NOT_FOUND
            );
        }

        // user language
        const language =
            userData?.data?.language || "en";

        // ================= QUERY =================
        const queryObject: any = {
            status: USER_STATUS.ACTIVE,

            // hide already viewed affirmations
            user_id: {
                $nin: [convertToObjectId(user_id)],
            }
        };

        // ================= AGGREGATE =================
        const aggregate: any = [
            {
                $match: queryObject,
            },

            {
                $sort: {
                    [sort_column]:
                        sort_direction === "asc"
                            ? 1
                            : -1,
                },
            },

            {
                $project: {
                    _id: 1,

                    affirmation: {
                        $ifNull: [
                            `$affirmation.${language}`,
                            "$affirmation.en",
                        ],
                    },

                    type: 1,
                    createdAt: 1,
                },
            },
        ];

        // ================= PAGINATION =================
        let {
            totalCount,
            aggregation,
        } = await commonHelper.getCountAndPagination(
            userAffirmationModel,
            aggregate,
            page,
            limit
        );

        let result =
            await userAffirmationModel.aggregate(
                aggregation
            );

        // ================= RESET IF ALL USED =================
        if (!result.length) {

            // remove user from all affirmations
            await userAffirmationModel.updateMany(
                {
                    user_id: {
                        $in: [
                            convertToObjectId(user_id),
                        ],
                    },
                },
                {
                    $pull: {
                        user_id:
                            convertToObjectId(user_id),
                    },
                }
            );

            // rerun aggregation
            ({
                totalCount,
                aggregation,
            } = await commonHelper.getCountAndPagination(
                userAffirmationModel,
                aggregate,
                page,
                limit
            ));

            result =
                await userAffirmationModel.aggregate(
                    aggregation
                );
        }

        return showResponse(
            true,
            responseMessage.common
                .data_retreive_sucess,
            {
                result,
                totalCount,
            },
            statusCodes.SUCCESS
        );

    } catch (error) {

        console.log(
            error,
            "GET_AFFIRMATION_LISTING_ERROR"
        );

        return showResponse(
            false,
            responseMessage.common.server_error,
            null,
            statusCodes.API_ERROR
        );
    }
}

};

export default affirmationHandler;
