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
const express_1 = __importDefault(require("express"));
const admin_user_controller_1 = __importDefault(require("../../controllers/Admin/admin.user.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
// import { initializeNotificationQueue } from '../../processQueue/redis.queue'
// import { initializeNotificationQueue } from '../../processQueue/redis.queue'
const { verifyTokenAdmin } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.get('/list', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort_column, sort_direction, page, limit, search_key, status } = req.query;
    const controller = new admin_user_controller_1.default(req, res);
    const result = yield controller.getUsersList(sort_column, sort_direction, page, limit, search_key, status);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.query;
    const controller = new admin_user_controller_1.default(req, res);
    const result = yield controller.getUserDetails(user_id);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.put('/status', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, status } = req.body;
    const controller = new admin_user_controller_1.default(req, res);
    const result = yield controller.updateUserStatus({ user_id, status });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/dashboard', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { past_day } = req.query;
    const controller = new admin_user_controller_1.default(req, res);
    const result = yield controller.getDashboardData(past_day);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
// router.post('/send/multiple/notifications', verifyTokenAdmin, async (req: Request | any, res: Response) => {
//     // const { } = req.body
//     const controller = new AdminUserController(req, res)
//     const result: ApiResponse = await controller.sendMultipleNotifications();
//     initializeNotificationQueue(result.data?.notificationQueue)
//     delete result.data?.notificationQueue
//     return showOutput(res, result, result.code)
// })
// router.get('/list/through_cache', verifyTokenAdmin, async (req: Request | any, res: Response) => {
//     const { sort_column, sort_direction, page, limit, search_key, status } = req.query
//     const controller = new AdminUserController(req, res)
//     const result: ApiResponse = await controller.getUsersListThroughCache(sort_column, sort_direction, page, limit, search_key, status);
//     return showOutput(res, result, result.code)
// })
// --- MULTIPART UPLOAD ROUTES START---
// 1. Initiate Upload
router.post('/upload/multipart/init', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, fileType } = req.body;
    const controller = new admin_user_controller_1.default(req, res);
    // FIX: Pass as a single object { fileName, fileType }
    const result = yield controller.initiateMultipartUpload({ fileName, fileType });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
// 2. Sign Specific Chunk (Part)
router.post('/upload/multipart/sign-part', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, uploadId, partNumber } = req.body;
    const controller = new admin_user_controller_1.default(req, res);
    const result = yield controller.signMultipartPart({ key, uploadId, partNumber });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
// 3. Complete Upload
router.post('/upload/multipart/complete', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, uploadId, parts } = req.body;
    const controller = new admin_user_controller_1.default(req, res);
    const result = yield controller.completeMultipartUpload({ key, uploadId, parts });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
// --- UPDATED PROCESS ROUTE 
router.post('/upload/process_file_admin', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { s3_key, duration } = req.body;
    const controller = new admin_user_controller_1.default(req, res);
    const result = yield controller.processFileAdmin({ s3_key, duration });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
// --- MULTIPART UPLOAD ROUTES END---
exports.default = router;
