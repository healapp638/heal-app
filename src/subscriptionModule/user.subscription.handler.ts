// import moment from "moment";
// import { ApiResponse } from "../../utils/interfaces.util";
// import { showResponse } from "../../utils/response.util";
// import * as commonHelper from "../../helpers/common.helper";
// import userAuthModel from "../../models/User/user.auth.model";
// import userSusbriptionLogsModel from "../../models/User/user.subscriptionLogs.model";
// import subscriptionPlans from "../../models/User/user.subscriptionPlans.model";
// import { USER_STATUS, STRIPE_CREDENTIAL } from '../../constants/app.constant';
// import statusCodes from '../../constants/statusCodes'
// import Stripe from 'stripe';



// //*****Following part used for the subscription *************/
// import { AppStoreServerAPI, Environment, decodeRenewalInfo, decodeTransactions, decodeNotificationPayload, decodeTransaction } from "app-store-server-api";
// import appleReceiptVerify from 'node-apple-receipt-verify';
// import Verifier from "google-play-billing-validator";
// import ab1AndroidSubscriptionFile from '../../../public/androidCerts/androidInAppPurchase.json'

// console.log("✅ ab1 subscription file email >>>>>>>>>>>>>> ", ab1AndroidSubscriptionFile?.client_email)
// const options = {
//     email: String(ab1AndroidSubscriptionFile.client_email),
//     key: String(ab1AndroidSubscriptionFile.private_key)
// };
// const verifier = new Verifier(options); //verifier instance 

// const ANDROID_SUBSCRIPTION_DATA = { //FOR ANDROID
//     SUBSCRIPTION_APN: process.env.SUBSCRIPTION_APN,
//     SUBSCRIPTION_NAME: process.env.SUBSCRIPTION_NAME,
// };

// const ANDROID_SUBS_NOTI_TYPE: any = {
//     SUBSCRIPTION_RECOVERED: 1,
//     SUBSCRIPTION_RENEWED: 2,
//     SUBSCRIPTION_CANCELED: 3,
//     SUBSCRIPTION_PURCHASED: 4,
//     SUBSCRIPTION_ON_HOLD: 5,
//     SUBSCRIPTION_IN_GRACE_PERIOD: 6,
//     SUBSCRIPTION_RESTARTED: 7,
//     SUBSCRIPTION_PRICE_CHANGE_CONFIRMED: 8,
//     SUBSCRIPTION_DEFERRED: 9,
//     SUBSCRIPTION_PAUSED: 10,
//     SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED: 11,
//     SUBSCRIPTION_REVOKED: 12,
//     SUBSCRIPTION_EXPIRED: 13
// };

// const UserSubscriptionHandler = {

//     // **************************Stripe Subscription Methods ****************************************//

//     initialiseStripe: async () => {
//         try {
//             const STRIPE_SEC_KEY = await STRIPE_CREDENTIAL.STRIPE_SEC_KEY
//             console.log(STRIPE_CREDENTIAL.STRIPE_VERSION, "version stripe")
//             const stripeInit = new Stripe(STRIPE_SEC_KEY, {
//                 // @ts-ignore
//                 apiVersion: STRIPE_CREDENTIAL.STRIPE_VERSION,
//                 typescript: true
//             });

//             return stripeInit
//         } catch (error) {
//             console.log(error, "Error Stripe")
//         }

//     },

//     getPriceList: async () => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()
//             const itemList = await stripe.prices.list({
//                 // limit: limit,
//                 expand: ['data.product'],
//             });

//             if (itemList && itemList.data) {
//                 // Filter only active plans
//                 const activePlans = itemList.data.filter((price: any) => price.active);

//                 if (activePlans.length > 0) {
//                     return showResponse(true, 'Active price list retrieved successfully', activePlans, statusCodes.SUCCESS);
//                 } else {
//                     return showResponse(false, 'No active plans found', null, statusCodes.API_ERROR);
//                 }
//             }

//             return showResponse(false, 'Request failed!!', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             // Handle errors
//             console.error('❌ Error retrieving price List:', error);
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     stripePlanList: async (userId: string): Promise<ApiResponse> => {
//         const getResponse: any = await UserSubscriptionHandler.getPriceList();
//         if (!getResponse.status) {
//             return showResponse(false, getResponse.message, null, statusCodes.API_ERROR)
//         }
//         return showResponse(true, getResponse.message, getResponse.data, statusCodes.SUCCESS)
//     },


//     getCustomerDetails: async (data: any) => {
//         try {
//             let { stripe_customer_id, default_payment_source = false } = data

//             const stripe: any = await UserSubscriptionHandler.initialiseStripe();

//             let customer = await stripe.customers.retrieve(stripe_customer_id,
//                 { expand: ['default_source'] }
//             );
//             if (customer) {
//                 //if default_payment_source is true then check default source of payment is added by the customer or not
//                 if (default_payment_source) {
//                     if (!customer.default_source) {
//                         // Customer does not have a default payment source or payment method
//                         return showResponse(false, 'Customer does not have a valid payment source or default payment method.', null, statusCodes.API_ERROR);
//                     }
//                 }
//                 return showResponse(true, 'Stripe customer Details is', customer, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'stripe customer get Request failed!!', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             // Handle errors
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     stripeDefaultPaymentSource: async (data: any, userId: string): Promise<ApiResponse> => {

//         const userDetail = await userAuthModel.findOne({ _id: userId });
//         if (!userDetail) {
//             return showResponse(false, "Invalid user detail", null, statusCodes.API_ERROR)
//         }
//         if (!userDetail?.stripe_customer_id) {
//             return showResponse(false, "Please login again, customer stripe id missing", null, statusCodes.API_ERROR)
//         }

//         const getResponse: any = await UserSubscriptionHandler.getCustomerDetails({ stripe_customer_id: userDetail?.stripe_customer_id, default_payment_source: true });
//         if (!getResponse.status) {
//             return showResponse(false, getResponse.message, null, statusCodes.API_ERROR)
//         }
//         return showResponse(true, getResponse.message, getResponse.data, statusCodes.SUCCESS)
//     },

//     //subscription that user subscribes list
//     getUserSubscriptionList: async (stripeCustormerId: string) => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()
//             const subscriptionList = await stripe.subscriptions.list({
//                 // limit: 10,
//                 customer: stripeCustormerId
//             });

//             if (subscriptionList && subscriptionList?.data && subscriptionList?.data?.length > 0) {
//                 return showResponse(true, 'Subscription list get', subscriptionList?.data, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Empty subscription list', null, statusCodes.API_ERROR);
//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },
//     saveCardStripe: async (customer_id: string, token_id: string) => {
//         try {

//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()
//             const savecard = await stripe.customers.createSource(customer_id, { source: token_id });
//             if (savecard) {
//                 return showResponse(true, 'Card Saved Successfully', savecard, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Card Saved Request failed!!', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },
//     createStripeCustomer: async (userDetail: any) => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()
//             const createCustomer = await stripe.customers.create(
//                 {
//                     description: "created while subscribed",
//                     email: userDetail?.email,
//                     metadata: {
//                         first_name: (userDetail?.first_name) ?? "",
//                         _id: (userDetail?._id) ?? "",
//                     }
//                 }
//             );
//             return showResponse(true, 'Stripe user created', createCustomer, statusCodes.SUCCESS);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },
//     customerStripeSubscription: async (customer_id: string) => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()
//             const userSubscriptions: any = await stripe.subscriptions.list({
//                 customer: customer_id,
//             });
//             return showResponse(true, 'Subscription list found', userSubscriptions, statusCodes.SUCCESS);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     userDefaultSource: async (customer_id: string, card_id: string) => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()
//             const itemRes = await stripe.customers.update(customer_id, { default_source: card_id });
//             if (itemRes) {
//                 return showResponse(true, 'Card set as default source', itemRes, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Unable to set default source', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, 'Default source error occured!!', statusCodes.API_ERROR);
//         }
//     },

//     purchaseSubscriptionStripe: async (stripe_customer_id: string, price_id: string, add_trial_days: number = 0) => {
//         try {

//             const stripe: any = await UserSubscriptionHandler.initialiseStripe();

//             let subscription_options: any = {
//                 customer: stripe_customer_id,
//                 items: [{ price: price_id }],
//                 expand: ['latest_invoice.payment_intent'],
//             }

//             if (add_trial_days && add_trial_days > 0) {
//                 let numberOfTrialDays = add_trial_days;
//                 let trialPeriodEndDate = moment().add(numberOfTrialDays, 'days').endOf('day').unix();
//                 subscription_options.trial_end = trialPeriodEndDate;
//             }

//             const subscription = await stripe.subscriptions.create(subscription_options);
//             if (subscription) {
//                 return showResponse(true, 'Subscription Created Successfully', subscription, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Subscription Creation Request failed!!', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);

//         }
//     },
//     getStripePriceDetail: async (price_id: string) => {
//         try {
//             // Initialize Stripe client
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe();

//             // Retrieve price details from Stripe, including product details
//             const item = await stripe.prices.retrieve(price_id, {
//                 expand: ['product'], // Expanding the product details for more info
//             });
//             if (item) {
//                 return showResponse(true, 'Price detail retrieved successfully', item, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Invalid stripe plan detail', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     changeStripePlan: async (stripe_customer_id: string, new_price_id: string, old_subscription_id: string, addTrialMonths: number) => {
//         try {

//             // Fetch the subscription to check its status
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe();
//             const subscription = await stripe.subscriptions.retrieve(old_subscription_id);

//             // If the subscription is canceled, create a new one
//             if (subscription.status === 'canceled') {

//                 let subscription_options: any = {
//                     customer: stripe_customer_id,
//                     items: [{ price: new_price_id }],
//                     expand: ['latest_invoice.payment_intent'],
//                 }

//                 if (addTrialMonths && addTrialMonths > 0) {
//                     let trialPeriodEndDate = moment().add(addTrialMonths, 'days').endOf('day').unix();
//                     subscription_options.trial_end = trialPeriodEndDate;
//                 }

//                 const newSubscription = await stripe.subscriptions.create(subscription_options);


//                 return showResponse(true, 'Subscription Plan Updated (New Subscription Created)', newSubscription, statusCodes.SUCCESS);
//             }

//             // If the subscription is still active, update it as you originally intended
//             const subscriptionItemId = subscription.items.data[0].id;

//             let subscription_options: any = {
//                 items: [{
//                     id: subscriptionItemId,
//                     price: new_price_id
//                 }],
//                 proration_behavior: 'create_prorations',
//                 cancel_at_period_end: false
//             }

//             if (addTrialMonths && addTrialMonths > 0) {
//                 let trialPeriodEndDate = moment().add(addTrialMonths, 'days').endOf('day').unix();
//                 subscription_options.trial_end = trialPeriodEndDate;
//             }
//             console.log("✅ stripe change-plan : in create plan subscription_options :", subscription_options);
//             const updatedSubscription = await stripe.subscriptions.update(old_subscription_id, subscription_options);

//             return showResponse(true, 'Subscription Plan Updated Successfully', updatedSubscription, statusCodes.SUCCESS);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     getUserSubscriptionDetail: async (subscriptionId: string) => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe();
//             const itemRes = await stripe.subscriptions.retrieve(subscriptionId);
//             if (itemRes) {
//                 return showResponse(true, 'Subscription detail get successfully', itemRes, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Invalid subscription detail', null, statusCodes.API_ERROR);
//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     cancelUserSubscription: async (subscription_id: string) => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()

//             const subscriptionDelete = await stripe.subscriptions.del(subscription_id);
//             if (subscriptionDelete) {
//                 return showResponse(true, 'Subscription deleted Successfully', subscriptionDelete, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Error While Subscription delete ', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     cancelPlanTillEndPeriod: async (subscription_id: string) => {
//         try {
//             const stripe: any = await UserSubscriptionHandler.initialiseStripe()

//             const subscriptionCancel = await stripe.subscriptions.update(subscription_id, {
//                 cancel_at_period_end: true
//             });
//             if (subscriptionCancel) {
//                 return showResponse(true, 'Subscription Cancel Successfully', subscriptionCancel, statusCodes.SUCCESS);
//             }
//             return showResponse(false, 'Error While Subscription Cancel ', null, statusCodes.API_ERROR);

//         } catch (error: any) {
//             const errorMessage = error.raw ? error.raw.message : error.message;
//             return showResponse(false, errorMessage, null, statusCodes.API_ERROR);
//         }
//     },

//     stripeAllsubscriptions: async (userId: string): Promise<ApiResponse> => {
//         const userDetail = await userAuthModel.findOne({ _id: userId });
//         if (!userDetail) {
//             return showResponse(false, "Invalid user detail", null, statusCodes.API_ERROR)
//         }
//         if (!userDetail?.stripe_customer_id) {
//             return showResponse(false, "Please login again, customer stripe id missing", null, statusCodes.API_ERROR)
//         }

//         const getResponse: any = await UserSubscriptionHandler.getUserSubscriptionList(userDetail?.stripe_customer_id);
//         if (!getResponse.status) {
//             return showResponse(false, getResponse.message, null, statusCodes.API_ERROR)
//         }
//         return showResponse(true, getResponse.message, getResponse?.data, statusCodes.SUCCESS)
//     },

//     stripeWebhooks: async (event: any): Promise<ApiResponse> => {

//         try {

//             let stripeCustomerId = event?.data?.object?.customer;

//             let userDetail = await userAuthModel.findOne({ stripe_customer_id: stripeCustomerId });
//             if (userDetail) {

//                 const subscriptionObj = event.data.object;
//                 if (subscriptionObj.object == "subscription") {

//                     const validPrice = await UserSubscriptionHandler.getStripePriceDetail(subscriptionObj?.plan?.id);

//                     let package_name = (userDetail?.user_subscription?.package_name) ?? "stripe plan";
//                     if (validPrice.status && (validPrice?.data?.product?.name)) {
//                         package_name = validPrice?.data?.product?.name;
//                     }

//                     let updatedSubscriptionData = {

//                         'user_subscription.is_subscribed': (subscriptionObj?.status == "active" || subscriptionObj?.status == "trialing") ? 1 : 0,
//                         'user_subscription.stripe_subscription_id': subscriptionObj?.id,

//                         'user_subscription.purchased_in_device': "stripe",
//                         'user_subscription.package_name': package_name,
//                         'user_subscription.original_transaction_id': "",
//                         'user_subscription.android_order_id': "",
//                         'user_subscription.purchase_token': "",
//                         'user_subscription.cancelled_on_unix': 0,
//                         'user_subscription.trial_period_start_unix': (userDetail?.user_subscription?.trial_period_start_unix) ?? 0,
//                         'user_subscription.trial_period_end_unix': (userDetail?.user_subscription?.trial_period_end_unix) ?? 0,
//                         'user_subscription.purchased_on_unix': (subscriptionObj?.created) ?? moment().unix(),
//                         'user_subscription.next_payment_unix': subscriptionObj.current_period_end,
//                         'user_subscription.stripe_subscription_obj': subscriptionObj,
//                         'user_subscription.app_subscription_obj': {}
//                     }

//                     if (!subscriptionObj.cancel_at_period_end) { //false time have to remove canceled on unix
//                         updatedSubscriptionData['user_subscription.cancelled_on_unix'] = 0
//                     }

//                     if (subscriptionObj?.canceled_at) { //immediately cancel subscription
//                         updatedSubscriptionData['user_subscription.cancelled_on_unix'] = subscriptionObj?.canceled_at ?? 0
//                     }
//                     if (!(subscriptionObj?.cancel_at) && (subscriptionObj?.canceled_at)) { //immediately cancel subscription
//                         updatedSubscriptionData['user_subscription.cancelled_on_unix'] = subscriptionObj?.canceled_at ?? 0
//                     }

//                     const logData = {
//                         package_name: package_name,
//                         subscription_status: (subscriptionObj?.status),
//                         stripe_customer_id: stripeCustomerId,
//                         user_id: userDetail._id,
//                         type: "stripe",
//                         prev_user_subscription_obj: (userDetail?.user_subscription) ?? {},
//                         stripe_event: subscriptionObj
//                     }
//                     const addLogs = await userSusbriptionLogsModel.create(logData)
//                     if (!addLogs) {
//                         console.error("❌ Unable to add logs while stripe webhook time")
//                     }

//                     const updateUserSubscription = await userAuthModel.updateOne({ _id: userDetail._id }, updatedSubscriptionData);
//                     if (!updateUserSubscription) {
//                         console.error("❌ Unable to update subscription detail while stripe webhook")
//                         return showResponse(true, "Unable to update user subscription detail", updateUserSubscription, statusCodes.API_ERROR)
//                     }

//                     return showResponse(true, "Subscription detail updated successfully", null, statusCodes.SUCCESS)

//                     // switch (event.type) {
//                     //     case 'customer.subscription.created':
//                     //         break;
//                     //     case 'customer.subscription.deleted':
//                     //         break;
//                     //     case 'customer.subscription.paused':
//                     //         break;
//                     //     case 'customer.subscription.pending_update_applied':
//                     //         //have not any idea in this
//                     //         break;
//                     //     case 'customer.subscription.pending_update_expired':
//                     //         //have not any idea in this
//                     //         break;
//                     //     case 'customer.subscription.resumed':
//                     //         break;
//                     //     case 'customer.subscription.trial_will_end':
//                     //         break;
//                     //     case 'customer.subscription.updated':
//                     //         break;
//                     //     case 'subscription_schedule.aborted':
//                     //         const subscriptionScheduleAborted = event.data.object;
//                     //         // Then define and call a function to handle the event subscription_schedule.aborted
//                     //         break;
//                     //     case 'subscription_schedule.canceled':
//                     //         const subscriptionScheduleCanceled = event.data.object;
//                     //         // Then define and call a function to handle the event subscription_schedule.canceled
//                     //         break;
//                     //     case 'subscription_schedule.completed':
//                     //         const subscriptionScheduleCompleted = event.data.object;
//                     //         // Then define and call a function to handle the event subscription_schedule.completed
//                     //         break;
//                     //     case 'subscription_schedule.created':
//                     //         const subscriptionScheduleCreated = event.data.object;
//                     //         // Then define and call a function to handle the event subscription_schedule.created
//                     //         break;
//                     //     case 'subscription_schedule.expiring':
//                     //         const subscriptionScheduleExpiring = event.data.object;
//                     //         // Then define and call a function to handle the event subscription_schedule.expiring
//                     //         break;
//                     //     case 'subscription_schedule.released':
//                     //         const subscriptionScheduleReleased = event.data.object;
//                     //         // Then define and call a function to handle the event subscription_schedule.released
//                     //         break;
//                     //     case 'subscription_schedule.updated':
//                     //         const subscriptionScheduleUpdated = event.data.object;
//                     //         // Then define and call a function to handle the event subscription_schedule.updated
//                     //         break;
//                     //     // ... handle other event types
//                     //     default:
//                     //         console.log(`Unhandled event type ${event.type}`);
//                     // }

//                 }
//                 return showResponse(true, "Not a subscription event", null, statusCodes.SUCCESS)

//             } else {
//                 return showResponse(false, "Unable to find user detail", null, statusCodes.API_ERROR)
//             }
//         } catch (error) {
//             return showResponse(false, "Weebhook error occured", error, statusCodes.API_ERROR)
//         }
//     },

//     stripeDeleteSubscription: async (data: any, userId: string): Promise<ApiResponse> => {
//         let { subscription_id } = data;
//         const userDetail = await userAuthModel.findOne({ _id: userId });
//         if (!userDetail) {
//             return showResponse(false, "Invalid user detail", null, statusCodes.API_ERROR)
//         }
//         if (!userDetail?.stripe_customer_id) {
//             return showResponse(false, "Please login again, customer stripe id missing", null, statusCodes.API_ERROR)
//         }

//         const subscriptionDetail = await UserSubscriptionHandler.getUserSubscriptionDetail(subscription_id);
//         if (!subscriptionDetail?.status) {
//             return showResponse(false, subscriptionDetail?.message, null, statusCodes.API_ERROR)
//         }

//         if (subscriptionDetail?.data?.customer != userDetail?.stripe_customer_id) {
//             return showResponse(false, "Sorry you are not belong to this subscription", null, statusCodes.API_ERROR)
//         }

//         //Get all subscriptions to cancel all incase purchased multiple times
//         if (subscriptionDetail?.data?.status == "cancel") {
//             return showResponse(false, "Sorry this subscription has been already cancelled", null, statusCodes.API_ERROR)
//         }

//         const subscriptionCancel = await UserSubscriptionHandler.cancelUserSubscription(subscription_id);
//         if (!subscriptionCancel?.status) {
//             return showResponse(false, subscriptionCancel?.message, null, statusCodes.API_ERROR)
//         }

//         if (subscriptionCancel?.data?.canceled_at) {
//             const updateDetailObj = {
//                 'user_subscription.is_subscribed': 0,
//                 'user_subscription.cancelled_on_unix': (subscriptionCancel?.data?.cancel_at) ? subscriptionCancel?.data?.cancel_at : subscriptionCancel?.data?.cancel_at, //means deleted subscription
//                 'user_subscription.stripe_subscription_obj': subscriptionCancel?.data
//             }
//             const deleteSubscriptionDetail = await userAuthModel.updateOne({ _id: userDetail._id }, updateDetailObj);
//             if (!deleteSubscriptionDetail) {
//                 console.error("❌ Unable to update delete subscription detail");
//             }
//         }

//         return showResponse(true, subscriptionCancel?.message, subscriptionCancel?.data, statusCodes.SUCCESS)
//     },

//     stripeCancelPlanTillEndPeriod: async (data: any, userId: string): Promise<ApiResponse> => {
//         let { subscription_id } = data;
//         const userDetail = await userAuthModel.findOne({ _id: userId });
//         if (!userDetail) {
//             return showResponse(false, "Invalid user detail", null, statusCodes.API_ERROR)
//         }
//         if (!userDetail?.stripe_customer_id) {
//             return showResponse(false, "Please login again, customer stripe id missing", null, statusCodes.API_ERROR)
//         }

//         const subscriptionDetail = await UserSubscriptionHandler.getUserSubscriptionDetail(subscription_id);
//         if (!subscriptionDetail?.status) {
//             return showResponse(false, subscriptionDetail?.message, null, statusCodes.API_ERROR)
//         }

//         if (subscriptionDetail?.data?.customer != userDetail?.stripe_customer_id) {
//             return showResponse(false, "Sorry you are not belong to this subscription", null, statusCodes.API_ERROR)
//         }

//         //Get all subscriptions to cancel all incase purchased multiple times
//         if (subscriptionDetail?.data?.status == "cancel") {
//             return showResponse(false, "Sorry this subscription has been already cancelled", null, statusCodes.API_ERROR)
//         }

//         const subscriptionCancel = await UserSubscriptionHandler.cancelPlanTillEndPeriod(subscription_id);
//         if (!subscriptionCancel?.status) {
//             return showResponse(false, subscriptionCancel?.message, null, statusCodes.API_ERROR)
//         }

//         if (subscriptionCancel?.data?.canceled_at) {
//             const updateDetailObj = {
//                 'user_subscription.cancelled_on_unix': subscriptionCancel?.data?.canceled_at,
//                 'user_subscription.stripe_subscription_obj': subscriptionCancel?.data
//             }
//             const cancelupdateDetail = await userAuthModel.updateOne({ _id: userDetail._id }, updateDetailObj);
//             if (!cancelupdateDetail) {
//                 console.error("❌ Unable to update delete subscription detail");
//             }
//         }
//         return showResponse(true, subscriptionCancel?.message, subscriptionCancel?.data, statusCodes.SUCCESS)
//     },

//     stripeSubscribePlan: async (data: any, userId: string): Promise<ApiResponse> => {
//         let { token_id, plan_price_id } = data;

//         const userDetail = await userAuthModel.findOne({ _id: userId });
//         if (!userDetail) {
//             return showResponse(false, "Invalid user detail", null, statusCodes.API_ERROR)
//         }

//         if (userDetail?.user_subscription?.is_subscribed == 1 && userDetail?.user_subscription?.purchased_in_device != "stripe") {
//             let plateFormName = userDetail?.user_subscription?.purchased_in_device;
//             let msgRes = `You have already subscribed on ${plateFormName}`;
//             if (!plateFormName) {
//                 msgRes = `You have already provided free subscription`;
//             }
//             return showResponse(false, msgRes, null, statusCodes.API_ERROR)
//         }

//         const validPrice = await UserSubscriptionHandler.getStripePriceDetail(plan_price_id);
//         if (!validPrice.status) {
//             return showResponse(false, validPrice.message, null, statusCodes.API_ERROR)
//         }

//         let userSubscriptionsList: any[] = []; // Make sure to specify the type as an array of any items.
//         if (userDetail?.stripe_customer_id) {
//             const userSubscriptions: any = await UserSubscriptionHandler.customerStripeSubscription(userDetail?.stripe_customer_id);
//             if (userSubscriptions.status) {

//                 const allSubscriptions = userSubscriptions?.data;
//                 if (allSubscriptions?.data && Array.isArray(allSubscriptions.data) && allSubscriptions.data.length > 0) {
//                     userSubscriptionsList = allSubscriptions.data ?? []; // This ensures you have an empty array if data is null or undefined.

//                     // Filter for active or trialing subscriptions
//                     const activeOrTrialingSubscriptions = allSubscriptions.data.filter(
//                         (subscription: { 
//                             status: string,
//                             cancel_at?: number | null;
//                             canceled_at?: number | null;
//                          }) =>
//                             (subscription.status === 'active' || subscription.status === 'trialing') &&
//                             !subscription.cancel_at &&
//                             !subscription.canceled_at
//                     );

//                     if (activeOrTrialingSubscriptions.length > 0) {
//                         // If there is at least one active or trialing subscription
//                         return showResponse(false, "You have already subscribed on the Stripe side", null, statusCodes.API_ERROR);
//                     }
//                 }
//             } else {
//                 return showResponse(false, userSubscriptions.message, null, statusCodes.API_ERROR);
//             }

//         }


//         let stripeCustomerId = userDetail?.stripe_customer_id;
//         if (!userDetail?.stripe_customer_id) {
//             const createCustomer = await UserSubscriptionHandler.createStripeCustomer({ email: userDetail?.email, _id: userDetail?._id, first_name: userDetail?.first_name });
//             if (createCustomer.status) {
//                 stripeCustomerId = createCustomer?.data?.id;

//                 let updateUser = await userAuthModel.updateOne({ _id: userDetail._id }, {
//                     stripe_customer_id: stripeCustomerId,
//                 });
//                 if (!updateUser) {
//                     return showResponse(false, "Unable to update stripe customer id", null, statusCodes.API_ERROR)
//                 }

//             } else {
//                 return showResponse(false, createCustomer.message, null, statusCodes.API_ERROR)
//             }
//         }

//         //Add card process using token
//         const cardAdd = await UserSubscriptionHandler.saveCardStripe(stripeCustomerId, token_id);
//         if (!cardAdd.status || !(cardAdd?.data?.id)) {
//             return showResponse(false, cardAdd.message, null, statusCodes.API_ERROR)
//         }

//         //Add card as a default payment source for future recurring
//         let updateDefaultSource = await UserSubscriptionHandler.userDefaultSource(userDetail?.stripe_customer_id, cardAdd?.data?.id);
//         if (!updateDefaultSource?.status) {
//             return showResponse(false, updateDefaultSource.message, null, statusCodes.API_ERROR)
//         }

//         let addTrialDays = 0; //Add 0 or any positive number if dnot want to add
//         if (userDetail?.user_subscription?.trial_period_end_unix == 0) { //incase user have not take trial period
//             addTrialDays = 3; //add number of trial days
//         }


//         let subscription: any = {}
//         if (userSubscriptionsList.length > 0) {

//             const subscribePlan = await UserSubscriptionHandler.changeStripePlan(stripeCustomerId, plan_price_id, userSubscriptionsList?.[0]?.id, addTrialDays);
//             if (!subscribePlan?.status) {
//                 return showResponse(false, subscribePlan.message, null, statusCodes.API_ERROR)
//             }

//             subscription = (subscribePlan?.data) ?? {};

//         } else {
//             const subscribePlan = await UserSubscriptionHandler.purchaseSubscriptionStripe(stripeCustomerId, plan_price_id, addTrialDays);
//             if (!subscribePlan?.status) {
//                 return showResponse(false, subscribePlan.message, null, statusCodes.API_ERROR)
//             }
//             subscription = subscribePlan?.data;
//         }
//         if (!subscription) {
//             return showResponse(false, "Unable to subscribe plan", null, statusCodes.API_ERROR)
//         }


//         const package_name = (validPrice?.data?.product?.name) ?? "stripe-plan";
//         const logData = {
//             package_name: package_name,
//             subscription_status: (subscription?.status) + " initially",
//             stripe_customer_id: stripeCustomerId,
//             user_id: userDetail._id,
//             type: "stripe",
//             prev_user_subscription_obj: (userDetail?.user_subscription) ?? {},
//             stripe_event: subscription
//         }

//         const addLogs = await userSusbriptionLogsModel.create(logData)
//         if (!addLogs) {
//             console.error("❌ Unable to add logs while stripe initially purchased")
//         }

//         let updateData: any = {
//             'user_subscription.is_subscribed': (subscription?.status == "active" || subscription?.status == "trialing") ? 1 : 0,
//             'user_subscription.stripe_subscription_id': subscription?.id,

//             'user_subscription.purchased_in_device': "stripe",
//             'user_subscription.package_name': package_name,
//             'user_subscription.original_transaction_id': "",
//             'user_subscription.android_order_id': "",
//             'user_subscription.purchase_token': "",
//             'user_subscription.cancelled_on_unix': 0,
//             'user_subscription.trial_period_start_unix': (userDetail?.user_subscription?.trial_period_start_unix) ?? 0,
//             'user_subscription.trial_period_end_unix': (userDetail?.user_subscription?.trial_period_end_unix) ?? 0,
//             'user_subscription.initially_purchased_on_unix': (subscription?.created) ?? moment().unix(),
//             'user_subscription.purchased_on_unix': (subscription?.created) ?? moment().unix(),
//             'user_subscription.next_payment_unix': subscription.current_period_end,
//             'user_subscription.stripe_subscription_obj': subscription,
//             'user_subscription.app_subscription_obj': {}
//         };

//         if (subscription?.trial_start && subscription?.trial_end) {
//             updateData['user_subscription.trial_period_start_unix'] = subscription?.trial_start;
//             updateData['user_subscription.trial_period_end_unix'] = subscription?.trial_end;
//         }

//         const updateSubscription = await userAuthModel.updateOne({ _id: userDetail._id }, updateData);
//         if (!updateSubscription) {
//             return showResponse(false, "Unable to update subscription detail", null, statusCodes.API_ERROR)
//         }
//         return showResponse(true, "Plan subscribed successfully", updateSubscription, statusCodes.SUCCESS)

//     },

//     stripeDefaultCardUpdate: async (data: any, userId: string): Promise<ApiResponse> => {
//         let { token_id } = data;

//         const userDetail = await userAuthModel.findOne({ _id: userId });
//         if (!userDetail) {
//             return showResponse(false, "Invalid user detail", null, statusCodes.API_ERROR)
//         }

//         if (!userDetail?.stripe_customer_id) {
//             return showResponse(false, "Please login again, customer stripe id missing", null, statusCodes.API_ERROR)
//         }

//         //Add card process using token
//         const cardAdd = await UserSubscriptionHandler.saveCardStripe(userDetail?.stripe_customer_id, token_id);
//         if (!cardAdd.status || !(cardAdd?.data?.id)) {
//             return showResponse(false, cardAdd.message, null, statusCodes.API_ERROR)
//         }

//         //Add card as a default payment source for future recurring
//         let updateDefaultSource = await UserSubscriptionHandler.userDefaultSource(userDetail?.stripe_customer_id, cardAdd?.data?.id);
//         if (!updateDefaultSource?.status) {
//             return showResponse(false, updateDefaultSource.message, null, statusCodes.API_ERROR)
//         }
//         return showResponse(true, updateDefaultSource?.message, updateDefaultSource?.data, statusCodes.SUCCESS)
//     },

//     // **************************IN App Subscription purchase Methods ****************************************//

//     sleep: async (ms = 3000) => {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     },

//     // **************************Android IAP Methods ****************************************//

//     //*******At very first android will use this function, & for restore subscription time same function will use *****/
//     initialPurchasedAndroidSubscription: async (data: any, user_id: string): Promise<ApiResponse> => {

//         try {
//             const { plan_name, purchase_token } = data;

//             const queryObj = {
//                 _id: { $ne: commonHelper.convertToObjectId(user_id) },
//                 'user_subscription.purchase_token': purchase_token,
//                 status: { $ne: USER_STATUS.DELETED }
//             }
//             // Check if the subscription already exists
//             const existingSubscription = await userAuthModel.findOne(queryObj);
//             if (existingSubscription) {
//                 return showResponse(false, `Subscription already purchased and linked with ${existingSubscription?.email}`, null, statusCodes.API_ERROR);
//             }


//             let userDetail = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(user_id), status: USER_STATUS.ACTIVE });
//             if (!userDetail) {
//                 return showResponse(false, `Invalid user detail`, null, statusCodes.API_ERROR);
//             }

//             const packageName = ANDROID_SUBSCRIPTION_DATA.SUBSCRIPTION_APN; //com. related
//             const subscriptionId = plan_name; //this is actually plan-name like monthly yearly

//             const receipt: any = {
//                 packageName: packageName,
//                 productId: subscriptionId,
//                 purchaseToken: purchase_token,
//             };
//             console.log("✅ >>>>>>. receipt:::::::::::::: ", receipt)
            
//             const receiptDecode = await verifier.verifySub(receipt)

//             console.log("✅ >>>>>>. receiptDecode:::::::::::::: ", receiptDecode)

//             let expirationDateUnix = 0;
//             let purchaseDateUnix = moment().unix();
//             let appSubscriptionObj: any = {
//                 receiptDecode: receiptDecode
//             };

//             if (receiptDecode?.payload) {
//                 const purchaseDate: any = receiptDecode.payload?.startTimeMillis;
//                 const expirationDate: any = receiptDecode.payload?.expiryTimeMillis;

//                 purchaseDateUnix = purchaseDate && purchaseDate.toString().length === 13
//                     ? Math.floor(purchaseDate / 1000)
//                     : 0;

//                 expirationDateUnix = expirationDate && expirationDate.toString().length === 13
//                     ? Math.floor(expirationDate / 1000)
//                     : 0;

//                 if (moment().unix() > expirationDateUnix) {
//                     //this is for restore subscription time
//                     return showResponse(false, "You have already expired subscription", { detail: receiptDecode }, statusCodes.API_ERROR);
//                 }
//             }

//             const createLogObj: any = {
//                 package_name: plan_name,
//                 subscription_status: "SUBSCRIBED INITIALLY",
//                 user_id,
//                 type: "android",
//                 android_event: { receiptDecode: receiptDecode },
//                 prev_user_subscription_obj: (userDetail?.user_subscription) ?? {},
//             }

//             console.log("createLogObj ::>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", createLogObj);

//             // Prepare subscription data
//             const updateSubscriptionData: any = {
//                 'user_subscription.is_subscribed': 1,
//                 'user_subscription.stripe_subscription_id': "",
//                 'user_subscription.purchased_in_device': 'android',
//                 'user_subscription.package_name': plan_name,
//                 'user_subscription.original_transaction_id': "",
//                 'user_subscription.android_order_id': (receiptDecode?.payload?.orderId) ?? "",
//                 'user_subscription.purchase_token': purchase_token,
//                 'user_subscription.cancelled_on_unix': 0,
//                 'user_subscription.trial_period_start_unix': (userDetail?.user_subscription?.trial_period_start_unix) ?? 0,
//                 'user_subscription.trial_period_end_unix': (userDetail?.user_subscription?.trial_period_end_unix) ?? 0,
//                 'user_subscription.initially_purchased_on_unix': moment().unix(),
//                 'user_subscription.purchased_on_unix': purchaseDateUnix,
//                 'user_subscription.next_payment_unix': expirationDateUnix,
//                 'user_subscription.stripe_subscription_obj': {},
//                 'user_subscription.app_subscription_obj': appSubscriptionObj,
//             };
//             console.log("✅ Android initially updateSubscriptionData :: ", updateSubscriptionData)

//             //Possible values are: 0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade
//             if (receiptDecode?.payload?.paymentState == 2) {
//                 updateSubscriptionData['user_subscription.trial_period_start_unix'] = purchaseDateUnix;
//                 updateSubscriptionData['user_subscription.trial_period_end_unix'] = expirationDateUnix;
//             }

//             // Update User Model With Subscription Data
//             const response = await userAuthModel.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, updateSubscriptionData);
//             if (!response) {
//                 return showResponse(false, "Unable to update initial update subscription detail", null, statusCodes.API_ERROR);
//             }

//             const addLogs = await userSusbriptionLogsModel.create(createLogObj);
//             if (!addLogs) {
//                 console.error("❌ Unable to save andoid logs.......")
//             }
//             return showResponse(true, "Initial purchased in android successfully", null, statusCodes.SUCCESS);

//         } catch (error) {
//             console.error("❌ Initial android purchased error occured ", error)
//             return showResponse(false, "Initial android purchased error occured", error, statusCodes.API_ERROR)
//         }
//     },

//     //***** Function Used To save android Subscription Logs In database ****** */
//     saveAndroidSubscriptionLogs: async (decoded_data: any, subscriptionData: any) => {
//         try {

//             const notification_type = decoded_data?.subscriptionNotification?.notificationType;
//             const subscription_id = decoded_data?.subscriptionNotification?.subscriptionId;
//             const purchase_token = decoded_data?.subscriptionNotification?.purchaseToken;


//             console.log("✅ saveAndroidSubscriptionLogs coming :::: ", notification_type, subscription_id, " purchase_token : ", purchase_token)

//             let getUserDetails = await userAuthModel.findOne({ 'user_subscription.purchase_token': purchase_token, status: { $ne: USER_STATUS.DELETED } }); //not deleted

//             console.log("*USER ID*********", getUserDetails?._id);
//             console.log("*saveSubscriptionWebhookLogAndroid purchaseToken*********", purchase_token);

//             if (!getUserDetails?._id) {
//                 console.log("User not found, retrying in 3 seconds...");
//                 await UserSubscriptionHandler.sleep(4000); // Delay of 3 seconds

//                 getUserDetails = await userAuthModel.findOne({ 'user_subscription.purchase_token': purchase_token, status: { $ne: USER_STATUS.DELETED } });

//                 console.log("*After Delay USER ID*********", getUserDetails?._id);
//                 console.log("*After Delay purchaseToken*********", purchase_token);
//             }

//             const subscriptionKey = Object.keys(ANDROID_SUBS_NOTI_TYPE).find(key => ANDROID_SUBS_NOTI_TYPE[key] === notification_type);//get subs-status by name
//             // If no key is found, set subscriptionKey to an empty string
//             const logSubscriptionKey = subscriptionKey || "";

//             const log_data: any = {
//                 package_name: subscription_id,
//                 subscription_status: notification_type + " - " + logSubscriptionKey,
//                 type: "android",
//                 android_event: {
//                     notificaiton_type: notification_type,
//                     package_data: decoded_data,
//                     response_data: subscriptionData,
//                 }
//             }

//             if (getUserDetails) {
//                 const user_id = getUserDetails?._id;

//                 log_data.user_id = user_id;
//                 log_data.prev_user_subscription_obj = (getUserDetails?.user_subscription) ?? {};

//                 const addLog = await userSusbriptionLogsModel.create(log_data);
//                 if (!addLog) {
//                     console.error("❌ Unable to save android subscription log");
//                 }

//                 const latest_purchased_on = decoded_data?.eventTimeMillis;
//                 let purchasedOnUnix = parseInt(latest_purchased_on);

//                 purchasedOnUnix = purchasedOnUnix && purchasedOnUnix.toString().length === 13
//                     ? Math.floor(purchasedOnUnix / 1000)
//                     : purchasedOnUnix;

//                 /*********Check notificaiton type and updated data in user DB *******/

//                 if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_PURCHASED ||
//                     notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_RESTARTED ||
//                     notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_RENEWED) {

//                     if (subscriptionData?.payload?.acknowledgementState == 1) {

//                         const startTimeMillis = parseInt(subscriptionData?.payload?.startTimeMillis);
//                         const startTimeUnix = startTimeMillis && startTimeMillis.toString().length === 13
//                             ? Math.floor(startTimeMillis / 1000)
//                             : startTimeMillis;

//                         const expiryTimeMillis = parseInt(subscriptionData?.payload?.expiryTimeMillis);
//                         const nextPaymentUnix = expiryTimeMillis && expiryTimeMillis.toString().length === 13
//                             ? Math.floor(expiryTimeMillis / 1000)
//                             : expiryTimeMillis;

//                         const updateSubObj: any = {
//                             'user_subscription.is_subscribed': 1,
//                             'user_subscription.stripe_subscription_id': "",
//                             'user_subscription.purchased_in_device': "android",
//                             'user_subscription.package_name': subscription_id,
//                             'user_subscription.original_transaction_id': "",
//                             'user_subscription.android_order_id': (subscriptionData?.payload?.orderId) ?? "",
//                             'user_subscription.purchase_token': purchase_token,
//                             'user_subscription.cancelled_on_unix': 0,
//                             'user_subscription.purchased_on_unix': startTimeUnix,
//                             'user_subscription.next_payment_unix': nextPaymentUnix,
//                             'user_subscription.stripe_subscription_obj': {},
//                             'user_subscription.app_subscription_obj': {
//                                 notificaiton_type: notification_type,
//                                 package_data: decoded_data,
//                                 response_data: subscriptionData,
//                             }
//                         }
//                         //0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade
//                         if (subscriptionData?.payload?.paymentState == 2) {
//                             updateSubObj['user_subscription.trial_period_start_unix'] = startTimeUnix;
//                             updateSubObj['user_subscription.trial_period_end_unix'] = nextPaymentUnix;
//                         }
//                         const update_user = await userAuthModel.updateOne({ _id: user_id }, updateSubObj);
//                         if (update_user) {
//                             console.log(`✅ *******USER SUBSCRIPNTION UPDATED IN USER INFO**************`)
//                             return showResponse(true, "subscription renewal success", null, statusCodes.SUCCESS);
//                         }
//                         console.log(`❌ *******Unable to update android subscribed detail**************`)
//                         return showResponse(false, "Unable to renew subscription at the moment", null, statusCodes.SUCCESS);
//                     }
//                     console.error("❌ android subscription acknowledgementState is not 1");

//                 }
//                 else if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_CANCELED
//                     || notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_REVOKED
//                     || notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_EXPIRED) {

//                     const updateSubObj: any = {
//                         'user_subscription.cancelled_on_unix': purchasedOnUnix,
//                         'user_subscription.purchase_token': "",
//                         'user_subscription.app_subscription_obj': {
//                             notificaiton_type: notification_type,
//                             package_data: decoded_data,
//                             response_data: subscriptionData,
//                         },
//                     }
//                     if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_EXPIRED) { //inthis case never come bcz removed purchase-token
//                         updateSubObj['user_subscription.is_subscribed'] = 0;
//                     }

//                     const update_user = await userAuthModel.updateOne({ _id: user_id }, updateSubObj);
//                     if (update_user) {
//                         console.log(`✅ *******USER SUBSCRIPNTION UPDATED IN USER info(for cancel)**************`)
//                         return showResponse(true, "✅ Operation performed successfully", null, statusCodes.SUCCESS);
//                     }
//                     console.error(`❌ *******Unable to update android subscription cancel detail**************`)
//                 }
//                 return showResponse(true, "✅ log added success", null, statusCodes.SUCCESS);
//             } else {
//                 console.log("❌ Android log added without userId")
//                 const result = await userSusbriptionLogsModel.create(log_data);
//                 return showResponse(true, "❌ Android log added without userId", result, statusCodes.SUCCESS);
//             }

//         } catch (error: any) {
//             return showResponse(false, error?.message ? error?.message : error, null, statusCodes.SUCCESS);
//         }
//     },

//     //*****Decode Messages From Play Store Subscription Notifications ****** */
//     decodeAndroidSubscriptionMessage: async (data: any) => {
//         try {
//             const decoded_data = JSON.parse(Buffer.from(data, 'base64').toString());
//             console.log(
//                 "✅ decoded_data?.subscriptionNotification?.subscriptionId ", decoded_data?.subscriptionNotification?.subscriptionId,
//                 "✅ decoded_data?.subscriptionNotification?.purchaseToken ", decoded_data?.subscriptionNotification?.purchaseToken,
//             )
//             const receipt: any = {
//                 // packageName: 'com.subscriptiondemosts',
//                 // productId: decoded_data?.subscriptionNotification?.subscriptionId,
//                 // purchaseToken: decoded_data?.subscriptionNotification?.purchaseToken,
//                 packageName: ANDROID_SUBSCRIPTION_DATA.SUBSCRIPTION_APN,
//                 productId: decoded_data?.subscriptionNotification?.subscriptionId,
//                 purchaseToken: decoded_data?.subscriptionNotification?.purchaseToken,
//             };

//             const subscriptionData = await verifier.verifySub(receipt)

//             if (subscriptionData) {
//                 console.log("✅ Android webhook_subscriptionData >>>>>>... ", subscriptionData)
//                 await UserSubscriptionHandler.saveAndroidSubscriptionLogs(decoded_data, subscriptionData)
//             }
//         } catch (error: any) {
//             console.error('❌ Decoded message Error:::::::::::::::::::::::::::::::', error);
//             return showResponse(false, error?.message ? error?.message : error, null, statusCodes.SUCCESS);
//         }
//     },


//     // **************************iOS IAP Methods ****************************************//

//     //***** At initial iOS purchase time use this function to extract subscription detail like expiry & product-id ****** */
//     validateReceipt: async (receiptData: any): Promise<any> => {
//         try {
//             const sharedSecret: any = process.env.SHARED_SECRET;
//             const sharedSecretMode: any = process.env.SHARED_SECRET_MODE;

//             appleReceiptVerify.config({
//                 secret: sharedSecret,
//                 environment: [sharedSecretMode] // or 'production' depending on the environment
//             });
//             const payload: any = {
//                 'receipt': receiptData,
//                 'password': sharedSecret
//             };

//             const response: any = await appleReceiptVerify.validate(payload);
//             console.log(response, 'responseData==============')
//             if (response?.length > 0) {
//                 return response;
//             } else {
//                 return [];
//             }
//         } catch (error) {
//             console.error('Error during receipt validation:', error);
//         }
//     },

//     //***** Function Used To save iOS Subscription Logs In database ****** */
//     iosSubscriptionWebhook: async (data: any): Promise<ApiResponse> => {

//         try {

//             let signedPayload = data?.signedPayload;
//             const notification_data: any = await decodeNotificationPayload(signedPayload);
//             if (notification_data) {

//                 let renewalInfo: any = await decodeRenewalInfo(notification_data?.data?.signedRenewalInfo);

//                 let transactionInfo: any;
//                 if (Array.isArray(notification_data?.data?.signedTransactionInfo)) {
//                     // If it's an array, use decodeTransactions
//                     console.log(">>>>>>>>>>>> In array check<<<<<<<<<<<<<<")
//                     transactionInfo = await decodeTransactions(notification_data?.data?.signedTransactionInfo);
//                 } else {
//                     console.log(">>>>>>>>>>>> In single value<<<<<<<<<<<<<<")
//                     // If it's a single transaction, use decodeTransaction
//                     transactionInfo = await decodeTransaction(notification_data?.data?.signedTransactionInfo);
//                 }

//                 console.log("********renewalInfo saveSubscriptionWebhookLogIOS Start ************")
//                 console.log("renewalInfo >>>> ", renewalInfo)
//                 console.log("********renewalInfo saveSubscriptionWebhookLogIOS Ended ************")

//                 if (renewalInfo) {


//                     let user_id = null
//                     let userDetails = await userAuthModel.findOne({
//                         status: { $ne: USER_STATUS.DELETED }, 'user_subscription.original_transaction_id': renewalInfo?.originalTransactionId
//                     })

//                     console.log("User-id >>>>>>>>>>>>> ", userDetails?._id)
//                     console.log("originalTransactionId >>>>>>>>>>>>> ", renewalInfo?.originalTransactionId)
//                     if (!userDetails?._id) {
//                         console.log("iOS User not found, retrying in 3 seconds...");

//                         await UserSubscriptionHandler.sleep(4000);

//                         userDetails = await userAuthModel.findOne({
//                             status: { $ne: USER_STATUS.DELETED }, 'user_subscription.original_transaction_id': renewalInfo?.originalTransactionId
//                         })

//                         console.log("*After Delay USER ID*********", userDetails?._id);
//                         console.log("*After Delay originalTransactionId*********", renewalInfo?.originalTransactionId);
//                     }

//                     user_id = userDetails?._id;

//                     const data: any = {
//                         type: "ios",
//                         entire_data: notification_data,
//                         renewalInfo: renewalInfo,
//                         transactionInfo: transactionInfo
//                     }
//                     data.renewalInfo.notificaiton_type = notification_data?.notificationType;
//                     data.renewalInfo.notificaiton_sub_type = notification_data?.subtype;

//                     const subs_logs: any = {
//                         original_transaction_id: renewalInfo?.originalTransactionId,
//                         package_name: renewalInfo?.autoRenewProductId,
//                         subscription_status: notification_data.notificationType + ", " + ((notification_data?.subtype) ?? ""),
//                         type: "ios",
//                         ios_event: data,

//                     }
//                     if (userDetails?._id) {
//                         subs_logs.user_id = user_id;
//                         subs_logs.prev_user_subscription_obj = (userDetails?.user_subscription) ?? {};
//                     }

//                     const saveLogs = await userSusbriptionLogsModel.create(subs_logs);
//                     if (!saveLogs) {
//                         console.error("Unable to save logs of ios webhook>>>>>>>>>>>>>>>>>>")
//                     }

//                     if (notification_data.notificationType == "DID_RENEW" || notification_data.notificationType == "DID_CHANGE_RENEWAL_PREF" ||
//                         notification_data.notificationType == "SUBSCRIBED" ||
//                         (notification_data.notificationType == "DID_CHANGE_RENEWAL_STATUS" && notification_data.subtype == "AUTO_RENEW_ENABLED")) {

//                         console.log("inside DID_RENEW iosSubscriptionWebhook>>>>>>>>>>>>>>>>>>>>>>");

//                         if (user_id) {

//                             const nextPaymentUnix = renewalInfo?.renewalDate && renewalInfo.renewalDate.toString().length === 13
//                                 ? Math.floor(renewalInfo.renewalDate / 1000)
//                                 : renewalInfo?.renewalDate;

//                             let purchasedOnUnix = moment().unix();

//                             if (transactionInfo?.purchaseDate) {
//                                 purchasedOnUnix = transactionInfo?.purchaseDate && transactionInfo.purchaseDate.toString().length === 13
//                                     ? Math.floor(transactionInfo.purchaseDate / 1000)
//                                     : transactionInfo?.purchaseDate;
//                             }


//                             // 'user_subscription.initially_purchased_on_unix': moment().unix() : No need to update this, this is just for initial time
//                             const updateSubscriptionObj: any = {
//                                 'user_subscription.is_subscribed': 1,
//                                 'user_subscription.stripe_subscription_id': "",
//                                 'user_subscription.purchased_in_device': "ios",
//                                 'user_subscription.package_name': renewalInfo?.autoRenewProductId,
//                                 'user_subscription.original_transaction_id': renewalInfo?.originalTransactionId,
//                                 'user_subscription.android_order_id': "",
//                                 'user_subscription.purchase_token': "",
//                                 'user_subscription.cancelled_on_unix': 0,
//                                 'user_subscription.purchased_on_unix': purchasedOnUnix,
//                                 'user_subscription.next_payment_unix': nextPaymentUnix,
//                                 'user_subscription.stripe_subscription_obj': {},
//                                 'user_subscription.app_subscription_obj': data
//                             }

//                             if (transactionInfo?.offerDiscountType && transactionInfo?.offerDiscountType == "FREE_TRIAL") {

//                                 const trialStartDateUnix = transactionInfo?.purchaseDate && transactionInfo.purchaseDate.toString().length === 13
//                                     ? Math.floor(transactionInfo.purchaseDate / 1000)
//                                     : transactionInfo?.purchaseDate;

//                                 const trialEndDateUnix = transactionInfo?.expiresDate && transactionInfo.expiresDate.toString().length === 13
//                                     ? Math.floor(transactionInfo.expiresDate / 1000)
//                                     : transactionInfo?.expiresDate;

//                                 if (trialStartDateUnix && trialEndDateUnix) {
//                                     updateSubscriptionObj['user_subscription.trial_period_start_unix'] = trialStartDateUnix;
//                                     updateSubscriptionObj['user_subscription.trial_period_end_unix'] = trialEndDateUnix;
//                                 }
//                             }
//                             await userAuthModel.updateOne({ _id: user_id }, updateSubscriptionObj)
//                         }

//                     }
//                     else if ((notification_data.notificationType == "DID_CHANGE_RENEWAL_STATUS" && notification_data.subtype == "AUTO_RENEW_DISABLED")
//                         || notification_data.notificationType == "EXPIRED") {
//                         console.log("inside AUTO_RENEW_DISABLED iosSubscriptionWebhook>>>>>>>>>>>>>>>>>>>>>>");

//                         if (user_id) {
//                             const cancelPaymentUnix = renewalInfo?.signedDate && renewalInfo.signedDate.toString().length === 13
//                                 ? Math.floor(renewalInfo.signedDate / 1000)
//                                 : renewalInfo?.signedDate;

//                             const updateSubscriptionObj: any = {
//                                 'user_subscription.original_transaction_id': "",
//                                 'user_subscription.cancelled_on_unix': cancelPaymentUnix,
//                                 'user_subscription.app_subscription_obj': data
//                             }
//                             if (notification_data.notificationType == "EXPIRED") {
//                                 updateSubscriptionObj['user_subscription.is_subscribed'] = 0;
//                             }
//                             await userAuthModel.updateOne({ _id: user_id }, updateSubscriptionObj)
//                         }
//                     } else {
//                         console.error("iOS no handeled this subscription event: notificationType", notification_data?.notificationType, " Sub-type : ", notification_data?.subtype)
//                     }
//                     return showResponse(true, "Ios webhook log saved successfully", null, statusCodes.SUCCESS)
//                 }
//                 else {
//                     return showResponse(false, "Renewal information get data error occured", null, statusCodes.API_ERROR)
//                 }
//             } else {
//                 return showResponse(false, "Decode payload error occured", null, statusCodes.API_ERROR)
//             }
//         } catch (error) {
//             return showResponse(false, "Weebhook error occured", error, statusCodes.API_ERROR)
//         }
//     },

//     //*******At very first iOS will use this function, & for restore subscription time same function will use *****/
//     initialPurchasedIosSubscription: async (data: any, user_id: string): Promise<ApiResponse> => {

//         try {
//             const { original_transaction_id, package_name, signedPayload } = data;

//             console.log("✅ >>>>>>>>>>>>>>. purchaseSubscriptionIos", {
//                 original_transaction_id, package_name
//             })

//             const queryObj = {
//                 _id: { $ne: commonHelper.convertToObjectId(user_id) },
//                 'user_subscription.original_transaction_id': original_transaction_id,
//                 status: { $ne: USER_STATUS.DELETED }
//             }
//             // Check if the subscription already exists
//             const existingSubscription = await userAuthModel.findOne(queryObj);
//             if (existingSubscription) {
//                 return showResponse(false, `Subscription already purchased and linked with ${existingSubscription?.email}`, null, statusCodes.API_ERROR);
//             }

//             let userDetail = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(user_id), status: USER_STATUS.ACTIVE });
//             if (!userDetail) {
//                 return showResponse(false, `Invalid user detail`, null, statusCodes.API_ERROR);
//             }

//             let expirationDateUnix = 0;
//             let purchaseDateUnix = moment().unix();
//             let appSubscriptionObj: any = {};

//             let packageName = package_name;
//             let originalTransactionId = original_transaction_id;

//             const validateReceiptData = await UserSubscriptionHandler.validateReceipt(signedPayload);
//             console.log("✅ validateReceiptData :::>>>>> ", validateReceiptData)
//             if (validateReceiptData.length > 0) {
//                 const indData = (validateReceiptData.length) -1;
                
//                 const purchaseDate = validateReceiptData[indData]?.purchaseDate;
//                 const expirationDate = validateReceiptData[indData]?.expirationDate;

//                 purchaseDateUnix = purchaseDate && purchaseDate.toString().length === 13
//                     ? Math.floor(purchaseDate / 1000)
//                     : 0;

//                 expirationDateUnix = expirationDate && expirationDate.toString().length === 13
//                     ? Math.floor(expirationDate / 1000)
//                     : 0;

//                 appSubscriptionObj.receipt_detail = validateReceiptData;

//                 packageName = validateReceiptData[indData]?.productId;
//                 originalTransactionId = validateReceiptData[indData]?.originalTransactionId;


//                 if (moment().unix() > expirationDateUnix) {
//                     //this is for restore subscription time
//                     return showResponse(false, "You have already expired subscription", { detail: validateReceiptData }, statusCodes.API_ERROR);
//                 }
//             }

//             const createLogObj: any = {
//                 original_transaction_id: originalTransactionId,
//                 package_name:packageName,
//                 subscription_status: "SUBSCRIBED INITIALLY",
//                 user_id,
//                 type: "ios",
//                 ios_event: { receipt_detail: validateReceiptData },
//                 prev_user_subscription_obj: (userDetail?.user_subscription) ?? {}
//             }

//             console.log("✅ createLogObj ::>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", createLogObj);

//             // Prepare subscription data
//             const updateSubscriptionData = {
//                 'user_subscription.is_subscribed': 1,
//                 'user_subscription.stripe_subscription_id': "",
//                 'user_subscription.purchased_in_device': 'ios',
//                 'user_subscription.package_name': packageName,
//                 'user_subscription.original_transaction_id': originalTransactionId,
//                 'user_subscription.android_order_id': '',
//                 'user_subscription.purchase_token': '',
//                 'user_subscription.cancelled_on_unix': 0,
//                 'user_subscription.trial_period_start_unix': (userDetail?.user_subscription?.trial_period_start_unix) ?? 0,
//                 'user_subscription.trial_period_end_unix': (userDetail?.user_subscription?.trial_period_end_unix) ?? 0,
//                 'user_subscription.initially_purchased_on_unix': moment().unix(),
//                 'user_subscription.purchased_on_unix': purchaseDateUnix,
//                 'user_subscription.next_payment_unix': expirationDateUnix,
//                 'user_subscription.stripe_subscription_obj': {},
//                 'user_subscription.app_subscription_obj': appSubscriptionObj,
//             };
//             console.log("updateSubscriptionData ✅ ", updateSubscriptionData)

//             // Update User Model With Subscription Data
//             const response = await userAuthModel.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, updateSubscriptionData);
//             if (!response) {
//                 return showResponse(false, "Unable to update initial update subscription detail", null, statusCodes.API_ERROR);
//             }

//             const addLogs = await userSusbriptionLogsModel.create(createLogObj);
//             if (!addLogs) {
//                 console.error("❌ Unable to save ios logs.......")
//             }
//             return showResponse(true, "Initial purchased in ios successfully", null, statusCodes.SUCCESS);

//         } catch (error) {
//             console.error("❌ Initial ios purchased error occured :: ", error)
//             return showResponse(false, "Initial ios purchased error occured", error, statusCodes.API_ERROR)
//         }
//     },

//     appSubscriptionPlan: async (): Promise<ApiResponse> => {
//         const getResponse = await subscriptionPlans.find({});
//         if (getResponse.length < 1) {
//             return showResponse(false, "Empty plan list", null, statusCodes.API_ERROR)
//         }
//         return showResponse(true, "Plan list get successfully", getResponse, statusCodes.SUCCESS)
//     },
// }

// export default UserSubscriptionHandler 
