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
// import { getCache, setCache } from "../../processQueue/redis.cache";
const AdminUserHandler = {
    getUsersList: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { sort_column = 'createdAt', sort_direction = 'desc', page, limit, search_key = '', status } = data;
        const queryObject = {
            user_type: workflow_constant_1.ROLE.USER, // 3 for users
            // is_verified: true,
            status: { $ne: workflow_constant_1.USER_STATUS.DELETED },
            $or: [
                { email: { $regex: search_key, $options: 'i' } },
                { first_name: { $regex: search_key, $options: 'i' } },
            ]
        };
        //if used social login n project 
        // const queryObject: any = {
        //     user_type: ROLE.USER, // 3 for users
        //     status: { $ne: USER_STATUS.DELETED },
        //     $and: [
        //         {
        //             $or: [
        //                 { email: { $regex: search_key, $options: 'i' } },
        //                 { name: { $regex: search_key, $options: 'i' } }
        //             ]
        //         },
        //         {
        //             $or: [
        //                 { account_source: { $ne: "email" } }, // Allow all non-email accounts
        //                 { $and: [{ account_source: "email" }, { is_verified: true }] } // Email accounts must be verified
        //             ]
        //         }
        //     ]
        // };
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
        const getResponse = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { _id: user_id, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } }, { password: 0 });
        if (!getResponse.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_user, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.users.user_detail, getResponse.data, statusCodes_1.default.SUCCESS);
    }),
    updateUserStatus: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { user_id, status } = data;
        const parsedStatus = Number(status);
        const queryObject = { _id: user_id, user_type: workflow_constant_1.ROLE.USER }; //usertype should be USER  = 3
        const result = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, queryObject);
        if (!result.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.invalid_user, null, statusCodes_1.default.API_ERROR);
        }
        const editObj = { status: parsedStatus, deactivate_by: '' };
        if (parsedStatus === workflow_constant_1.USER_STATUS.DEACTIVATED) {
            editObj.deactivate_by = workflow_constant_1.DEACTIVATE_BY.ADMIN;
        } //ends
        const response = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, queryObject, editObj);
        if (!response.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.user_account_update_error, null, statusCodes_1.default.API_ERROR);
        }
        const msg = parsedStatus == 2 ? "Deleted" : parsedStatus == 1 ? "Activated" : "Deactivated";
        return (0, response_util_1.showResponse)(true, `${responseMessages_1.default.users.user_account_has_been} ${msg}`, {}, statusCodes_1.default.SUCCESS);
    }),
    getDashboardData: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (past_day = 'MAX') {
        // Calculate the timestamps for 30 days ago, 180 days ago, and 365 days ago
        const thirtyDaysAgo = (0, moment_1.default)().subtract(30, 'days').unix(); //last 30 days timestamp
        const sixMonthAgo = (0, moment_1.default)().subtract(180, 'days').unix(); //last 180 days timestamp
        const oneYearAgo = (0, moment_1.default)().subtract(365, 'days').unix(); //last 365 days timestamp
        const maxDate = (0, moment_1.default)().unix(); //today timestamp
        const dates = {
            '1M': { $gte: thirtyDaysAgo }, //greater then last  1 month  date users registeration data
            '6M': { $gte: sixMonthAgo }, //greater then last 6 month  date users registeration data
            '1Y': { $gte: oneYearAgo }, //greater then last year date users registeration data
            'MAX': { $lte: maxDate }, //if max then less then equal to current date users data
        };
        const fetch_data_date = dates[past_day];
        const dashboard = yield user_auth_model_1.default.aggregate([
            {
                $match: {
                    user_type: workflow_constant_1.ROLE.USER,
                    createdAt: fetch_data_date // Filter documents within the last 30 days
                }
            },
            {
                $addFields: {
                    created_date: { $toDate: { $multiply: ["$createdAt", 1000] } } // Convert timestamp to date format
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$created_date" }, // Group by day of the month
                    count: { $sum: 1 } // Count documents for each day
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id field
                    day: "$_id",
                    count: 1
                }
            },
            {
                $sort: { day: 1 } // Sort by day of the month
            }
        ]);
        const all_users = yield (0, db_helpers_1.getCount)(user_auth_model_1.default, { status: { $ne: workflow_constant_1.USER_STATUS.DELETED } });
        const active_users = yield (0, db_helpers_1.getCount)(user_auth_model_1.default, { status: workflow_constant_1.USER_STATUS.ACTIVE });
        const deactivated_users = yield (0, db_helpers_1.getCount)(user_auth_model_1.default, { status: workflow_constant_1.USER_STATUS.DEACTIVATED });
        const user_summary = {
            all_users: all_users.data,
            active_users: active_users.data,
            deactivated_users: deactivated_users.data
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
    // }
};
exports.default = AdminUserHandler;
