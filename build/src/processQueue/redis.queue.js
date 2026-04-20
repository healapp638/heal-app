"use strict";
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
exports.initializeNotificationQueue = void 0;
const db_helpers_1 = require("../helpers/db.helpers");
const admin_auth_model_1 = __importDefault(require("../modules/AdminAuth/admin.auth.model"));
const services_1 = __importDefault(require("../services"));
// const initizalizeMediaQueue = (filesObj: any, index: number, buffer: any, QueryData: any) => {
//     console.log(index, "indexQueueunder")
//     const { media_type } = QueryData
//     // let fileBuffer = Buffer.from(buffer); //convert file buffer to orignal buffer
//     const QueueName = `Media-${Math.floor(Math.random() * 1000000)}` //create queue name dynamically for every file
//     const MediaQueue = commonHelper.generateQueue(QueueName) //generate queue
//     //add data in the queue
//     MediaQueue.add(filesObj, { //dont include file buffer in array 
//         delay: (index * 30000), //30 seconds 
//         attempt: 1,
//         removeOnComplete: true
//     })
//     //starts the queue process
//     MediaQueue.process(async (job: any, done: any) => {
//         const mediaFiles = job?.data //single media in file object
//         //upload media to s3  one by one 
//         services.awsService.uploadQueueMediaToS3([mediaFiles]).then(async (uploaded_file_url: any) => {
//             const addObj = {
//                 media_type,
//                 url: uploaded_file_url[0]
//             };
//             const ref = new galleryModel(addObj)
//             const saveMedia = await createOne(ref)
//             // console.log(saveMedia, "saveMediaa")
//             if (!saveMedia.status) {
//                 console.log('Error While Save Media in Database')
//             }
//         }).catch((err) => {
//             console.log("Queue error on aws response", err)
//         })
//         done()
//     })
// }//ends
const initializeNotificationQueue = (notificationQueue) => __awaiter(void 0, void 0, void 0, function* () {
    if (!notificationQueue) {
        console.error("Notification queue not provided");
        return;
    }
    // -------------------- HELPER: USER NOTIFICATION WITH RETRY --------------------
    const notifyUserWithRetry = (user_1, adminId_1, title_1, notificationType_1, ...args_1) => __awaiter(void 0, [user_1, adminId_1, title_1, notificationType_1, ...args_1], void 0, function* (user, adminId, title, notificationType, maxRetries = 1) {
        var _a;
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                const userId = user._id.toString();
                const description = `Hello ${user.first_name}, this is a notification from admin.`;
                // Save notification
                const notification = yield (0, db_helpers_1.saveNotification)({ user_id: adminId }, { user_id: userId }, title, description, notificationType);
                // Send push notification only if enabled
                if (user.notification_enabled === true) {
                    yield services_1.default.notificationService.sendTopicNotification(userId, title, description, {
                        type: notificationType,
                        createdAt: new Date(),
                        _id: (_a = notification === null || notification === void 0 ? void 0 : notification.data) === null || _a === void 0 ? void 0 : _a._id,
                    });
                }
                return;
            }
            catch (error) {
                attempt++;
                if (attempt > maxRetries) {
                    throw error;
                }
                // Optional delay before retry
                yield new Promise((res) => setTimeout(res, 500));
            }
        }
    });
    // -------------------- JOB PROCESSOR --------------------
    notificationQueue.process(1, (job) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = {
            success: true,
            processed: 0,
            succeeded: 0,
            failed: 0,
            errors: [],
        };
        try {
            const { users } = job.data;
            // -------------------- VALIDATION --------------------
            if (!Array.isArray(users) || users.length === 0) {
                console.warn(`Job ${job.id}: No users to notify`);
                return result;
            }
            result.processed = users.length;
            // -------------------- ADMIN --------------------
            const adminData = yield (0, db_helpers_1.findOne)(admin_auth_model_1.default, {});
            if (!(adminData === null || adminData === void 0 ? void 0 : adminData.status) || !((_a = adminData === null || adminData === void 0 ? void 0 : adminData.data) === null || _a === void 0 ? void 0 : _a._id)) {
                throw new Error("Admin not found");
            }
            const adminId = adminData.data._id.toString();
            //you can change title and notificationType according to your need
            const title = "New Notification";
            const notificationType = "reminder";
            // -------------------- USER PROCESSING --------------------
            yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield notifyUserWithRetry(user, adminId, title, notificationType, 1 // retry once
                    );
                    result.succeeded++;
                }
                catch (err) {
                    result.failed++;
                    result.success = false;
                    const errorMsg = `User ${user === null || user === void 0 ? void 0 : user._id}: ${err.message}`;
                    result.errors.push(errorMsg);
                }
            })));
            // Limit error payload size
            result.errors = result.errors.slice(0, 5);
            return result;
        }
        catch (error) {
            console.error(`Job ${job.id} crashed:`, error.message);
            throw error; // Important: marks job as failed
        }
    }));
    // -------------------- QUEUE EVENTS --------------------
    notificationQueue.on("completed", (job, result) => {
        console.log(`Job ${job.id} completed: ${result.succeeded}/${result.processed} succeeded`);
    });
    notificationQueue.on("failed", (job, error) => {
        console.error(`Job ${job.id} failed:`, error.message);
    });
    notificationQueue.on("error", (error) => {
        console.error("Queue error:", error);
    });
});
exports.initializeNotificationQueue = initializeNotificationQueue;
