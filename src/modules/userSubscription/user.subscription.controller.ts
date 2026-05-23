import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Body, Security} from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './user.subscription.handler'
import {
 validateInitialPurchasedAndroidSubscription,
validateInitialPurchasedIosSubscription
} from './user.subscription.validator';
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes'
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
    * Ios webhook url
    */
@Security('Bearer')
@Post("/ios_subscription_webhook")
public async iosSubscriptionWebhook(@Body() request: { subscription_id: string }): Promise<ApiResponse> {
    const wrappedFunc = tryCatchWrapper(handler.iosSubscriptionWebhook);
    return wrappedFunc(request); // Pass the request object directly to the function
}
//ends

/**
* initialPurchasedSubscription for iOS
*/
@Security('Bearer')
@Post("/initial_purchased_ios_subscription")
public async initialPurchasedIosSubscription(@Body() request: { package_name: string, original_transaction_id: string, signedPayload: string }): Promise<ApiResponse> {
    try {
        const { package_name, original_transaction_id, signedPayload } = request;

        console.log(' ✅ Request coming in controller initial_purchased_ios_subscription');

        // Validate the request
        const validate = validateInitialPurchasedIosSubscription(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR);
        }

        console.log(' ✅ Request coming in controller initial_purchased_ios_subscription 111');

        // Wrap the function call in try-catch for error handling
        const wrappedFunc = tryCatchWrapper(handler.initialPurchasedIosSubscription);
        return await wrappedFunc({ package_name, original_transaction_id, signedPayload }, this.userId); // Pass the request object directly to the function
    } catch (error) {
        // Handle any unexpected errors that happen during the process
        console.log('❌ Error in initialPurchasedIosSubscription controller:', error);
        return showResponse(false, 'An unexpected error occurred. Please try again later.', null, statusCodes.API_ERROR);
    }
}

//ends

/**
* initialPurchased Android Subscription
*/
@Security('Bearer')
@Post("/initial_purchased_android_subscription")
public async initialPurchasedAndroidSubscription(@Body() request: { plan_name: string, purchase_token: string }): Promise<ApiResponse> {
    const { plan_name, purchase_token } = request;

    const validate = validateInitialPurchasedAndroidSubscription(request);
    if (validate.error) {
        return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }

    const wrappedFunc = tryCatchWrapper(handler.initialPurchasedAndroidSubscription);
    return wrappedFunc({ plan_name, purchase_token }, this.userId); // Pass the request object directly to the function
}
//ends

}