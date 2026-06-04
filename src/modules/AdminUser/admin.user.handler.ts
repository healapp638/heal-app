import moment from "moment";
import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import { findOne, findOneAndUpdate, getCount } from "../../helpers/db.helpers";
import * as commonHelper from "../../helpers/common.helper";
import responseMessage from '../../constants/responseMessages'
import userModel from '../../modules/UserAuth/user.auth.model';
import { DEACTIVATE_BY, USER_STATUS } from '../../constants/workflow.constant'
import statusCodes from '../../constants/statusCodes'
import services from "../../services";
import userJournalModel from "../UserJournel/user.journel.model";
import userModulesCompletePhaseModel from "../UserModules/user.modules.complete.phase.model";
import userWeeklyChallengesModel from "../UserChallenges/user.weekly.challenges.model";
import userDailyChallengesModel from "../UserChallenges/user.daily.challenges.model";
import userAuthModel from "../../modules/UserAuth/user.auth.model";
import userThemeEngagementModel from "../UserModules/user.themeEngagement.model";
import { sendTopicNotification } from "../../services/notification.service";
import axios from "axios";
// import { getCache, setCache } from "../../processQueue/redis.cache";

const AdminUserHandler = {

    getUsersList: async (data: any): Promise<ApiResponse> => {
        const { sort_column = 'createdAt', sort_direction = 'desc', page, limit, search_key = '', status } = data

        // const queryObject: any = {
        //     status: { $ne: USER_STATUS.DELETED },
        //     $or: [
        //         { email: { $regex: search_key, $options: 'i' } },
        //         { fullName: { $regex: search_key, $options: 'i' } },
        //     ],
        //     isVerified: true
        // }

        // if used social login n project 
        const queryObject: any = {
            status: { $ne: USER_STATUS.DELETED },
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
                        { $and: [{ account_source: "email" }] } // Email accounts must be verified
                    ]
                }
            ]
        };


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
        const userData = getResponse?.data
        if (!getResponse.status) {
            return showResponse(false, responseMessage.users.invalid_user, null, statusCodes.API_ERROR)
        }
        //calculate progress start
        const CompletedPhases = await userModulesCompletePhaseModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(user_id),
                    status: USER_STATUS.ACTIVE
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
        const completedWeeklyChallenges = await userWeeklyChallengesModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(user_id),
                    status: USER_STATUS.ACTIVE,
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
        const completedDailyChallenges = await userDailyChallengesModel.aggregate([
            {
                $match: {
                    user_id: commonHelper.convertToObjectId(user_id),
                    status: USER_STATUS.ACTIVE,
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
        const startOfDay = moment().tz(userData?.timeZone || 'America/New_York').startOf('day').toDate();
        const endOfDay = moment().tz(userData?.timeZone || 'America/New_York').endOf('day').toDate();

        const totalJournels = await userJournalModel.countDocuments({
            user_id: commonHelper.convertToObjectId(user_id),
            status: USER_STATUS.ACTIVE,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalJournelEarnedPoints =
            totalJournels > 0
                ? ((totalJournels - 1) * 10) + 25
                : 0;

        const total_earned_points = (CompletedPhases[0]?.total_points || 0) + (completedWeeklyChallenges[0]?.total_points || 0) + (completedDailyChallenges[0]?.total_points || 0) + totalJournelEarnedPoints || 0 + userData?.streak_credit || 0;
        const pointThresholds = [
            99, 235, 460, 740, 1070, 1450, 1875, 2345,
            2860, 3415, 4015, 4650, 5325, 6040, 6795,
            7590, 8420, 9290, 10195, 11140, 12120,
            13135, 14185, 15270, 16390, 17545,
            18730, 19955, 21215, 22505
        ];
        const total_points = pointThresholds.find((curelem) => total_earned_points < curelem) ?? 22505
        const completedPercentage = total_points > 0
            ? (Math.round((total_earned_points / total_points) * 100))
            : 0;

        // Calculate level
        const totalLevels = 30;
        let currentLevel = total_earned_points < 99 ? 1 : total_earned_points < 235 ? 2 : total_earned_points < 460 ? 3 : total_earned_points < 740 ? 4 : total_earned_points < 1070 ? 5 : total_earned_points < 1450 ? 6 : total_earned_points < 1875 ? 7 : total_earned_points < 2345 ? 8 : total_earned_points < 2860 ? 9 : total_earned_points < 3415 ? 10 : total_earned_points < 4015 ? 11 : total_earned_points < 4650 ? 12 : total_earned_points < 5325 ? 13 : total_earned_points < 6040 ? 14 : total_earned_points < 6795 ? 15 : total_earned_points < 7590 ? 16 : total_earned_points < 8420 ? 17 : total_earned_points < 9290 ? 18 : total_earned_points < 10195 ? 19 : total_earned_points < 11140 ? 20 : total_earned_points < 12120 ? 21 : total_earned_points < 13135 ? 22 : total_earned_points < 14185 ? 23 : total_earned_points < 15270 ? 24 : total_earned_points < 16390 ? 25 : total_earned_points < 17545 ? 26 : total_earned_points < 18730 ? 27 : total_earned_points < 19955 ? 28 : total_earned_points < 21215 ? 29 : total_earned_points < 22505 ? 30 : 31;
        // Edge case fix
        if (currentLevel === 0) currentLevel = 1;
        if (currentLevel > totalLevels) currentLevel = totalLevels;

        getResponse.data.total_earned_points = total_earned_points;
        getResponse.data.total_points = total_points;
        getResponse.data.currentLevel = currentLevel;
        getResponse.data.completedPercentage = completedPercentage;
        //calculating progress end
        return showResponse(true, responseMessage.users.user_detail, getResponse.data, statusCodes.SUCCESS)
    },


    updateUserStatus: async (data: any): Promise<ApiResponse> => {
        const { user_id, status } = data;

        const parsedStatus = Number(status);
        const queryObject = { _id: user_id } //usertype should be USER  = 3

        // const result = await findOne(userModel, queryObject);
        // if (!result.status) {
        //     return showResponse(false, responseMessage.users.invalid_user, null, statusCodes.API_ERROR);
        // }

        const editObj = { status: parsedStatus, deactivate_by: '' }

        if (parsedStatus === USER_STATUS.DEACTIVATED) {
            editObj.deactivate_by = DEACTIVATE_BY.ADMIN
            const res = await sendTopicNotification(user_id, 'Your account has been deactivated', 'Your account has been deactivated by Admin', {})
            console.log(res, 'res1')
        }//ends

        if (parsedStatus === USER_STATUS.DELETED) {
            const res = await sendTopicNotification(user_id, 'Your account has been deleted', 'Your account has been deleted by Admin', {})
            console.log(res, 'res2')
        }

        if (parsedStatus === USER_STATUS.ACTIVE) {
            const res = await sendTopicNotification(user_id, 'Your account has been activated', 'Your account has been activated by Admin', {})
            console.log(res, 'res3')
        }

        const response = await findOneAndUpdate(userModel, queryObject, editObj);
        if (!response.status) {
            return showResponse(false, responseMessage.users.user_account_update_error, null, statusCodes.API_ERROR);
        }

        const msg = parsedStatus == 2 ? "Deleted" : parsedStatus == 1 ? "Activated" : "Deactivated"
        return showResponse(true, `${responseMessage.users.user_account_has_been} ${msg}`, {}, statusCodes.SUCCESS);

    },

    getDashboardData: async (past_day: string = 'MAX'): Promise<ApiResponse> => {

        // Calculate the timestamps for 30 days ago, 180 days ago, and 365 days ago
        const thirtyDaysAgo = moment().subtract(30, 'days').toDate()  //last 30 days timestamp
        const sixMonthAgo = moment().subtract(180, 'days').toDate() //last 180 days timestamp
        const oneYearAgo = moment().subtract(365, 'days').toDate() //last 365 days timestamp
        const maxDate = moment().toDate(); //today timestamp

        const dates: any = {
            '1M': { $gte: thirtyDaysAgo },//greater then last  1 month  date users registeration data
            '6M': { $gte: sixMonthAgo }, //greater then last 6 month  date users registeration data
            '1Y': { $gte: oneYearAgo }, //greater then last year date users registeration data
            'MAX': { $lte: maxDate }, //if max then less then equal to current date users data
        }

        const fetch_data_date = dates[past_day] || dates["1M"];

        const dashboard = await userModel.aggregate([
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

        const all_users = await getCount(userModel, { status: { $ne: USER_STATUS.DELETED } })
        const active_users = await getCount(userModel, { status: USER_STATUS.ACTIVE })
        const deactivated_users = await getCount(userModel, { status: USER_STATUS.DEACTIVATED });
        const journelPieChart = await userJournalModel.aggregate([
            {
                $match: {
                    status: USER_STATUS.ACTIVE,
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
        const hearAboutUsPieChart = await userAuthModel.aggregate([
            {
                $match: {
                    status: USER_STATUS.ACTIVE,
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
        const userEngagementOnThemeChart = await userThemeEngagementModel.aggregate([
            {
                $match: {
                    createdAt: fetch_data_date,
                    status: USER_STATUS.ACTIVE
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
        ])

        const user_summary = {
            all_users: all_users.data,
            active_users: active_users.data,
            deactivated_users: deactivated_users.data,
            journelPieChart,
            hearAboutUsPieChart,
            userEngagementOnThemeChart
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
    // },

    overviewAnalytics: async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get(
            `https://api.revenuecat.com/v2/projects/${process.env.REVENUECAT_PROJECT_ID}/metrics/overview`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            }
        );
        return showResponse(true,"RevenueCat overview fetched successfully",response.data,statusCodes.SUCCESS);
    } catch (error: any) {

        return showResponse(false,error?.message || "Unable to fetch analytics",null,statusCodes.API_ERROR);
    }
},

mrrAnalytics: async (): Promise<ApiResponse> => {
    try {

        const response = await axios.get(
            `https://api.revenuecat.com/v2/projects/${process.env.REVENUECAT_PROJECT_ID}/charts/mrr`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            }
        );
        return showResponse(true,"MRR analytics fetched successfully",response.data,statusCodes.SUCCESS);

    } catch (error: any) {
        return showResponse(false,error?.message || "Unable to fetch MRR analytics",null,statusCodes.API_ERROR);
    }
},

churnAnalytics: async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get(
            `https://api.revenuecat.com/v2/projects/${process.env.REVENUECAT_PROJECT_ID}/charts/churn`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            }
        );
        return showResponse(true,"Churn analytics fetched successfully",response.data,statusCodes.SUCCESS);

    } catch (error: any) {
        return showResponse(false,error?.message || "Unable to fetch churn analytics",null,statusCodes.API_ERROR);
    }
},

customerSubscriptionDetails: async (appUserId: string): Promise<ApiResponse> => {
    try {
        const response = await axios.get(
            `https://api.revenuecat.com/v1/subscribers/${appUserId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`
                }
            }
        );
        return showResponse(true,"Customer details fetched successfully",response.data,statusCodes.SUCCESS);
    } catch (error: any) {
        return showResponse(false,error?.message || "Unable to fetch customer details",null,statusCodes.API_ERROR);
    }
}
}

export default AdminUserHandler 
