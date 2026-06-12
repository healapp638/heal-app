import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from "../../constants/responseMessages";
import statusCodes from "../../constants/statusCodes";
import { USER_STATUS } from "../../constants/workflow.constant";
import { createOne, findOne } from "../../helpers/db.helpers";
import userAuthModel from "../UserAuth/user.auth.model";
import { convertToObjectId } from "../../helpers/common.helper";
import * as commonHelper from "../../helpers/common.helper";
import adminHomethemeModel from "../AdminHometheme/admin.hometheme.model";
import userRecentHomeThemeModel from "./user.recentHomeTheme.model";
import adminHomethemeCategoryModel from "../AdminHometheme/admin.homethemeCategory.model";


const homeThemeHandler = {
  addUserTheme: async (user_id: string,data: any): Promise<ApiResponse> => {
    try {
        const { homeTheme_id } = data;

        // ================= CHECK USER =================

        const userData = await findOne(userAuthModel, {
            _id: convertToObjectId(user_id),
            status: USER_STATUS.ACTIVE,
        });

        if (!userData?.status) {

            return showResponse(
                false,
                responseMessage.common.not_exist,
                null,
                statusCodes.NOT_FOUND,
            );
        }

        // ================= CHECK THEME =================

        const themeData = await findOne(adminHomethemeModel, {
            _id: convertToObjectId(homeTheme_id),
            status: USER_STATUS.ACTIVE,
        });

        if (!themeData?.status) {

            return showResponse(
                false,
                "Theme not found",
                null,
                statusCodes.NOT_FOUND,
            );
        }

        // ================= CREATE =================

        const createTheme = new userRecentHomeThemeModel({
            user_id: convertToObjectId(user_id),
            homeTheme_id:
                convertToObjectId(homeTheme_id),

            status: USER_STATUS.ACTIVE,
        });

        const savedTheme =
            await createOne(createTheme);

        return showResponse(
            true,
            "Theme added successfully",
            savedTheme?.data,
            statusCodes.SUCCESS,
        );

    } catch (error) {
        console.log(
            error,
            "ADD_USER_THEME_ERROR"
        );
        return showResponse(
            false,
            responseMessage.common.server_error,
            null,
            statusCodes.API_ERROR,
        );
    }
},
  getHomeThemeCategory: async (user_id: any): Promise<ApiResponse> => {
    const userdata = await findOne(userAuthModel, {
      _id: convertToObjectId(user_id),
      status: USER_STATUS.ACTIVE,
    });

    if (!userdata) {
      return showResponse(
        false,
        responseMessage.common.data_not_found,
        null,
        statusCodes.NOT_FOUND,
      );
    }

    // user selected language
    const language = userdata?.data?.language || "en";

    // latest AI affirmation
    const themeCategory: any = await adminHomethemeCategoryModel
      .find({
        status: USER_STATUS.ACTIVE,
      })
      .sort({ createdAt: -1 });

    if (!themeCategory) {
      return showResponse(
        false,
        "No Category Found",
        null,
        statusCodes.NOT_FOUND,
      );
    }
    console.log(themeCategory,"themeCategory")

    // return only user's language
    // const responseData = {
    //   _id: themeCategory[0]._id,
    //   title:
    //     themeCategory[0]?.title?.[language] ||
    //     themeCategory?.title?.en,
    //   imgUrl: themeCategory[0].imgUrl,
    //   createdAt: themeCategory[0].createdAt,
    // };

    const responseData =
        themeCategory.map((item: any) => ({

            _id: item._id,

            title:
                item?.title?.[language] ||
                item?.title?.en,

            imgUrl: item.imgUrl,

            createdAt: item.createdAt,
        }));
    console.log(responseData,"responseData")

    return showResponse(
      true,
      responseMessage.common.data_retreive_sucess,
      responseData,
      statusCodes.SUCCESS,
    );
  },

  getHomeThemeListing: async (
    data: any,
    user_id: string
): Promise<ApiResponse> => {
    try {
        const {
            filter = "all", // all | new | most_popular | recent
            categoryTheme_id = "",
            page = 1,
            limit = 10,
        } = data;

        // ==================================================
        // LATEST SELECTED THEME
        // ==================================================

        const latestRecentTheme =
            await userRecentHomeThemeModel
                .findOne({
                    user_id: convertToObjectId(user_id),
                    status: USER_STATUS.ACTIVE,
                })
                .sort({ createdAt: -1 })
                .lean();

        const selectedThemeId =
            latestRecentTheme?.homeTheme_id || null;
        // ================= MATCH =================
        const matchQuery: any = {
            status: USER_STATUS.ACTIVE,
        };
        // category filter
        if (categoryTheme_id) {
            matchQuery.categoryTheme_id =
                convertToObjectId(categoryTheme_id);
        }
        let aggregate: any[] = [];
        // ==================================================
        // ALL THEMES
        // ==================================================
        if (filter === "all") {

            aggregate = [
                {
                    $match: matchQuery,
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
            ];
        }

        // ==================================================
        // NEW THEMES (LATEST 5)
        // ==================================================
        else if (filter === "new") {

            aggregate = [
                {
                    $match: matchQuery,
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $limit: 5,
                },
            ];
        }
        // ==================================================
        // MOST POPULAR
        // ==================================================

        else if (filter === "most_popular") {
            aggregate = [
                {
                    $match: {
                        status: USER_STATUS.ACTIVE,
                    },
                },

                // count recent usage
                {
                    $lookup: {
                        from: "recenthomethemes",
                        localField: "_id",
                        foreignField: "homeTheme_id",
                        as: "recentThemeData",
                    },
                },
                {
                    $addFields: {
                        totalUsed: {
                            $size: "$recentThemeData",
                        },
                    },
                },
                // category filter
                {
                    $match: matchQuery,
                },

                {
                    $sort: {
                        totalUsed: -1,
                        createdAt: -1,
                    },
                },
                {
                    $limit: 5,
                },
            ];
        }
        // ==================================================
        // RECENT USER THEMES
        // ==================================================

        else if (filter === "recent") {

            aggregate = [

                {
                    $lookup: {
                        from: "recenthomethemes",
                        localField: "_id",
                        foreignField: "homeTheme_id",
                        as: "recentThemeData",
                    },
                },
                {
                    $match: {
                        ...matchQuery,
                        "recentThemeData.user_id":
                            convertToObjectId(user_id),
                    },
                },
                {
                    $sort: {
                        "recentThemeData.createdAt": -1,
                    },
                },
                {
                    $limit: 5,
                },
            ];
        }

        // ==================================================
        // INVALID FILTER
        // ==================================================

        else {

            return showResponse(
                false,
                "Invalid filter",
                null,
                statusCodes.VALIDATION_ERROR,
            );
        }

        // ==================================================
        // COMMON PROJECT
        // ==================================================

        aggregate.push({
            $project: {
                _id: 1,
                imgUrl: 1,
                categoryTheme_id: 1,
                createdAt: 1,
                homeImgUrl:1,
                isSelected: {
                    $cond: [
                        {
                            $eq: [
                                "$_id",
                                selectedThemeId,
                            ],
                        },
                        true,
                        false,
                    ],
                },
            },
        });

        // ==================================================
        // PAGINATION
        // ==================================================

        const { totalCount, aggregation } =
            await commonHelper.getCountAndPagination(
                adminHomethemeModel,
                aggregate,
                page,
                limit,
            );

        const result =
            await adminHomethemeModel.aggregate(
                aggregation
            );

        return showResponse(
            true,
            responseMessage.common
                .data_retreive_sucess,
            {
                result,
                totalCount,
            },
            statusCodes.SUCCESS,
        );

    } catch (error) {

        console.log(
            error,
            "GET_HOME_THEME_LISTING_ERROR"
        );

        return showResponse(
            false,
            responseMessage.common.server_error,
            null,
            statusCodes.API_ERROR,
        );
    }
},
getMyTheme: async (user_id: string): Promise<ApiResponse> => {

    try {

        // ================= RECENT THEME =================

        const aggregate:any = [

            {
                $match: {
                    user_id: convertToObjectId(user_id),
                    status: USER_STATUS.ACTIVE,
                },
            },

            // latest selected theme
            {
                $sort: {
                    createdAt: -1,
                },
            },

            {
                $limit: 1,
            },

            // theme details
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
                    homeImgUrl:"$themeData.homeImgUrl",
                    categoryTheme_id:
                        "$themeData.categoryTheme_id",
                    createdAt: "$themeData.createdAt",
                    updatedAt: "$themeData.updatedAt",
                },
            },
        ];

        const result =
            await userRecentHomeThemeModel.aggregate(
                aggregate
            );

        return showResponse(
            true,
            responseMessage.common
                .data_retreive_sucess,
            result?.[0] || null,
            statusCodes.SUCCESS,
        );

    } catch (error) {

        console.log(
            error,
            "GET_MY_THEME_ERROR"
        );

        return showResponse(
            false,
            responseMessage.common.server_error,
            null,
            statusCodes.API_ERROR,
        );
    }
}


};

export default homeThemeHandler;
