"use strict";
// import express, { Request, Response } from 'express'
// import UserAuthController from '../../controllers/User/user.auth.controller'
// import UserSubscriptionController from '../../controllers/User/user.subscription.controller'
// import { showOutput } from '../../utils/response.util'
// import { ApiResponse } from '../../utils/interfaces.util'
// import middlewares from '../../middlewares'
// const { verifyTokenUser } = middlewares.auth
// const router = express.Router()
// // Web side to subscribe subscription plan list
// router.get('/stripe_plan', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripePlanList();
//     return showOutput(res, result, result.code)
// })
// // // Mobile side to subscribe subscription plan list
// // router.get('/app_subscription_plan', async (req: Request | any, res: Response) => {
// //     const controller = new UserSubscriptionController(req, res)
// //     const result: ApiResponse = await controller.appSubscriptionPlan();
// //     return showOutput(res, result, result.code)
// // })
// router.post('/stripe_subscribe_plan', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const { token_id, plan_price_id } = req.body;
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripeSubscribePlan({ token_id, plan_price_id });
//     return showOutput(res, result, result.code)
// })
// router.get('/stripe_default_payment_source', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripeDefaultPaymentSource();
//     return showOutput(res, result, result.code)
// })
// router.post('/stripe_default_card_update', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const { token_id } = req.body;
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripeDefaultCardUpdate({ token_id });
//     return showOutput(res, result, result.code)
// })
// router.get('/stripe_all_subscriptions', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripeAllsubscriptions();
//     return showOutput(res, result, result.code)
// })
// router.post('/stripe_delete_subscription', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const { subscription_id } = req.body;
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripeDeleteSubscription({ subscription_id });
//     return showOutput(res, result, result.code)
// })
// router.post('/stripe_cancel_plan_till_end_period', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const { subscription_id } = req.body;
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripeCancelPlanTillEndPeriod({ subscription_id });
//     return showOutput(res, result, result.code)
// })
// router.post('/stripe_webhooks', async (req: Request | any, res: Response) => {
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.stripeWebhooks(req.body);
//     return showOutput(res, result, result.code)
// })
// router.post('/initial_purchased_ios_subscription', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const { package_name, original_transaction_id, signedPayload } = req.body;
//     const controller = new UserSubscriptionController(req, res)
//     console.log(' ✅ Request coming in route initial_purchased_ios_subscription');
//     const result: ApiResponse = await controller.initialPurchasedIosSubscription({ package_name, original_transaction_id, signedPayload });
//     return showOutput(res, result, result.code)
// })
// router.post('/initial_purchased_android_subscription', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const { plan_name, purchase_token } = req.body;
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.initialPurchasedAndroidSubscription({ plan_name, purchase_token });
//     return showOutput(res, result, result.code)
// })
// router.post('/ios_subscription_webhook', async (req: Request | any, res: Response) => {
//     const controller = new UserSubscriptionController(req, res)
//     const result: ApiResponse = await controller.iosSubscriptionWebhook(req.body);
//     return showOutput(res, result, result.code)
// })
// export default router
