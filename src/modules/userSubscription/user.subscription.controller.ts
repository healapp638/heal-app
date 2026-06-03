import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Get, Body, Security} from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './user.revenuecat.subscription.handler'
import { tryCatchWrapper } from '../../utils/config.util';

@Tags('User Subscription Routes')
@Route('/user/subscription')

export default class UserSubscriptionController extends Controller {
    req: Request;
    res: Response;
    userId: string
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : ''
    }

    /**
     * RevenueCat Webhook
     */
    @Post("/revenuecat_webhook")
    public async revenueCatWebhook(@Body() request: any): Promise<ApiResponse> {
        const signature = this.req.headers['x-revenuecat-signature'] as string || '';
        const wrappedFunc = tryCatchWrapper(handler.revenueCatWebhook);
        return await wrappedFunc(request, signature); 
    }

    /**
     * Check Subscription Status
     */
    @Security('Bearer')
    @Get("/subscription_status")
    public async checkSubscriptionStatus(): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.checkRevenueCatSubscriptionStatus);
        return await wrappedFunc(this.userId);
    }

    /**
     * Sync After Purchase
     */
    @Security('Bearer')
    @Post("/sync_purchase")
    public async syncAfterPurchase(): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.syncAfterPurchase);
        return await wrappedFunc(this.userId);
    }

// /**
//     * Ios webhook url
//     */
// @Security('Bearer')
// @Post("/ios_subscription_webhook")
// public async iosSubscriptionWebhook(@Body() request: { subscription_id: string }): Promise<ApiResponse> {
//     const wrappedFunc = tryCatchWrapper(handler.iosSubscriptionWebhook);
//     return wrappedFunc(request); // Pass the request object directly to the function
// }
// //ends

// /**
// * initialPurchasedSubscription for iOS
// */
// @Security('Bearer')
// @Post("/initial_purchased_ios_subscription")
// public async initialPurchasedIosSubscription(@Body() request: { package_name: string, original_transaction_id: string, signedPayload: string }): Promise<ApiResponse> {
//     try {
//         const { package_name, original_transaction_id, signedPayload } = request;

//         console.log(' ✅ Request coming in controller initial_purchased_ios_subscription');

//         // Validate the request
//         const validate = validateInitialPurchasedIosSubscription(request);
//         if (validate.error) {
//             return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR);
//         }

//         console.log(' ✅ Request coming in controller initial_purchased_ios_subscription 111');

//         // Wrap the function call in try-catch for error handling
//         const wrappedFunc = tryCatchWrapper(handler.initialPurchasedIosSubscription);
//         return await wrappedFunc({ package_name, original_transaction_id, signedPayload }, this.userId); // Pass the request object directly to the function
//     } catch (error) {
//         // Handle any unexpected errors that happen during the process
//         console.log('❌ Error in initialPurchasedIosSubscription controller:', error);
//         return showResponse(false, 'An unexpected error occurred. Please try again later.', null, statusCodes.API_ERROR);
//     }
// }

// //ends

// /**
// * initialPurchased Android Subscription
// */
// @Security('Bearer')
// @Post("/initial_purchased_android_subscription")
// public async initialPurchasedAndroidSubscription(@Body() request: { plan_name: string, purchase_token: string }): Promise<ApiResponse> {
//     const { plan_name, purchase_token } = request;

//     const validate = validateInitialPurchasedAndroidSubscription(request);
//     if (validate.error) {
//         return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
//     }

//     const wrappedFunc = tryCatchWrapper(handler.initialPurchasedAndroidSubscription);
//     return wrappedFunc({ plan_name, purchase_token }, this.userId); // Pass the request object directly to the function
// }
//ends

// /**
//  * Create Credit
//  */
// @Security('Bearer')
// @Post("/addCredit")
// public async addCredit(
//     @Body() request: { package_name: string, transaction_id: string }
// ): Promise<ApiResponse> {

//     const { package_name, transaction_id } = request;

//     if (!package_name || !transaction_id) {
//         return showResponse(false, "package_name and transaction_id required", null, statusCodes.VALIDATION_ERROR);
//     }

//     const wrappedFunc = tryCatchWrapper(handler.addCredit);
//     return wrappedFunc({ package_name, transaction_id }, this.userId);
// }

}