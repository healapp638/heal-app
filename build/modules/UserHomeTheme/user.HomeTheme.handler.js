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
const db_helpers_1 = require("../../helpers/db.helpers");
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const common_helper_1 = require("../../helpers/common.helper");
const commonHelper = __importStar(require("../../helpers/common.helper"));
const admin_hometheme_model_1 = __importDefault(require("../AdminHometheme/admin.hometheme.model"));
const user_recentHomeTheme_model_1 = __importDefault(require("./user.recentHomeTheme.model"));
const admin_homethemeCategory_model_1 = __importDefault(require("../AdminHometheme/admin.homethemeCategory.model"));
const homeThemeHandler = {
    addUserTheme: (user_id, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { homeTheme_id } = data;
            // ================= CHECK USER =================
            const userData = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, {
                _id: (0, common_helper_1.convertToObjectId)(user_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            if (!(userData === null || userData === void 0 ? void 0 : userData.status)) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.NOT_FOUND);
            }
            // ================= CHECK THEME =================
            const themeData = yield (0, db_helpers_1.findOne)(admin_hometheme_model_1.default, {
                _id: (0, common_helper_1.convertToObjectId)(homeTheme_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            if (!(themeData === null || themeData === void 0 ? void 0 : themeData.status)) {
                return (0, response_util_1.showResponse)(false, "Theme not found", null, statusCodes_1.default.NOT_FOUND);
            }
            // ================= CREATE =================
            const createTheme = new user_recentHomeTheme_model_1.default({
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                homeTheme_id: (0, common_helper_1.convertToObjectId)(homeTheme_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            const savedTheme = yield (0, db_helpers_1.createOne)(createTheme);
            return (0, response_util_1.showResponse)(true, "Theme added successfully", savedTheme === null || savedTheme === void 0 ? void 0 : savedTheme.data, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            // console.log(
            //     error,
            //     "ADD_USER_THEME_ERROR"
            // );
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, error === null || error === void 0 ? void 0 : error.message, statusCodes_1.default.API_ERROR);
        }
    }),
    getHomeThemeCategory: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userdata = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, {
            _id: (0, common_helper_1.convertToObjectId)(user_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        });
        if (!userdata) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.NOT_FOUND);
        }
        // user selected language
        const language = ((_a = userdata === null || userdata === void 0 ? void 0 : userdata.data) === null || _a === void 0 ? void 0 : _a.language) || "en";
        // latest AI affirmation
        const themeCategory = yield admin_homethemeCategory_model_1.default
            .find({
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        })
            .sort({ createdAt: -1 });
        if (!themeCategory) {
            return (0, response_util_1.showResponse)(false, "No Category Found", null, statusCodes_1.default.NOT_FOUND);
        }
        // console.log(themeCategory,"themeCategory")
        // return only user's language
        // const responseData = {
        //   _id: themeCategory[0]._id,
        //   title:
        //     themeCategory[0]?.title?.[language] ||
        //     themeCategory?.title?.en,
        //   imgUrl: themeCategory[0].imgUrl,
        //   createdAt: themeCategory[0].createdAt,
        // };
        const responseData = themeCategory.map((item) => {
            var _a, _b;
            return ({
                _id: item._id,
                title: ((_a = item === null || item === void 0 ? void 0 : item.title) === null || _a === void 0 ? void 0 : _a[language]) ||
                    ((_b = item === null || item === void 0 ? void 0 : item.title) === null || _b === void 0 ? void 0 : _b.en),
                imgUrl: item.imgUrl,
                createdAt: item.createdAt,
            });
        });
        // console.log(responseData,"responseData")
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, responseData, statusCodes_1.default.SUCCESS);
    }),
    getHomeThemeListing: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { filter = "all", // all | new | most_popular | recent
            categoryTheme_id = "", page = 1, limit = 10, } = data;
            // ==================================================
            // LATEST SELECTED THEME
            // ==================================================
            const latestRecentTheme = yield user_recentHomeTheme_model_1.default
                .findOne({
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            })
                .sort({ createdAt: -1 })
                .lean();
            const selectedThemeId = (latestRecentTheme === null || latestRecentTheme === void 0 ? void 0 : latestRecentTheme.homeTheme_id) || null;
            // ================= MATCH =================
            const matchQuery = {
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            };
            // category filter
            if (categoryTheme_id) {
                matchQuery.categoryTheme_id =
                    (0, common_helper_1.convertToObjectId)(categoryTheme_id);
            }
            let aggregate = [];
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
                            status: workflow_constant_1.USER_STATUS.ACTIVE,
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
                        $match: Object.assign(Object.assign({}, matchQuery), { "recentThemeData.user_id": (0, common_helper_1.convertToObjectId)(user_id) }),
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
                return (0, response_util_1.showResponse)(false, "Invalid filter", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            // ==================================================
            // COMMON PROJECT
            // ==================================================
            aggregate.push({
                $project: {
                    _id: 1,
                    imgUrl: 1,
                    categoryTheme_id: 1,
                    homeImgUrl: 1,
                    createdAt: 1,
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
            const { totalCount, aggregation } = yield commonHelper.getCountAndPagination(admin_hometheme_model_1.default, aggregate, page, limit);
            const result = yield admin_hometheme_model_1.default.aggregate(aggregation);
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common
                .data_retreive_sucess, {
                result,
                totalCount,
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            // console.log(
            //     error,
            //     "GET_HOME_THEME_LISTING_ERROR"
            // );
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, error === null || error === void 0 ? void 0 : error.message, statusCodes_1.default.API_ERROR);
        }
    }),
    getMyTheme: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ================= RECENT THEME =================
            const aggregate = [
                {
                    $match: {
                        user_id: (0, common_helper_1.convertToObjectId)(user_id),
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
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
                        homeImgUrl: "$themeData.homeImgUrl",
                        categoryTheme_id: "$themeData.categoryTheme_id",
                        createdAt: "$themeData.createdAt",
                        updatedAt: "$themeData.updatedAt",
                    },
                },
            ];
            const result = yield user_recentHomeTheme_model_1.default.aggregate(aggregate);
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common
                .data_retreive_sucess, (result === null || result === void 0 ? void 0 : result[0]) || null, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            // console.log(
            //     error,
            //     "GET_MY_THEME_ERROR"
            // );
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, error === null || error === void 0 ? void 0 : error.message, statusCodes_1.default.API_ERROR);
        }
    })
};
exports.default = homeThemeHandler;
