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
const moment_1 = __importDefault(require("moment"));
const response_util_1 = require("../../utils/response.util");
const db_helpers_1 = require("../../helpers/db.helpers");
const commonHelper = __importStar(require("../../helpers/common.helper"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const user_auth_model_1 = __importDefault(require("../../modules/UserAuth/user.auth.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const services_1 = __importDefault(require("../../services"));
const user_journel_model_1 = __importDefault(require("../UserJournel/user.journel.model"));
const user_modules_complete_phase_model_1 = __importDefault(require("../UserModules/user.modules.complete.phase.model"));
const user_weekly_challenges_model_1 = __importDefault(require("../UserChallenges/user.weekly.challenges.model"));
const user_daily_challenges_model_1 = __importDefault(require("../UserChallenges/user.daily.challenges.model"));
const user_auth_model_2 = __importDefault(require("../../modules/UserAuth/user.auth.model"));
const user_themeEngagement_model_1 = __importDefault(require("../UserModules/user.themeEngagement.model"));
const notification_service_1 = require("../../services/notification.service");
const axios_1 = __importDefault(require("axios"));
// import { getCache, setCache } from "../../processQueue/redis.cache";
const AdminUserHandler = {
    getUsersList: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { sort_column = 'createdAt', sort_direction = 'desc', page, limit, search_key = '', status } = data;
        // const queryObject: any = {
        //     status: { $ne: USER_STATUS.DELETED },
        //     $or: [
        //         { email: { $regex: search_key, $options: 'i' } },
        //         { fullName: { $regex: search_key, $options: 'i' } },
        //     ],
        //     isVerified: true
        // }
        // if used social login n project 
        const queryObject = {
            status: { $ne: workflow_constant_1.USER_STATUS.DELETED },
            $and: [
                {
                    $or: [
                        { email: { $regex: search_key, $options: 'i' } },
                        { name: { $regex: search_key, $options: 'i' } }
                    ]
                },
                {
                    $or: [
                        { account_source: { $ne: "email" } }, // Allow all non-email accounts
                        { $and: [{ account_source: "email" }, { is_verified: true }] } // Email accounts must be verified
                    ]
                }
            ]
        };
        if (status) {
            queryObject.status = status;
        }
        const aggregate = [
            {
                $match: Object.assign({}, queryObject)
            },
            {
                $sort: {
                    [sort_column]: sort_direction == 'asc' ? 1 : -1
                }
            },
            {
                $addFields: {
                    full_name: { $concat: ["$first_name", " ", "$last_name"] }
                }
            },
            {
                $project: {
                    password: 0,
                    device_info: 0,
                    social_account: 0
                }
            }
        ];
        //add this function where we cannot add query to get count of document example searchKey and add pagination at the end of query
        const { totalCount, aggregation } = yield commonHelper.getCountAndPagination(user_auth_model_1.default, aggregate, page, limit);
        const result = yield user_auth_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    getUserDetails: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const getResponse = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: user_id, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } }, { password: 0 });
        const userData = getResponse === null || getResponse === void 0 ? void 0 : getResponse.data;
        if (!getResponse.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_user, null, statusCodes_1.default.API_ERROR);
        }
        //calculate progress start
        const CompletedPhases = yield user_modules_complete_phase_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(user_id),
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "phases",
                    localField: "phase_id",
                    foreignField: "_id",
                    as: "phase"
                }
            },
            {
                $unwind: "$phase"
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: "$phase.points" }
                }
            }
        ]);
        const completedWeeklyChallenges = yield user_weekly_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(user_id),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        const completedDailyChallenges = yield user_daily_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(user_id),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: null,
                    total_points: { $sum: '$points' }
                }
            }
        ]);
        const startOfDay = (0, moment_1.default)().tz((userData === null || userData === void 0 ? void 0 : userData.timeZone) || 'America/New_York').startOf('day').toDate();
        const endOfDay = (0, moment_1.default)().tz((userData === null || userData === void 0 ? void 0 : userData.timeZone) || 'America/New_York').endOf('day').toDate();
        const totalJournels = yield user_journel_model_1.default.countDocuments({
            user_id: commonHelper.convertToObjectId(user_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalJournelEarnedPoints = totalJournels > 0
            ? ((totalJournels - 1) * 10) + 25
            : 0;
        const total_earned_points = (((_a = CompletedPhases[0]) === null || _a === void 0 ? void 0 : _a.total_points) || 0) + (((_b = completedWeeklyChallenges[0]) === null || _b === void 0 ? void 0 : _b.total_points) || 0) + (((_c = completedDailyChallenges[0]) === null || _c === void 0 ? void 0 : _c.total_points) || 0) + totalJournelEarnedPoints || 0 + (userData === null || userData === void 0 ? void 0 : userData.streak_credit) || 0;
        const pointThresholds = [
            99, 235, 460, 740, 1070, 1450, 1875, 2345,
            2860, 3415, 4015, 4650, 5325, 6040, 6795,
            7590, 8420, 9290, 10195, 11140, 12120,
            13135, 14185, 15270, 16390, 17545,
            18730, 19955, 21215, 22505
        ];
        const total_points = (_d = pointThresholds.find((curelem) => total_earned_points < curelem)) !== null && _d !== void 0 ? _d : 22505;
        const completedPercentage = total_points > 0
            ? (Math.round((total_earned_points / total_points) * 100))
            : 0;
        // Calculate level
        const totalLevels = 30;
        let currentLevel = total_earned_points < 99 ? 1 : total_earned_points < 235 ? 2 : total_earned_points < 460 ? 3 : total_earned_points < 740 ? 4 : total_earned_points < 1070 ? 5 : total_earned_points < 1450 ? 6 : total_earned_points < 1875 ? 7 : total_earned_points < 2345 ? 8 : total_earned_points < 2860 ? 9 : total_earned_points < 3415 ? 10 : total_earned_points < 4015 ? 11 : total_earned_points < 4650 ? 12 : total_earned_points < 5325 ? 13 : total_earned_points < 6040 ? 14 : total_earned_points < 6795 ? 15 : total_earned_points < 7590 ? 16 : total_earned_points < 8420 ? 17 : total_earned_points < 9290 ? 18 : total_earned_points < 10195 ? 19 : total_earned_points < 11140 ? 20 : total_earned_points < 12120 ? 21 : total_earned_points < 13135 ? 22 : total_earned_points < 14185 ? 23 : total_earned_points < 15270 ? 24 : total_earned_points < 16390 ? 25 : total_earned_points < 17545 ? 26 : total_earned_points < 18730 ? 27 : total_earned_points < 19955 ? 28 : total_earned_points < 21215 ? 29 : total_earned_points < 22505 ? 30 : 31;
        // Edge case fix
        if (currentLevel === 0)
            currentLevel = 1;
        if (currentLevel > totalLevels)
            currentLevel = totalLevels;
        getResponse.data.total_earned_points = total_earned_points;
        getResponse.data.total_points = total_points;
        getResponse.data.currentLevel = currentLevel;
        getResponse.data.completedPercentage = completedPercentage;
        //calculating progress end
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.user_detail, getResponse.data, statusCodes_1.default.SUCCESS);
    }),
    updateUserStatus: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { user_id, status } = data;
        const parsedStatus = Number(status);
        const queryObject = { _id: user_id }; //usertype should be USER  = 3
        // const result = await findOne(userModel, queryObject);
        // if (!result.status) {
        //     return showResponse(false, responseMessage.users.invalid_user, null, statusCodes.API_ERROR);
        // }
        const editObj = { status: parsedStatus, deactivate_by: '' };
        if (parsedStatus === workflow_constant_1.USER_STATUS.DEACTIVATED) {
            editObj.deactivate_by = workflow_constant_1.DEACTIVATE_BY.ADMIN;
            const res = yield (0, notification_service_1.sendTopicNotification)(user_id, 'Your account has been deactivated', 'Your account has been deactivated by Admin', {});
            console.log(res, 'res1');
        } //ends
        if (parsedStatus === workflow_constant_1.USER_STATUS.DELETED) {
            const res = yield (0, notification_service_1.sendTopicNotification)(user_id, 'Your account has been deleted', 'Your account has been deleted by Admin', {});
            console.log(res, 'res2');
        }
        if (parsedStatus === workflow_constant_1.USER_STATUS.ACTIVE) {
            const res = yield (0, notification_service_1.sendTopicNotification)(user_id, 'Your account has been activated', 'Your account has been activated by Admin', {});
            console.log(res, 'res3');
        }
        const response = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, editObj);
        if (!response.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.user_account_update_error, null, statusCodes_1.default.API_ERROR);
        }
        const msg = parsedStatus == 2 ? "Deleted" : parsedStatus == 1 ? "Activated" : "Deactivated";
        return (0, response_util_1.showResponse)(true, `${responseMessages_1.default.users.user_account_has_been} ${msg}`, {}, statusCodes_1.default.SUCCESS);
    }),
    getDashboardData: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (past_day = 'MAX') {
        // Calculate the timestamps for 30 days ago, 180 days ago, and 365 days ago
        const thirtyDaysAgo = (0, moment_1.default)().subtract(30, 'days').toDate(); //last 30 days timestamp
        const sixMonthAgo = (0, moment_1.default)().subtract(180, 'days').toDate(); //last 180 days timestamp
        const oneYearAgo = (0, moment_1.default)().subtract(365, 'days').toDate(); //last 365 days timestamp
        const maxDate = (0, moment_1.default)().toDate(); //today timestamp
        const dates = {
            '1M': { $gte: thirtyDaysAgo }, //greater then last  1 month  date users registeration data
            '6M': { $gte: sixMonthAgo }, //greater then last 6 month  date users registeration data
            '1Y': { $gte: oneYearAgo }, //greater then last year date users registeration data
            'MAX': { $lte: maxDate }, //if max then less then equal to current date users data
        };
        const fetch_data_date = dates[past_day] || dates["1M"];
        const dashboard = yield user_auth_model_1.default.aggregate([
            {
                $match: {
                    createdAt: fetch_data_date
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]);
        const all_users = yield (0, db_helpers_1.getCount)(user_auth_model_1.default, { status: { $ne: workflow_constant_1.USER_STATUS.DELETED } });
        const active_users = yield (0, db_helpers_1.getCount)(user_auth_model_1.default, { status: workflow_constant_1.USER_STATUS.ACTIVE });
        const deactivated_users = yield (0, db_helpers_1.getCount)(user_auth_model_1.default, { status: workflow_constant_1.USER_STATUS.DEACTIVATED });
        const journelPieChart = yield user_journel_model_1.default.aggregate([
            {
                $match: {
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    createdAt: fetch_data_date
                }
            },
            {
                $group: {
                    _id: '$feeling.en',
                    count: { $sum: 1 }
                }
            }, {
                $addFields: {
                    feeling: '$_id',
                    _id: 0
                }
            }
        ]);
        const hearAboutUsPieChart = yield user_auth_model_2.default.aggregate([
            {
                $match: {
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    createdAt: fetch_data_date
                }
            },
            {
                $group: {
                    _id: "$hearAboutUs",
                    count: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    hearAboutUs: "$_id",
                    _id: 0
                }
            }
        ]);
        const userEngagementOnThemeChart = yield user_themeEngagement_model_1.default.aggregate([
            {
                $match: {
                    createdAt: fetch_data_date,
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $group: {
                    _id: "$theme_name",
                    count: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    theme_name: "$_id",
                    _id: 0
                }
            }
        ]);
        const user_summary = {
            all_users: all_users.data,
            active_users: active_users.data,
            deactivated_users: deactivated_users.data,
            journelPieChart,
            hearAboutUsPieChart,
            userEngagementOnThemeChart
        };
        return (0, response_util_1.showResponse)(true, 'Dashboard data is here', { user_summary, dashboard }, statusCodes_1.default.SUCCESS);
    }),
    // --- MULTIPART UPLOAD ROUTES START---
    initiateMultipartUpload: (fileName, fileType) => __awaiter(void 0, void 0, void 0, function* () {
        return yield services_1.default.awsService.initiateMultipartUpload(fileName, fileType);
    }),
    signMultipartPart: (key, uploadId, partNumber) => __awaiter(void 0, void 0, void 0, function* () {
        return yield services_1.default.awsService.getMultipartPresignedUrl(key, uploadId, partNumber);
    }),
    completeMultipartUpload: (key, uploadId, parts) => __awaiter(void 0, void 0, void 0, function* () {
        return yield services_1.default.awsService.completeMultipartUpload(key, uploadId, parts);
    }),
    // Updated Process Handler
    processFileAdmin: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { s3_key, duration } = data;
        // Pass the duration to the service so we don't calculate it on the server
        return yield services_1.default.awsService.processUploadedVideoAdmin(s3_key, duration);
    }),
    // sendMultipleNotifications: async (): Promise<ApiResponse> => {
    //     /*--Fetch the users list according to the needs of your project.--*/
    //     //fetch all active users
    //     const usersResponse = await findAll(userModel, { user_type: ROLE.USER, status: USER_STATUS.ACTIVE}, "first_name last_name email notification_enabled");
    //     if (!usersResponse.status) {
    //         return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)
    //     }
    //     const users = usersResponse.data;
    //     //create Queue for sending notification
    //     //queue payload--------------->
    //     const queuePayload: any = {users}
    //     const QueueName = `notification-${Math.floor(Math.random() * 1000000)}` //create queue name dynamically for every file
    //     const notificationQueue = commonHelper.generateQueue(QueueName) //generate queue
    //     //add data in the queue---------->
    //     notificationQueue.add(queuePayload, { 
    //         delay: 2000, //2 seconds 
    //         attempts: 1,
    //         removeOnComplete: true
    //     })
    //     return showResponse(true, responseMessage.users.notification_sent_sucess, {notificationQueue}, statusCodes.SUCCESS);
    // },
    //  getUsersListThroughCache: async (data: any): Promise<ApiResponse> => {
    //     const {sort_column = 'createdAt',sort_direction = 'desc', page = 1,limit = 10,search_key = '',status} = data;
    // // -------------------- CACHE KEY (IMPORTANT) --------------------
    // const cacheKey = `USER_LIST:${page}:${limit}:${sort_column}:${sort_direction}:${search_key}:${status ?? 'ALL'}`;
    // const cached = await getCache(cacheKey);
    // // console.log("cache data in user list", cached);
    // if (cached) {
    //   return showResponse(true,responseMessage?.common?.data_retreive_sucess, cached, statusCodes.SUCCESS);
    // }
    // // -------------------- QUERY --------------------
    // const queryObject: any = {
    //   user_type: ROLE.USER,
    // //   is_verified: true,
    //   status: { $ne: USER_STATUS.DELETED },
    //   $or: [
    //     { email: { $regex: search_key, $options: 'i' } },
    //     { first_name: { $regex: search_key, $options: 'i' } }
    //   ]
    // };
    // if (status) {
    //   queryObject.status = status;
    // }
    // // -------------------- AGGREGATION --------------------
    // const aggregate = [
    //   { $match: queryObject },
    //   {
    //     $sort: {
    //       [sort_column]: sort_direction === 'asc' ? 1 : -1
    //     }
    //   },
    //   {
    //     $addFields: {
    //       full_name: { $concat: ["$first_name", " ", "$last_name"] }
    //     }
    //   },
    //   {
    //     $project: {
    //       password: 0,
    //       device_info: 0,
    //       social_account: 0
    //     }
    //   }
    // ];
    // // -------------------- PAGINATION + COUNT --------------------
    // const { totalCount, aggregation } = await commonHelper.getCountAndPagination(userModel,aggregate,page,limit);
    // const result = await userModel.aggregate(aggregation);
    // const responseData = { result, totalCount };
    // // -------------------- SET CACHE --------------------
    // await setCache(cacheKey,responseData, 60);
    // return showResponse(true, responseMessage?.common?.data_retreive_sucess,responseData,statusCodes.SUCCESS);
    // },
    overviewAnalytics: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.revenuecat.com/v2/projects/${process.env.REVENUECAT_PROJECT_ID}/metrics/overview`, {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            });
            return (0, response_util_1.showResponse)(true, "RevenueCat overview fetched successfully", response.data, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Unable to fetch analytics", null, statusCodes_1.default.API_ERROR);
        }
    }),
    mrrAnalytics: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.revenuecat.com/v2/projects/${process.env.REVENUECAT_PROJECT_ID}/charts/mrr`, {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            });
            return (0, response_util_1.showResponse)(true, "MRR analytics fetched successfully", response.data, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Unable to fetch MRR analytics", null, statusCodes_1.default.API_ERROR);
        }
    }),
    churnAnalytics: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.revenuecat.com/v2/projects/${process.env.REVENUECAT_PROJECT_ID}/charts/churn`, {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            });
            return (0, response_util_1.showResponse)(true, "Churn analytics fetched successfully", response.data, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Unable to fetch churn analytics", null, statusCodes_1.default.API_ERROR);
        }
    }),
    customerSubscriptionDetails: (appUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.revenuecat.com/v1/subscribers/${appUserId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            });
            return (0, response_util_1.showResponse)(true, "Customer details fetched successfully", response.data, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Unable to fetch customer details", null, statusCodes_1.default.API_ERROR);
        }
    })
};
exports.default = AdminUserHandler;
