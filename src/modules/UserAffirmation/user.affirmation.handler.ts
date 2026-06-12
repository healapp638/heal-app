import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from "../../constants/responseMessages";
import statusCodes from "../../constants/statusCodes";
import { USER_STATUS } from "../../constants/workflow.constant";
import userAffirmationModel from "./user.affirmation.model";
import { createOne, findOne, findOneAndUpdate } from "../../helpers/db.helpers";
import userAuthModel from "../UserAuth/user.auth.model";
import { convertToObjectId } from "../../helpers/common.helper";
import * as commonHelper from "../../helpers/common.helper";
import userAffirmationLikeModel from "./user.affirmationLike.model";
import userDeeplinkModel from "./user.deeplink.model";

const affirmationHandler = {
  getAIAffirmation: async (user_id: any): Promise<ApiResponse> => {
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
    // console.log(userdata,"userdata")

    // user selected language
    const language = userdata?.data?.language || "en";
    // console.log(language,"language")

    // latest AI affirmation
    const aiAffirmation: any = await userAffirmationModel
      .findOne({
        type: "AI",
        status: USER_STATUS.ACTIVE,
      })
      .sort({ createdAt: -1 });

    if (!aiAffirmation) {
      return showResponse(
        false,
        "No AI affirmation found",
        null,
        statusCodes.NOT_FOUND,
      );
    }

    // return only user's language
    const responseData = {
      _id: aiAffirmation._id,
      affirmation:
        aiAffirmation?.affirmation?.[language] ||
        aiAffirmation?.affirmation?.en,
      type: aiAffirmation.type,
      createdAt: aiAffirmation.createdAt,
    };

    return showResponse(
      true,
      responseMessage.common.data_retreive_sucess,
      responseData,
      statusCodes.SUCCESS,
    );
  },
 
  addView: async (data: any, user_id: any): Promise<ApiResponse> => {
    const { affirmation_id } = data;

    const updateAffirmation = await userAffirmationModel.findOneAndUpdate(
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
      },
    );

    if (!updateAffirmation) {
      return showResponse(
        false,
        "Affirmation not found",
        null,
        statusCodes.API_ERROR,
      );
    }

    return showResponse(
      true,
      "User added successfully",
      updateAffirmation,
      statusCodes.SUCCESS,
    );
  },

//   getAffirmationListing: async (
//   data: any,
//   user_id: any,
// ): Promise<ApiResponse> => {

//   try {

//     const {
//       page = 1,
//       limit = 10,
//     } = data;

//     // ================= USER =================
//     const userData = await findOne(
//       userAuthModel,
//       {
//         _id: convertToObjectId(user_id),
//         status: USER_STATUS.ACTIVE,
//       }
//     );

//     if (!userData) {

//       return showResponse(
//         false,
//         responseMessage.common.not_exist,
//         null,
//         statusCodes.NOT_FOUND,
//       );
//     }

//     // ================= LANGUAGE =================
//     const language =
//       userData?.data?.language || "en";

//     // ================= COMMON QUERY =================
//     const commonQuery: any = {
//       status: USER_STATUS.ACTIVE,

//       // hide already viewed affirmations
//       user_id: {
//         $nin: [convertToObjectId(user_id)],
//       },
//     };

//     // ================= LATEST AI AFFIRMATION =================
//     let latestAI =
//       await userAffirmationModel.aggregate([

//         {
//           $match: {
//             status: USER_STATUS.ACTIVE,
//             type: "AI",
//           },
//         },

//         {
//           $sort: {
//             createdAt: -1,
//           },
//         },

//         {
//           $limit: 1,
//         },

//         {
//           $lookup: {
//             from: "likeaffirmations",

//             let: {
//               affirmationId: "$_id",
//             },

//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       {
//                         $eq: [
//                           "$affirmation_id",
//                           "$$affirmationId",
//                         ],
//                       },
//                       {
//                         $eq: [
//                           "$user_id",
//                           convertToObjectId(user_id),
//                         ],
//                       },
//                       {
//                         $eq: [
//                           "$status",
//                           USER_STATUS.ACTIVE,
//                         ],
//                       },
//                     ],
//                   },
//                 },
//               },
//             ],

//             as: "likedData",
//           },
//         },

//         {
//           $project: {

//             _id: 1,

//             affirmation: {
//               $ifNull: [
//                 `$affirmation.${language}`,
//                 "$affirmation.en",
//               ],
//             },

//             type: 1,

//             createdAt: 1,

//             is_liked: {
//               $cond: [
//                 {
//                   $gt: [
//                     {
//                       $size: "$likedData",
//                     },
//                     0,
//                   ],
//                 },
//                 true,
//                 false,
//               ],
//             },
//           },
//         },
//       ]);

//     // ================= REMAINING AFFIRMATIONS =================
//     let excludeIds =
//       latestAI.map((item: any) => item._id);

//     const aggregate: any = [

//       {
//         $match: {
//           ...commonQuery,

//           _id: {
//             $nin: excludeIds,
//           },
//         },
//       },

//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },

//       {
//         $lookup: {
//           from: "likeaffirmations",

//           let: {
//             affirmationId: "$_id",
//           },

//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     {
//                       $eq: [
//                         "$affirmation_id",
//                         "$$affirmationId",
//                       ],
//                     },
//                     {
//                       $eq: [
//                         "$user_id",
//                         convertToObjectId(user_id),
//                       ],
//                     },
//                     {
//                       $eq: [
//                         "$status",
//                         USER_STATUS.ACTIVE,
//                       ],
//                     },
//                   ],
//                 },
//               },
//             },
//           ],

//           as: "likedData",
//         },
//       },

//       {
//         $project: {

//           _id: 1,

//           affirmation: {
//             $ifNull: [
//               `$affirmation.${language}`,
//               "$affirmation.en",
//             ],
//           },

//           type: 1,

//           createdAt: 1,

//           is_liked: {
//             $cond: [
//               {
//                 $gt: [
//                   {
//                     $size: "$likedData",
//                   },
//                   0,
//                 ],
//               },
//               true,
//               false,
//             ],
//           },
//         },
//       },
//     ];

//     // ================= PAGINATION =================
//     const {
//       totalCount,
//       aggregation,
//     } = await commonHelper.getCountAndPagination(
//       userAffirmationModel,
//       aggregate,
//       page,
//       limit,
//     );

//     let remainingResult =
//       await userAffirmationModel.aggregate(
//         aggregation
//       );

//     // ================= FINAL RESULT =================
//     let result = [
//       ...latestAI,
//       ...remainingResult,
//     ];

//     // ================= RESET IF ALL USED =================
//     if (!remainingResult.length) {

//       // remove user from all affirmations
//       await userAffirmationModel.updateMany(
//         {
//           user_id: {
//             $in: [
//               convertToObjectId(user_id),
//             ],
//           },
//         },
//         {
//           $pull: {
//             user_id:
//               convertToObjectId(user_id),
//           },
//         }
//       );

//       // ================= REFETCH AI =================
//       latestAI =
//         await userAffirmationModel.aggregate([

//           {
//             $match: {
//               status: USER_STATUS.ACTIVE,
//               type: "AI",
//             },
//           },

//           {
//             $sort: {
//               createdAt: -1,
//             },
//           },

//           {
//             $limit: 1,
//           },

//           {
//             $project: {

//               _id: 1,

//               affirmation: {
//                 $ifNull: [
//                   `$affirmation.${language}`,
//                   "$affirmation.en",
//                 ],
//               },

//               type: 1,

//               createdAt: 1,

//               is_liked: false,
//             },
//           },
//         ]);

//       excludeIds =
//         latestAI.map((item: any) => item._id);

//       // ================= REFETCH REMAINING =================
//       remainingResult =
//         await userAffirmationModel.aggregate([

//           {
//             $match: {
//               status: USER_STATUS.ACTIVE,

//               _id: {
//                 $nin: excludeIds,
//               },
//             },
//           },

//           {
//             $sort: {
//               createdAt: -1,
//             },
//           },

//           {
//             $limit: Number(limit),
//           },

//           {
//             $project: {

//               _id: 1,

//               affirmation: {
//                 $ifNull: [
//                   `$affirmation.${language}`,
//                   "$affirmation.en",
//                 ],
//               },

//               type: 1,

//               createdAt: 1,

//               is_liked: {
//                 $literal: false,
//               },
//             },
//           },
//         ]);

//       result = [
//         ...latestAI,
//         ...remainingResult,
//       ];
//     }

//     return showResponse(
//       true,
//       responseMessage.common
//         .data_retreive_sucess,
//       {
//         result,
//         totalCount,
//       },
//       statusCodes.SUCCESS,
//     );

//   } catch (error) {

//     console.log(
//       error,
//       "GET_AFFIRMATION_LISTING_ERROR"
//     );

//     return showResponse(
//       false,
//       responseMessage.common.server_error,
//       null,
//       statusCodes.API_ERROR,
//     );
//   }
// },
getAffirmationListing: async (
  data: any,
  user_id: string,
): Promise<ApiResponse> => {
  try {
    const {
      page = 1,
      limit = 10,
    } = data;

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
        statusCodes.NOT_FOUND,
      );
    }

    const language =
      userData?.data?.language || "en";

    // =========================
    // LATEST AI (ALWAYS FIRST)
    // =========================

    const latestAI = await userAffirmationModel.aggregate([
      {
        $match: {
          status: USER_STATUS.ACTIVE,
          type: "AI",
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
          from: "likeaffirmations",
          let: {
            affirmationId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$affirmation_id",
                        "$$affirmationId",
                      ],
                    },
                    {
                      $eq: [
                        "$user_id",
                        convertToObjectId(user_id),
                      ],
                    },
                    {
                      $eq: [
                        "$status",
                        USER_STATUS.ACTIVE,
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "likedData",
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          createdAt: 1,

          affirmation: {
            $ifNull: [
              `$affirmation.${language}`,
              "$affirmation.en",
            ],
          },

          affirmationEn: "$affirmation.en",

          is_liked: {
            $gt: [
              {
                $size: "$likedData",
              },
              0,
            ],
          },
        },
      },
    ]);

    const latestAIId =
      latestAI?.[0]?._id || null;

    // =========================
    // GET UNSEEN AFFIRMATIONS
    // =========================

    const getUnseenAffirmations =
      async () => {
        return userAffirmationModel.aggregate([
          {
            $match: {
              status: USER_STATUS.ACTIVE,

              user_id: {
                $nin: [
                  convertToObjectId(user_id),
                ],
              },

              ...(latestAIId && {
                _id: {
                  $ne: latestAIId,
                },
              }),
            },
          },

          {
            $lookup: {
              from: "likeaffirmations",

              let: {
                affirmationId: "$_id",
              },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            "$affirmation_id",
                            "$$affirmationId",
                          ],
                        },
                        {
                          $eq: [
                            "$user_id",
                            convertToObjectId(
                              user_id
                            ),
                          ],
                        },
                        {
                          $eq: [
                            "$status",
                            USER_STATUS.ACTIVE,
                          ],
                        },
                      ],
                    },
                  },
                },
              ],

              as: "likedData",
            },
          },

          {
            $project: {
              _id: 1,
              type: 1,
              createdAt: 1,

              affirmation: {
                $ifNull: [
                  `$affirmation.${language}`,
                  "$affirmation.en",
                ],
              },

              affirmationEn:
                "$affirmation.en",

              is_liked: {
                $gt: [
                  {
                    $size: "$likedData",
                  },
                  0,
                ],
              },
            },
          },

          {
            $sort: {
              createdAt: -1,
            },
          },
        ]);
      };

    let affirmations =
      await getUnseenAffirmations();

    // =========================
    // RESET WHEN ALL SEEN
    // =========================

    if (!affirmations.length) {
      await userAffirmationModel.updateMany(
        {},
        {
          $pull: {
            user_id:
              convertToObjectId(user_id),
          },
        }
      );

      affirmations =
        await getUnseenAffirmations();
    }

    // =========================
    // SPLIT NORMAL & I
    // =========================

    const iAffirmations =
      affirmations.filter(
        (item: any) =>
          item?.affirmationEn &&
          /^i\b/i.test(
            item.affirmationEn.trim()
          )
      );

    const normalAffirmations =
      affirmations.filter(
        (item: any) =>
          !(
            item?.affirmationEn &&
            /^i\b/i.test(
              item.affirmationEn.trim()
            )
          )
      );

    // =========================
    // BUILD FEED
    // 5 NORMAL -> 1 I
    // =========================

    const feed: any[] = [];

    let normalIndex = 0;
    let iIndex = 0;

    while (
      normalIndex <
        normalAffirmations.length ||
      iIndex < iAffirmations.length
    ) {
      for (
        let i = 0;
        i < 5 &&
        normalIndex <
          normalAffirmations.length;
        i++
      ) {
        feed.push(
          normalAffirmations[
            normalIndex++
          ]
        );
      }

      if (
        iIndex < iAffirmations.length
      ) {
        feed.push(
          iAffirmations[iIndex++]
        );
      }

      if (
        normalIndex >=
          normalAffirmations.length &&
        iIndex >=
          iAffirmations.length
      ) {
        break;
      }
    }

    // =========================
    // PAGINATION
    // AI OCCUPIES FIRST SLOT
    // =========================

    const actualLimit = Math.max(
      Number(limit) - 1,
      1
    );

    const start =
      (Number(page) - 1) *
      actualLimit;

    const paginatedFeed =
      feed.slice(
        start,
        start + actualLimit
      );

    const result = [
      ...(latestAI.length
        ? [latestAI[0]]
        : []),
      ...paginatedFeed,
    ];

    // =========================
    // MARK ONLY NON-AI ITEMS
    // AS SEEN
    // =========================

    if (paginatedFeed.length) {
      await userAffirmationModel.updateMany(
        {
          _id: {
            $in: paginatedFeed.map(
              (item: any) => item._id
            ),
          },
        },
        {
          $addToSet: {
            user_id:
              convertToObjectId(user_id),
          },
        }
      );
    }

    return showResponse(
      true,
      responseMessage.common
        .data_retreive_sucess,
      {
        result,
        totalCount:
          feed.length +
          (latestAI.length ? 1 : 0),
      },
      statusCodes.SUCCESS,
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
      statusCodes.API_ERROR,
    );
  }
},

  likeUnlikeAffirmation: async (
    data: any,
    user_id: string,
  ): Promise<ApiResponse> => {
    const { affirmation_id } = data;

    // check affirmation exists
    const affirmation = await findOne(userAffirmationModel, {
      _id: convertToObjectId(affirmation_id),
      status: { $ne: 3 },
    });

    if (!affirmation?.status) {
      return showResponse(
        false,
        responseMessage.common.data_not_found,
        null,
        statusCodes.NOT_FOUND,
      );
    }

    // check existing like
    const existingLike = await findOne(userAffirmationLikeModel, {
      user_id: convertToObjectId(user_id),
      affirmation_id: convertToObjectId(affirmation_id),
    });

    if (!existingLike?.status) {
      const likeObj = new userAffirmationLikeModel({
        user_id: convertToObjectId(user_id),
        affirmation_id: convertToObjectId(affirmation_id),
        status: 1,
      });

      const createLike = await createOne(likeObj);

      return showResponse(
        true,
        "Affirmation liked successfully",
        createLike?.data,
        statusCodes.SUCCESS,
      );
    }
    // toggle status
    const updatedLike = await findOneAndUpdate(
      userAffirmationLikeModel,
      {
        user_id: convertToObjectId(user_id),
        affirmation_id: convertToObjectId(affirmation_id),
      },
      {
        status: existingLike.data.status === 1 ? 0 : 1,
      },
    );

    return showResponse(
      true,
      existingLike.data.status === 1
        ? "Affirmation unliked successfully"
        : "Affirmation liked successfully",
      updatedLike?.data,
      statusCodes.SUCCESS,
    );
  },


  likedAffirmationList: async (data: any, user_id: string): Promise<ApiResponse> => {
    const {
      sort_column = "createdAt",
      sort_direction = "desc",
      page = 1,
      limit = 10,
      search_key = ""
    } = data;
    // ================= USER =================
    const userData = await findOne(userAuthModel, {
      _id: convertToObjectId(user_id),
      status: USER_STATUS.ACTIVE,
    });

    if (!userData) {
      return showResponse(
        false,
        responseMessage.common.not_exist,
        null,
        statusCodes.NOT_FOUND,
      );
    }

    // user language
    const language = userData?.data?.language || "en";

    const aggregate = [
      // user liked affirmations
      {
        $match: {
          user_id: convertToObjectId(user_id),
          status: 1,
        },
      },

      {
        $sort: {
          [sort_column]: sort_direction === "asc" ? 1 : -1,
        },
      },

      //   join affirmation data
      {
        $lookup: {
          from: "affirmations",
          localField: "affirmation_id",
          foreignField: "_id",
          as: "affirmationData",
        },
      },

      {
        $unwind: "$affirmationData",
      },

      //   exclude deleted affirmation
      {
        $match: {
          "affirmationData.status": { $eq: 1 },
              ...(search_key && {
      [`affirmationData.affirmation.${language}`]: {
        $regex: search_key,
        $options: "i",
      },
    }),
        },
      },

      {
        $project: {
          _id: "$affirmationData._id",
          affirmation: `$affirmationData.affirmation.${language}`,
          type: "$affirmationData.type",
          createdAt: "$affirmationData.createdAt",
          updatedAt: "$affirmationData.updatedAt",
          is_liked: { $literal: true },
        },
      },

      {
        $sort: {
          createdAt: -1
        }
      }
    ];

    const { totalCount, aggregation } =
      await commonHelper.getCountAndPagination(
        userAffirmationLikeModel,
        aggregate,
        page,
        limit,
      );

    const result = await userAffirmationLikeModel.aggregate(aggregation);

    return showResponse(
      true,
      responseMessage.common.data_retreive_sucess,
      {
        result,
        totalCount,
      },
      statusCodes.SUCCESS,
    );
  },

  createLink: async (data: any): Promise<ApiResponse> => {
        try {
            const { affirmation_id } = data;
            // Generate random 8-char code
            const code = commonHelper.generateRandomAlphanumeric(8);

            // Insert document with code and params
            const response: any = await userDeeplinkModel.insertMany({
                code,
                ...(affirmation_id && { affirmation_id }),
                createdAt: new Date(),
            });

            if (response) {
                console.log("response",response)
                return showResponse(
                    true,
                    responseMessage.common.data,
                    {
                        link:
                            `https://apidev.heal-app.com/link/${code}/${affirmation_id}`,
                        code,
                    },
                    statusCodes.SUCCESS
                );
            }


            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR);
        } catch (err) {
          console.log(err,"err")
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR);
        }
    },//ends-----------------------------------------------------------------------------------------------

};

export default affirmationHandler;
