import moment from "moment";
import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import { findOne, findOneAndUpdate, getCount } from "../../helpers/db.helpers";
import * as commonHelper from "../../helpers/common.helper";
import responseMessage from '../../constants/responseMessages'
import userModel from '../../modules/UserAuth/user.auth.model';
import { DEACTIVATE_BY, ROLE, USER_STATUS } from '../../constants/workflow.constant'
import statusCodes from '../../constants/statusCodes'
import services from "../../services";
// import { getCache, setCache } from "../../processQueue/redis.cache";

const AdminUserHandler = {

    getUsersList: async (data: any): Promise<ApiResponse> => {
        const { sort_column = 'createdAt', sort_direction = 'desc', page, limit, search_key = '', status } = data

        const queryObject: any = {
            user_type: ROLE.USER, // 3 for users
            // is_verified: true,
            status: { $ne: USER_STATUS.DELETED },
            $or: [
                { email: { $regex: search_key, $options: 'i' } },
                { first_name: { $regex: search_key, $options: 'i' } },
            ]
        }

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
            queryObject.status = status
        }

        const aggregate = [
            {
                $match: {
                    ...queryObject
                }
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

        ]

        //add this function where we cannot add query to get count of document example searchKey and add pagination at the end of query
        const { totalCount, aggregation } = await commonHelper.getCountAndPagination(userModel, aggregate, page, limit)
        const result = await userModel.aggregate(aggregation)

        return showResponse(true, responseMessage?.common.data_retreive_sucess, { result, totalCount }, statusCodes.SUCCESS);
    },

    getUserDetails: async (user_id: string): Promise<ApiResponse> => {

        const getResponse = await findOne(userModel, { _id: user_id, status: { $ne: USER_STATUS.DELETED } }, { password: 0 });
        if (!getResponse.status) {
            return showResponse(false, responseMessage.users.invalid_user, null, statusCodes.API_ERROR)
        }

        return showResponse(true, responseMessage.users.user_detail, getResponse.data, statusCodes.SUCCESS)
    },


    updateUserStatus: async (data: any): Promise<ApiResponse> => {
        const { user_id, status } = data;

        const parsedStatus = Number(status);
        const queryObject = { _id: user_id, user_type: ROLE.USER } //usertype should be USER  = 3

        const result = await findOne(userModel, queryObject);
        if (!result.status) {
            return showResponse(false, responseMessage.users.invalid_user, null, statusCodes.API_ERROR);
        }

        const editObj = { status: parsedStatus, deactivate_by: '' }

        if (parsedStatus === USER_STATUS.DEACTIVATED) {
            editObj.deactivate_by = DEACTIVATE_BY.ADMIN
        }//ends

        const response = await findOneAndUpdate(userModel, queryObject, editObj);
        if (!response.status) {
            return showResponse(false, responseMessage.users.user_account_update_error, null, statusCodes.API_ERROR);
        }

        const msg = parsedStatus == 2 ? "Deleted" : parsedStatus == 1 ? "Activated" : "Deactivated"
        return showResponse(true, `${responseMessage.users.user_account_has_been} ${msg}`, {}, statusCodes.SUCCESS);

    },

    getDashboardData: async (past_day: string = 'MAX'): Promise<ApiResponse> => {

        // Calculate the timestamps for 30 days ago, 180 days ago, and 365 days ago
        const thirtyDaysAgo = moment().subtract(30, 'days').unix()  //last 30 days timestamp
        const sixMonthAgo = moment().subtract(180, 'days').unix() //last 180 days timestamp
        const oneYearAgo = moment().subtract(365, 'days').unix() //last 365 days timestamp
        const maxDate = moment().unix(); //today timestamp

        const dates: any = {
            '1M': { $gte: thirtyDaysAgo },//greater then last  1 month  date users registeration data
            '6M': { $gte: sixMonthAgo }, //greater then last 6 month  date users registeration data
            '1Y': { $gte: oneYearAgo }, //greater then last year date users registeration data
            'MAX': { $lte: maxDate }, //if max then less then equal to current date users data
        }

        const fetch_data_date: any = dates[past_day]

        const dashboard = await userModel.aggregate([
            {
                $match: {
                    user_type: ROLE.USER,
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

        const all_users = await getCount(userModel, { status: { $ne: USER_STATUS.DELETED } })
        const active_users = await getCount(userModel, { status: USER_STATUS.ACTIVE })
        const deactivated_users = await getCount(userModel, { status: USER_STATUS.DEACTIVATED })

        const user_summary = {
            all_users: all_users.data,
            active_users: active_users.data,
            deactivated_users: deactivated_users.data
        }

        return showResponse(true, 'Dashboard data is here', { user_summary, dashboard }, statusCodes.SUCCESS);
    },

    // --- MULTIPART UPLOAD ROUTES START---
    initiateMultipartUpload: async (fileName: string, fileType: string) => {
        return await services.awsService.initiateMultipartUpload(fileName, fileType);
    },

    signMultipartPart: async (key: string, uploadId: string, partNumber: number) => {
        return await services.awsService.getMultipartPresignedUrl(key, uploadId, partNumber);
    },

    completeMultipartUpload: async (key: string, uploadId: string, parts: any[]) => {
        return await services.awsService.completeMultipartUpload(key, uploadId, parts);
    },

    // Updated Process Handler
    processFileAdmin: async (data: any) => {
        const { s3_key, duration } = data;
        // Pass the duration to the service so we don't calculate it on the server
        return await services.awsService.processUploadedVideoAdmin(s3_key, duration);
    },

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
}

export default AdminUserHandler 
