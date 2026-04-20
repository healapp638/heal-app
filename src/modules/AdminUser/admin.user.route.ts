import express, { Request, Response } from 'express'
import AdminUserController from './admin.user.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
// import { initializeNotificationQueue } from '../../processQueue/redis.queue'
// import { initializeNotificationQueue } from '../../processQueue/redis.queue'
const { verifyTokenAdmin } = middlewares.auth

const router = express.Router()

router.get('/list', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { sort_column, sort_direction, page, limit, search_key, status } = req.query
    const controller = new AdminUserController(req, res)
    const result: ApiResponse = await controller.getUsersList(sort_column, sort_direction, page, limit, search_key, status);
    return showOutput(res, result, result.code)

})

router.get('/details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { user_id } = req.query;
    const controller = new AdminUserController(req, res)
    const result: ApiResponse = await controller.getUserDetails(user_id);
    return showOutput(res, result, result.code)

})

router.put('/status', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { user_id, status } = req.body
    const controller = new AdminUserController(req, res)
    const result: ApiResponse = await controller.updateUserStatus({ user_id, status });
    return showOutput(res, result, result.code)

})

router.get('/dashboard', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { past_day } = req.query
    const controller = new AdminUserController(req, res)
    const result: ApiResponse = await controller.getDashboardData(past_day);
    return showOutput(res, result, result.code)

})


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
router.post('/upload/multipart/init', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { fileName, fileType } = req.body;
    const controller = new AdminUserController(req, res);

    // FIX: Pass as a single object { fileName, fileType }
    const result: ApiResponse = await controller.initiateMultipartUpload({ fileName, fileType });

    return showOutput(res, result, result.code);
});

// 2. Sign Specific Chunk (Part)
router.post('/upload/multipart/sign-part', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { key, uploadId, partNumber } = req.body;
    const controller = new AdminUserController(req, res);

    const result: ApiResponse = await controller.signMultipartPart({ key, uploadId, partNumber });

    return showOutput(res, result, result.code);
});

// 3. Complete Upload
router.post('/upload/multipart/complete', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { key, uploadId, parts } = req.body;
    const controller = new AdminUserController(req, res);

    const result: ApiResponse = await controller.completeMultipartUpload({ key, uploadId, parts });

    return showOutput(res, result, result.code);
});

// --- UPDATED PROCESS ROUTE 
router.post('/upload/process_file_admin', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { s3_key, duration } = req.body;
    const controller = new AdminUserController(req, res);
    const result: ApiResponse = await controller.processFileAdmin({ s3_key, duration });
    return showOutput(res, result, result.code);
});

// --- MULTIPART UPLOAD ROUTES END---



export default router
