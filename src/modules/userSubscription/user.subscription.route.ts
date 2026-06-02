import express, { Request, Response } from 'express'
import UserSubscriptionController from './user.subscription.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenUser } = middlewares.auth
const router = express.Router()

router.post('/initial_purchased_ios_subscription', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { package_name, original_transaction_id, signedPayload } = req.body;
    const controller = new UserSubscriptionController(req, res)
    console.log(' ✅ Request coming in route initial_purchased_ios_subscription');
    const result: ApiResponse = await controller.initialPurchasedIosSubscription({ package_name, original_transaction_id, signedPayload });
    return showOutput(res, result, result.code)
})
router.post('/initial_purchased_android_subscription', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { plan_name, purchase_token } = req.body;
    const controller = new UserSubscriptionController(req, res)
    const result: ApiResponse = await controller.initialPurchasedAndroidSubscription({ plan_name, purchase_token });
    return showOutput(res, result, result.code)
})
router.post('/ios_subscription_webhook', async (req: Request | any, res: Response) => {
    const controller = new UserSubscriptionController(req, res)
    const result: ApiResponse = await controller.iosSubscriptionWebhook(req.body);
    return showOutput(res, result, result.code)
})
router.post('/addCredit', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { package_name, transaction_id } = req.body;

    const controller = new UserSubscriptionController(req, res);
    const result: ApiResponse = await controller.addCredit({ package_name, transaction_id });
    return showOutput(res, result, result.code);
});
export default router