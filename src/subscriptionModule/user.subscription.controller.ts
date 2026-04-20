// import { request, Request, Response } from 'express'
// import { Route, Controller, Tags, Post, Body, Get, Security, UploadedFile, FormField, Put, Delete } from 'tsoa'
// import { ApiResponse } from '../../utils/interfaces.util';
// import handler from '../../handlers/User/user.subscription.handler'
// import {
//     validateStripeSubscribePlan, validateStripeDefaultCardUpdate,
//     validateStripeCancelSubscription, validateStripeCancelPlanTillEndPeriod, validateInitialPurchasedAndroidSubscription,
//     validateInitialPurchasedIosSubscription
// } from '../../validations/User/user.subscription.validator';
// import { showResponse } from '../../utils/response.util';
// import statusCodes from '../../constants/statusCodes'
// import { tryCatchWrapper } from '../../utils/config.util';

// @Tags('User Subscription Routes')
// @Route('/user/subscription')

// export default class UserSubscriptionController extends Controller {
//     req: Request;
//     res: Response;
//     userId: string
//     constructor(req: Request, res: Response) {
//         super();
//         this.req = req;
//         this.res = res;
//         this.userId = req.body.user ? req.body.user.id : ''
//     }

//     /**
//     * Stripe all subscription list
//     */
//     @Security('Bearer')
//     @Get("/stripe_all_subscriptions")
//     public async stripeAllsubscriptions(): Promise<ApiResponse> {
//         const wrappedFunc = tryCatchWrapper(handler.stripeAllsubscriptions);
//         return wrappedFunc(this.userId); // Invoking the wrapped function 
//     }
//     //ends

//     // /**
//     // * Mobile side all subscription plan list
//     // */
//     // @Get("/app_subscription_plan")
//     // public async appSubscriptionPlan(): Promise<ApiResponse> {
//     //     const wrappedFunc = tryCatchWrapper(handler.appSubscriptionPlan);
//     //     return wrappedFunc(); // Invoking the wrapped function 
//     // }
//     // //ends

//     /**
//     * Stripe Plan List
//     */
//     @Security('Bearer')
//     @Get("/stripe_plan")
//     public async stripePlanList(): Promise<ApiResponse> {
//         const wrappedFunc = tryCatchWrapper(handler.stripePlanList);
//         return wrappedFunc({}, this.userId); // Invoking the wrapped function 
//     }
//     //ends

//     /**
//     * Stripe user's default payment method source
//     */
//     @Security('Bearer')
//     @Get("/stripe_default_payment_source")
//     public async stripeDefaultPaymentSource(): Promise<ApiResponse> {
//         const wrappedFunc = tryCatchWrapper(handler.stripeDefaultPaymentSource);
//         return wrappedFunc({}, this.userId); // Invoking the wrapped function 
//     }
//     //ends


//     /**
//     * Change Password endpoint
//     */
//     @Security('Bearer')
//     @Post("/stripe_subscribe_plan")
//     public async stripeSubscribePlan(@Body() request: { token_id: string, plan_price_id: string }): Promise<ApiResponse> {

//         const { token_id, plan_price_id } = request;

//         const validate = validateStripeSubscribePlan({ token_id, plan_price_id });
//         if (validate.error) {
//             return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
//         }
//         const wrappedFunc = tryCatchWrapper(handler.stripeSubscribePlan);
//         return wrappedFunc({ token_id, plan_price_id }, this.userId); // Invoking the wrapped function 
//     }
//     //ends

//     /**
//     * Update stripe default card detail
//     */
//     @Security('Bearer')
//     @Post("/stripe_default_card_update")
//     public async stripeDefaultCardUpdate(@Body() request: { token_id: string }): Promise<ApiResponse> {

//         const { token_id } = request;
//         const validate = validateStripeDefaultCardUpdate({ token_id });
//         if (validate.error) {
//             return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
//         }

//         const wrappedFunc = tryCatchWrapper(handler.stripeDefaultCardUpdate);
//         return wrappedFunc({ token_id }, this.userId); // Invoking the wrapped function 
//     }
//     //ends

//     /**
//     * Delete user's existing subcription plan
//     */
//     @Security('Bearer')
//     @Post("/stripe_delete_subscription")
//     public async stripeDeleteSubscription(@Body() request: { subscription_id: string }): Promise<ApiResponse> {
//         const { subscription_id } = request;
//         const validate = validateStripeCancelSubscription({ subscription_id });
//         if (validate.error) {
//             return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
//         }
//         const wrappedFunc = tryCatchWrapper(handler.stripeDeleteSubscription);
//         return wrappedFunc({ subscription_id }, this.userId); // Invoking the wrapped function 
//     }
//     //ends

//     /**
//     * Cancel user's existing subcription plan
//     */
//     @Security('Bearer')
//     @Post("/stripe_cancel_plan_till_end_period")
//     public async stripeCancelPlanTillEndPeriod(@Body() request: { subscription_id: string }): Promise<ApiResponse> {
//         const { subscription_id } = request;
//         const validate = validateStripeCancelPlanTillEndPeriod({ subscription_id });
//         if (validate.error) {
//             return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
//         }
//         const wrappedFunc = tryCatchWrapper(handler.stripeCancelPlanTillEndPeriod);
//         return wrappedFunc({ subscription_id }, this.userId); // Invoking the wrapped function 
//     }
//     //ends
//     /**
//     * Cancel user's existing subcription plan
//     */
//     @Security('Bearer')
//     @Post("/stripe_webhooks")
//     public async stripeWebhooks(@Body() request: { subscription_id: string }): Promise<ApiResponse> {
//         const wrappedFunc = tryCatchWrapper(handler.stripeWebhooks);
//         return wrappedFunc(request); // Pass the request object directly to the function
//     }
//     //ends

//     /**
//     * Ios webhook url
//     */
//     @Security('Bearer')
//     @Post("/ios_subscription_webhook")
//     public async iosSubscriptionWebhook(@Body() request: { subscription_id: string }): Promise<ApiResponse> {
//         const wrappedFunc = tryCatchWrapper(handler.iosSubscriptionWebhook);
//         return wrappedFunc(request); // Pass the request object directly to the function
//     }
//     //ends

//     /**
//     * initialPurchasedSubscription for iOS
//     */
//     @Security('Bearer')
//     @Post("/initial_purchased_ios_subscription")
//     public async initialPurchasedIosSubscription(@Body() request: { package_name: string, original_transaction_id: string, signedPayload: string }): Promise<ApiResponse> {
//         try {
//             const { package_name, original_transaction_id, signedPayload } = request;

//             console.log(' ✅ Request coming in controller initial_purchased_ios_subscription');

//             // Validate the request
//             const validate = validateInitialPurchasedIosSubscription(request);
//             if (validate.error) {
//                 return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR);
//             }

//             console.log(' ✅ Request coming in controller initial_purchased_ios_subscription 111');

//             // Wrap the function call in try-catch for error handling
//             const wrappedFunc = tryCatchWrapper(handler.initialPurchasedIosSubscription);
//             return await wrappedFunc({ package_name, original_transaction_id, signedPayload }, this.userId); // Pass the request object directly to the function
//         } catch (error) {
//             // Handle any unexpected errors that happen during the process
//             console.error('❌ Error in initialPurchasedIosSubscription controller:', error);
//             return showResponse(false, 'An unexpected error occurred. Please try again later.', null, statusCodes.API_ERROR);
//         }
//     }

//     //ends

//     /**
//     * initialPurchased Android Subscription
//     */
//     @Security('Bearer')
//     @Post("/initial_purchased_android_subscription")
//     public async initialPurchasedAndroidSubscription(@Body() request: { plan_name: string, purchase_token: string }): Promise<ApiResponse> {
//         const { plan_name, purchase_token } = request;

//         const validate = validateInitialPurchasedAndroidSubscription(request);
//         if (validate.error) {
//             return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
//         }

//         const wrappedFunc = tryCatchWrapper(handler.initialPurchasedAndroidSubscription);
//         return wrappedFunc({ plan_name, purchase_token }, this.userId); // Pass the request object directly to the function
//     }
//     //ends

// }