"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const workflow_constant_1 = require("../../constants/workflow.constant");
// import { translateText } from "../../helpers/langauge.translate.helper";
const user_affirmation_model_1 = __importDefault(require("./user.affirmation.model"));
// import OpenAI from "openai";
// import { APP } from "../../constants/app.constant";
const db_helpers_1 = require("../../helpers/db.helpers");
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const common_helper_1 = require("../../helpers/common.helper");
const commonHelper = __importStar(require("../../helpers/common.helper"));
const user_affirmationLike_model_1 = __importDefault(require("./user.affirmationLike.model"));
const user_deeplink_model_1 = __importDefault(require("./user.deeplink.model"));
const affirmationHandler = {
    getAIAffirmation: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const userdata = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, {
            _id: (0, common_helper_1.convertToObjectId)(user_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        });
        if (!userdata) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.NOT_FOUND);
        }
        // console.log(userdata,"userdata")
        // user selected language
        const language = ((_a = userdata === null || userdata === void 0 ? void 0 : userdata.data) === null || _a === void 0 ? void 0 : _a.language) || "en";
        // console.log(language,"language")
        // latest AI affirmation
        const aiAffirmation = yield user_affirmation_model_1.default
            .findOne({
            type: "AI",
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        })
            .sort({ createdAt: -1 });
        if (!aiAffirmation) {
            return (0, response_util_1.showResponse)(false, "No AI affirmation found", null, statusCodes_1.default.NOT_FOUND);
        }
        console.log(aiAffirmation, "aiAffirmation");
        // return only user's language
        const responseData = {
            _id: aiAffirmation._id,
            affirmation: ((_b = aiAffirmation === null || aiAffirmation === void 0 ? void 0 : aiAffirmation.affirmation) === null || _b === void 0 ? void 0 : _b[language]) ||
                ((_c = aiAffirmation === null || aiAffirmation === void 0 ? void 0 : aiAffirmation.affirmation) === null || _c === void 0 ? void 0 : _c.en),
            type: aiAffirmation.type,
            createdAt: aiAffirmation.createdAt,
        };
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, responseData, statusCodes_1.default.SUCCESS);
    }),
    addView: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        const { affirmation_id } = data;
        const updateAffirmation = yield user_affirmation_model_1.default.findOneAndUpdate({
            _id: (0, common_helper_1.convertToObjectId)(affirmation_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        }, {
            // add user_id only if not already exists
            $addToSet: {
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
            },
        }, {
            new: true,
        });
        if (!updateAffirmation) {
            return (0, response_util_1.showResponse)(false, "Affirmation not found", null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, "User added successfully", updateAffirmation, statusCodes_1.default.SUCCESS);
    }),
    // getAffirmationListing: async (
    //   data: any,
    //   user_id: any,
    // ): Promise<ApiResponse> => {
    //   try {
    //     const {
    //       sort_column = "createdAt",
    //       sort_direction = "desc",
    //       page = 1,
    //       limit = 10,
    //     } = data;
    //     // ================= USER =================
    //     const userData = await findOne(userAuthModel, {
    //       _id: convertToObjectId(user_id),
    //       status: USER_STATUS.ACTIVE,
    //     });
    //     if (!userData) {
    //       return showResponse(
    //         false,
    //         responseMessage.common.not_exist,
    //         null,
    //         statusCodes.NOT_FOUND,
    //       );
    //     }
    //     // user language
    //     const language = userData?.data?.language || "en";
    //     // ================= QUERY =================
    //     const queryObject: any = {
    //       status: USER_STATUS.ACTIVE,
    //       // hide already viewed affirmations
    //       user_id: {
    //         $nin: [convertToObjectId(user_id)],
    //       },
    //     };
    //     // ================= AGGREGATE =================
    //     const aggregate: any = [
    //       {
    //         $match: queryObject,
    //       },
    //       {
    //         $sort: {
    //           [sort_column]: sort_direction === "asc" ? 1 : -1,
    //         },
    //       },
    //       {
    //         $lookup: {
    //           from: "likeaffirmations",
    //           let: {
    //             affirmationId: "$_id"
    //           },
    //           pipeline: [
    //             {
    //               $match: {
    //                 $expr: {
    //                   $and: [
    //                     {
    //                       $eq: [
    //                         "$affirmation_id",
    //                         "$$affirmationId"
    //                       ]
    //                     },
    //                     {
    //                       $eq: [
    //                         "$user_id",
    //                         convertToObjectId(user_id)
    //                       ]
    //                     },
    //                     {
    //                       $eq: ["$status", 1]
    //                     }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: "likedData"
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           affirmation: {
    //             $ifNull: [`$affirmation.${language}`, "$affirmation.en"],
    //           },
    //           type: 1,
    //           createdAt: 1,
    //           is_liked: {
    //             $cond: [
    //               {
    //                 $gt: [
    //                   { $size: "$likedData" },
    //                   0
    //                 ]
    //               },
    //               true,
    //               false
    //             ]
    //           }
    //         },
    //       },
    //     ];
    //     // ================= PAGINATION =================
    //     let { totalCount, aggregation } =
    //       await commonHelper.getCountAndPagination(
    //         userAffirmationModel,
    //         aggregate,
    //         page,
    //         limit,
    //       );
    //     let result = await userAffirmationModel.aggregate(aggregation);
    //     // ================= RESET IF ALL USED =================
    //     if (!result.length) {
    //       // remove user from all affirmations
    //       await userAffirmationModel.updateMany(
    //         {
    //           user_id: {
    //             $in: [convertToObjectId(user_id)],
    //           },
    //         },
    //         {
    //           $pull: {
    //             user_id: convertToObjectId(user_id),
    //           },
    //         },
    //       );
    //       // rerun aggregation
    //       ({ totalCount, aggregation } = await commonHelper.getCountAndPagination(
    //         userAffirmationModel,
    //         aggregate,
    //         page,
    //         limit,
    //       ));
    //       result = await userAffirmationModel.aggregate(aggregation);
    //     }
    //     return showResponse(
    //       true,
    //       responseMessage.common.data_retreive_sucess,
    //       {
    //         result,
    //         totalCount,
    //       },
    //       statusCodes.SUCCESS,
    //     );
    //   } catch (error) {
    //     console.log(error, "GET_AFFIRMATION_LISTING_ERROR");
    //     return showResponse(
    //       false,
    //       responseMessage.common.server_error,
    //       null,
    //       statusCodes.API_ERROR,
    //     );
    //   }
    // },
    getAffirmationListing: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { page = 1, limit = 10, } = data;
            // ================= USER =================
            const userData = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, {
                _id: (0, common_helper_1.convertToObjectId)(user_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            if (!userData) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.NOT_FOUND);
            }
            // ================= LANGUAGE =================
            const language = ((_a = userData === null || userData === void 0 ? void 0 : userData.data) === null || _a === void 0 ? void 0 : _a.language) || "en";
            // ================= COMMON QUERY =================
            const commonQuery = {
                status: workflow_constant_1.USER_STATUS.ACTIVE,
                // hide already viewed affirmations
                user_id: {
                    $nin: [(0, common_helper_1.convertToObjectId)(user_id)],
                },
            };
            // ================= LATEST AI AFFIRMATION =================
            let latestAI = yield user_affirmation_model_1.default.aggregate([
                {
                    $match: {
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
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
                                                    (0, common_helper_1.convertToObjectId)(user_id),
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$status",
                                                    workflow_constant_1.USER_STATUS.ACTIVE,
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
                        affirmation: {
                            $ifNull: [
                                `$affirmation.${language}`,
                                "$affirmation.en",
                            ],
                        },
                        type: 1,
                        createdAt: 1,
                        is_liked: {
                            $cond: [
                                {
                                    $gt: [
                                        {
                                            $size: "$likedData",
                                        },
                                        0,
                                    ],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
            ]);
            // ================= REMAINING AFFIRMATIONS =================
            let excludeIds = latestAI.map((item) => item._id);
            const aggregate = [
                {
                    $match: Object.assign(Object.assign({}, commonQuery), { _id: {
                            $nin: excludeIds,
                        } }),
                },
                {
                    $sort: {
                        createdAt: -1,
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
                                                    (0, common_helper_1.convertToObjectId)(user_id),
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$status",
                                                    workflow_constant_1.USER_STATUS.ACTIVE,
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
                        affirmation: {
                            $ifNull: [
                                `$affirmation.${language}`,
                                "$affirmation.en",
                            ],
                        },
                        type: 1,
                        createdAt: 1,
                        is_liked: {
                            $cond: [
                                {
                                    $gt: [
                                        {
                                            $size: "$likedData",
                                        },
                                        0,
                                    ],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
            ];
            // ================= PAGINATION =================
            const { totalCount, aggregation, } = yield commonHelper.getCountAndPagination(user_affirmation_model_1.default, aggregate, page, limit);
            let remainingResult = yield user_affirmation_model_1.default.aggregate(aggregation);
            // ================= FINAL RESULT =================
            let result = [
                ...latestAI,
                ...remainingResult,
            ];
            // ================= RESET IF ALL USED =================
            if (!remainingResult.length) {
                // remove user from all affirmations
                yield user_affirmation_model_1.default.updateMany({
                    user_id: {
                        $in: [
                            (0, common_helper_1.convertToObjectId)(user_id),
                        ],
                    },
                }, {
                    $pull: {
                        user_id: (0, common_helper_1.convertToObjectId)(user_id),
                    },
                });
                // ================= REFETCH AI =================
                latestAI =
                    yield user_affirmation_model_1.default.aggregate([
                        {
                            $match: {
                                status: workflow_constant_1.USER_STATUS.ACTIVE,
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
                                is_liked: false,
                            },
                        },
                    ]);
                excludeIds =
                    latestAI.map((item) => item._id);
                // ================= REFETCH REMAINING =================
                remainingResult =
                    yield user_affirmation_model_1.default.aggregate([
                        {
                            $match: {
                                status: workflow_constant_1.USER_STATUS.ACTIVE,
                                _id: {
                                    $nin: excludeIds,
                                },
                            },
                        },
                        {
                            $sort: {
                                createdAt: -1,
                            },
                        },
                        {
                            $limit: Number(limit),
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
                                is_liked: {
                                    $literal: false,
                                },
                            },
                        },
                    ]);
                result = [
                    ...latestAI,
                    ...remainingResult,
                ];
            }
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common
                .data_retreive_sucess, {
                result,
                totalCount,
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "GET_AFFIRMATION_LISTING_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    likeUnlikeAffirmation: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        const { affirmation_id } = data;
        // check affirmation exists
        const affirmation = yield (0, db_helpers_1.findOne)(user_affirmation_model_1.default, {
            _id: (0, common_helper_1.convertToObjectId)(affirmation_id),
            status: { $ne: 3 },
        });
        if (!(affirmation === null || affirmation === void 0 ? void 0 : affirmation.status)) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.NOT_FOUND);
        }
        // check existing like
        const existingLike = yield (0, db_helpers_1.findOne)(user_affirmationLike_model_1.default, {
            user_id: (0, common_helper_1.convertToObjectId)(user_id),
            affirmation_id: (0, common_helper_1.convertToObjectId)(affirmation_id),
        });
        if (!(existingLike === null || existingLike === void 0 ? void 0 : existingLike.status)) {
            const likeObj = new user_affirmationLike_model_1.default({
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                affirmation_id: (0, common_helper_1.convertToObjectId)(affirmation_id),
                status: 1,
            });
            const createLike = yield (0, db_helpers_1.createOne)(likeObj);
            return (0, response_util_1.showResponse)(true, "Affirmation liked successfully", createLike === null || createLike === void 0 ? void 0 : createLike.data, statusCodes_1.default.SUCCESS);
        }
        // toggle status
        const updatedLike = yield (0, db_helpers_1.findOneAndUpdate)(user_affirmationLike_model_1.default, {
            user_id: (0, common_helper_1.convertToObjectId)(user_id),
            affirmation_id: (0, common_helper_1.convertToObjectId)(affirmation_id),
        }, {
            status: existingLike.data.status === 1 ? 0 : 1,
        });
        return (0, response_util_1.showResponse)(true, existingLike.data.status === 1
            ? "Affirmation unliked successfully"
            : "Affirmation liked successfully", updatedLike === null || updatedLike === void 0 ? void 0 : updatedLike.data, statusCodes_1.default.SUCCESS);
    }),
    likedAffirmationList: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { sort_column = "createdAt", sort_direction = "desc", page = 1, limit = 10, search_key = "" } = data;
        // ================= USER =================
        const userData = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, {
            _id: (0, common_helper_1.convertToObjectId)(user_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        });
        console.log(sort_column, sort_direction, user_id);
        if (!userData) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.NOT_FOUND);
        }
        // user language
        const language = ((_a = userData === null || userData === void 0 ? void 0 : userData.data) === null || _a === void 0 ? void 0 : _a.language) || "en";
        console.log(language, "language");
        const aggregate = [
            // user liked affirmations
            {
                $match: {
                    user_id: (0, common_helper_1.convertToObjectId)(user_id),
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
                $match: Object.assign({ "affirmationData.status": { $eq: 1 } }, (search_key && {
                    [`affirmationData.affirmation.${language}`]: {
                        $regex: search_key,
                        $options: "i",
                    },
                })),
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
        const { totalCount, aggregation } = yield commonHelper.getCountAndPagination(user_affirmationLike_model_1.default, aggregate, page, limit);
        const result = yield user_affirmationLike_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, {
            result,
            totalCount,
        }, statusCodes_1.default.SUCCESS);
    }),
    createLink: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { affirmation_id } = data;
            console.log(affirmation_id, "affirmation_id");
            // Generate random 8-char code
            const code = commonHelper.generateRandomAlphanumeric(8);
            // Insert document with code and params
            const response = yield user_deeplink_model_1.default.insertMany(Object.assign(Object.assign({ code }, (affirmation_id && { affirmation_id })), { createdAt: new Date() }));
            if (response) {
                console.log("response", response);
                return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data, {
                    link: `https://apidev.heal-app.com/link/${code}/${affirmation_id}`,
                    code,
                }, statusCodes_1.default.SUCCESS);
            }
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
        }
        catch (err) {
            console.log(err, "err");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
        }
    }), //ends-----------------------------------------------------------------------------------------------
};
exports.default = affirmationHandler;
