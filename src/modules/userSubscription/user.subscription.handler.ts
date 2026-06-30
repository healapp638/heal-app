import moment from "moment";
import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import * as commonHelper from "../../helpers/common.helper";
import userAuthModel from "../UserAuth/user.auth.model";
import userSusbriptionLogsModel from "./user.subscriptionLogs.model";
import subscriptionPlans from "./user.subscriptionPlans.model";
import statusCodes from '../../constants/statusCodes'
//*****Following part used for the subscription *************/
import { decodeRenewalInfo, decodeTransactions, decodeNotificationPayload, decodeTransaction } from "app-store-server-api";
import appleReceiptVerify from 'node-apple-receipt-verify';
import Verifier from "google-play-billing-validator";
import ab1AndroidSubscriptionFile from '../../../public/androidCerts/androidInAppPurchase.json'
import { USER_STATUS } from "../../constants/workflow.constant";

console.log("✅ ab1 subscription file email >>>>>>>>>>>>>> ", ab1AndroidSubscriptionFile?.client_email)
const options = {
    email: String(ab1AndroidSubscriptionFile.client_email),
    key: String(ab1AndroidSubscriptionFile.private_key)
};
const verifier = new Verifier(options); //verifier instance 

const ANDROID_SUBSCRIPTION_DATA = { //FOR ANDROID
    SUBSCRIPTION_APN: process.env.SUBSCRIPTION_APN,
    SUBSCRIPTION_NAME: process.env.SUBSCRIPTION_NAME,
};

const ANDROID_SUBS_NOTI_TYPE: any = {
    SUBSCRIPTION_RECOVERED: 1,
    SUBSCRIPTION_RENEWED: 2,
    SUBSCRIPTION_CANCELED: 3,
    SUBSCRIPTION_PURCHASED: 4,
    SUBSCRIPTION_ON_HOLD: 5,
    SUBSCRIPTION_IN_GRACE_PERIOD: 6,
    SUBSCRIPTION_RESTARTED: 7,
    SUBSCRIPTION_PRICE_CHANGE_CONFIRMED: 8,
    SUBSCRIPTION_DEFERRED: 9,
    SUBSCRIPTION_PAUSED: 10,
    SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED: 11,
    SUBSCRIPTION_REVOKED: 12,
    SUBSCRIPTION_EXPIRED: 13
};

const UserSubscriptionHandler = {
    // **************************IN App Subscription purchase Methods ****************************************//

    sleep: async (ms = 3000) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // **************************Android IAP Methods ****************************************//

    //*******At very first android will use this function, & for restore subscription time same function will use *****/
    initialPurchasedAndroidSubscription: async (data: any, user_id: string): Promise<ApiResponse> => {

        try {
            const { plan_name, purchase_token } = data;
            console.log(data, "initialPurchasedAndroidSubscription")

            const queryObj = {
                _id: { $ne: commonHelper.convertToObjectId(user_id) },
                'user_subscription.purchase_token': purchase_token,
                status: { $ne: USER_STATUS.DELETED }
            }
            // Check if the subscription already exists
            const existingSubscription = await userAuthModel.findOne(queryObj);
            if (existingSubscription) {
                return showResponse(false, `Subscription already purchased and linked with ${existingSubscription?.email}`, null, statusCodes.API_ERROR);
            }

            const userDetail: any = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(user_id), status: USER_STATUS.ACTIVE });
            if (!userDetail) {
                return showResponse(false, `Invalid user detail`, null, statusCodes.API_ERROR);
            }

            const packageName = ANDROID_SUBSCRIPTION_DATA.SUBSCRIPTION_APN; //com. related
            const subscriptionId = plan_name; //this is actually plan-name like monthly yearly

            const receipt: any = {
                packageName: packageName,
                productId: subscriptionId,
                purchaseToken: purchase_token,
            };
            console.log("✅ >>>>>>. receipt:::::::::::::: ", receipt)

            const receiptDecode = await verifier.verifySub(receipt)

            // console.log("✅ >>>>>>. receiptDecode:::::::::::::: ", receiptDecode)

            let expirationDateUnix = 0;
            let purchaseDateUnix = moment().unix();
            const appSubscriptionObj: any = {
                receiptDecode: receiptDecode
            };

            if (receiptDecode?.payload) {
                const purchaseDate: any = receiptDecode.payload?.startTimeMillis;
                const expirationDate: any = receiptDecode.payload?.expiryTimeMillis;

                purchaseDateUnix = purchaseDate && purchaseDate.toString().length === 13
                    ? Math.floor(purchaseDate / 1000)
                    : 0;

                expirationDateUnix = expirationDate && expirationDate.toString().length === 13
                    ? Math.floor(expirationDate / 1000)
                    : 0;

                if (moment().unix() > expirationDateUnix) {
                    //this is for restore subscription time
                    return showResponse(false, "You have already expired subscription", { detail: receiptDecode }, statusCodes.API_ERROR);
                }
            }

            const createLogObj: any = {
                package_name: plan_name,
                subscription_status: "SUBSCRIBED INITIALLY",
                user_id,
                type: "android",
                android_event: { receiptDecode: receiptDecode },
                prev_user_subscription_obj: (userDetail?.user_subscription) ?? {},
            }

            // console.log("createLogObj ::>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", createLogObj);

            // Prepare subscription data
            const updateSubscriptionData: any = {
                'user_subscription.is_subscribed': 1,
                'user_subscription.stripe_subscription_id': "",
                'user_subscription.purchased_in_device': 'android',
                'user_subscription.package_name': plan_name,
                'user_subscription.subscribed_price': (receiptDecode?.payload?.priceAmountMicros) ?? "",
                'user_subscription.subscribed_currency': (receiptDecode?.payload?.priceCurrencyCode) ?? "",
                'user_subscription.original_transaction_id': "",
                'user_subscription.android_order_id': (receiptDecode?.payload?.orderId) ?? "",
                'user_subscription.purchase_token': purchase_token,
                'user_subscription.cancelled_on_unix': 0,
                'user_subscription.trial_period_start_unix': (userDetail?.user_subscription?.trial_period_start_unix) ?? 0,
                'user_subscription.trial_period_end_unix': (userDetail?.user_subscription?.trial_period_end_unix) ?? 0,
                'user_subscription.initially_purchased_on_unix': moment().unix(),
                'user_subscription.purchased_on_unix': purchaseDateUnix,
                'user_subscription.next_payment_unix': expirationDateUnix,
                'user_subscription.stripe_subscription_obj': {},
                'user_subscription.app_subscription_obj': appSubscriptionObj,
            };
            // console.log("✅ Android initially updateSubscriptionData :: ", updateSubscriptionData)

            //Possible values are: 0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade
            if (receiptDecode?.payload?.paymentState == 2) {
                updateSubscriptionData['user_subscription.trial_period_start_unix'] = purchaseDateUnix;
                updateSubscriptionData['user_subscription.trial_period_end_unix'] = expirationDateUnix;
            }

            // Update User Model With Subscription Data
            const response = await userAuthModel.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, updateSubscriptionData);
            if (!response) {
                return showResponse(false, "Unable to update initial update subscription detail", null, statusCodes.API_ERROR);
            }

            const addLogs = await userSusbriptionLogsModel.create(createLogObj);
            if (!addLogs) {
                console.error("❌ Unable to save andoid logs.......")
            }
            return showResponse(true, "Initial purchased in android successfully", null, statusCodes.SUCCESS);

        } catch (error) {
            console.error("❌ Initial android purchased error occured ", error)
            return showResponse(false, "Initial android purchased error occured", error, statusCodes.API_ERROR)
        }
    },

    //***** Function Used To save android Subscription Logs In database ****** */
    saveAndroidSubscriptionLogs: async (decoded_data: any, subscriptionData: any) => {
        try {

            const notification_type = decoded_data?.subscriptionNotification?.notificationType;
            const subscription_id = decoded_data?.subscriptionNotification?.subscriptionId;
            const purchase_token = decoded_data?.subscriptionNotification?.purchaseToken;


            // console.log("✅ saveAndroidSubscriptionLogs coming :::: ", notification_type, subscription_id, " purchase_token : ", purchase_token)

            let getUserDetails: any = await userAuthModel.findOne({ 'user_subscription.purchase_token': purchase_token, status: { $ne: USER_STATUS.DELETED } }); //not deleted

            // console.log("*USER ID*********", getUserDetails?._id);
            // console.log("*saveSubscriptionWebhookLogAndroid purchaseToken*********", purchase_token);

            if (!getUserDetails?._id) {
                // console.log("User not found, retrying in 3 seconds...");
                await UserSubscriptionHandler.sleep(4000); // Delay of 3 seconds

                getUserDetails = await userAuthModel.findOne({ 'user_subscription.purchase_token': purchase_token, status: { $ne: USER_STATUS.DELETED } });

                // console.log("*After Delay USER ID*********", getUserDetails?._id);
                // console.log("*After Delay purchaseToken*********", purchase_token);
            }

            const subscriptionKey = Object.keys(ANDROID_SUBS_NOTI_TYPE).find(key => ANDROID_SUBS_NOTI_TYPE[key] === notification_type);//get subs-status by name
            // If no key is found, set subscriptionKey to an empty string
            const logSubscriptionKey = subscriptionKey || "";

            const log_data: any = {
                package_name: subscription_id,
                subscription_status: notification_type + " - " + logSubscriptionKey,
                type: "android",
                android_event: {
                    notificaiton_type: notification_type,
                    package_data: decoded_data,
                    response_data: subscriptionData,
                }
            }
            if (getUserDetails) {
                const user_id = getUserDetails?._id;

                log_data.user_id = user_id;
                log_data.prev_user_subscription_obj = (getUserDetails?.user_subscription) ?? {};

                const addLog = await userSusbriptionLogsModel.create(log_data);
                if (!addLog) {
                    console.error("❌ Unable to save android subscription log");
                }

                const latest_purchased_on = decoded_data?.eventTimeMillis;
                let purchasedOnUnix = parseInt(latest_purchased_on);

                purchasedOnUnix = purchasedOnUnix && purchasedOnUnix.toString().length === 13
                    ? Math.floor(purchasedOnUnix / 1000)
                    : purchasedOnUnix;

                /*********Check notificaiton type and updated data in user DB *******/

                if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_PURCHASED ||
                    notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_RESTARTED ||
                    notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_RENEWED) {

                    if (subscriptionData?.payload?.acknowledgementState == 1) {

                        const startTimeMillis = parseInt(subscriptionData?.payload?.startTimeMillis);
                        const startTimeUnix = startTimeMillis && startTimeMillis.toString().length === 13
                            ? Math.floor(startTimeMillis / 1000)
                            : startTimeMillis;

                        const expiryTimeMillis = parseInt(subscriptionData?.payload?.expiryTimeMillis);
                        const nextPaymentUnix = expiryTimeMillis && expiryTimeMillis.toString().length === 13
                            ? Math.floor(expiryTimeMillis / 1000)
                            : expiryTimeMillis;

                        const updateSubObj: any = {
                            'user_subscription.is_subscribed': 1,
                            'user_subscription.stripe_subscription_id': "",
                            'user_subscription.purchased_in_device': "android",
                            'user_subscription.package_name': subscription_id,
                            'user_subscription.subscribed_price': (subscriptionData?.payload?.priceAmountMicros) ?? "",
                            'user_subscription.subscribed_currency': (subscriptionData?.payload?.priceCurrencyCode) ?? "",
                            'user_subscription.original_transaction_id': "",
                            'user_subscription.android_order_id': (subscriptionData?.payload?.orderId) ?? "",
                            'user_subscription.purchase_token': purchase_token,
                            'user_subscription.cancelled_on_unix': 0,
                            'user_subscription.purchased_on_unix': startTimeUnix,
                            'user_subscription.next_payment_unix': nextPaymentUnix,
                            'user_subscription.stripe_subscription_obj': {},
                            'user_subscription.app_subscription_obj': {
                                notificaiton_type: notification_type,
                                package_data: decoded_data,
                                response_data: subscriptionData,
                            }
                        }
                        //0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade
                        if (subscriptionData?.payload?.paymentState == 2) {
                            updateSubObj['user_subscription.trial_period_start_unix'] = startTimeUnix;
                            updateSubObj['user_subscription.trial_period_end_unix'] = nextPaymentUnix;
                        }
                        const update_user = await userAuthModel.updateOne({ _id: user_id }, updateSubObj);
                        if (update_user) {
                            // console.log(`✅ *******USER SUBSCRIPNTION UPDATED IN USER INFO**************`)
                            return showResponse(true, "subscription renewal success", null, statusCodes.SUCCESS);
                        }
                        // console.log(`❌ *******Unable to update android subscribed detail**************`)
                        return showResponse(false, "Unable to renew subscription at the moment", null, statusCodes.SUCCESS);
                    }
                    console.error("❌ android subscription acknowledgementState is not 1");

                }
                else if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_CANCELED
                    || notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_REVOKED
                    || notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_EXPIRED) {

                    const updateSubObj: any = {
                        'user_subscription.cancelled_on_unix': purchasedOnUnix,
                        'user_subscription.purchase_token': "",
                        'user_subscription.app_subscription_obj': {
                            notificaiton_type: notification_type,
                            package_data: decoded_data,
                            response_data: subscriptionData,
                        },
                    }
                    if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_EXPIRED) { //inthis case never come bcz removed purchase-token
                        updateSubObj['user_subscription.is_subscribed'] = 0;
                        updateSubObj['user_subscription.package_name'] = "";
                        updateSubObj['user_subscription.next_payment_unix'] = 0;
                        updateSubObj['user_subscription.cancelled_on_unix'] = 0;
                    }
                    // console.log(user_id, "user_idandroid")

                    const update_user = await userAuthModel.updateOne({ _id: user_id }, updateSubObj);
                    if (update_user) {
                        // console.log(`✅ *******USER SUBSCRIPNTION UPDATED IN USER info(for cancel)**************`)
                        return showResponse(true, "✅ Operation performed successfully", null, statusCodes.SUCCESS);
                    }
                    // console.error(`❌ *******Unable to update android subscription cancel detail**************`)
                }
                return showResponse(true, "✅ log added success", null, statusCodes.SUCCESS);
            } else {
                // console.log("❌ Android log added without userId")
                const result = await userSusbriptionLogsModel.create(log_data);
                return showResponse(true, "❌ Android log added without userId", result, statusCodes.SUCCESS);
            }

        } catch (error: any) {
            return showResponse(false, error?.message ? error?.message : error, null, statusCodes.SUCCESS);
        }
    },

    // *****Decode Messages From Play Store Subscription Notifications ****** */
    decodeAndroidSubscriptionMessage: async (data: any) => {
        try {
            const decoded_data = JSON.parse(Buffer.from(data, 'base64').toString());
            // console.log(
            //     "✅ decoded_data?.subscriptionNotification?.subscriptionId ", decoded_data?.subscriptionNotification?.subscriptionId,
            //     "✅ decoded_data?.subscriptionNotification?.purchaseToken ", decoded_data?.subscriptionNotification?.purchaseToken,
            // )
            const receipt: any = {
                // packageName: 'com.subscriptiondemosts',
                // productId: decoded_data?.subscriptionNotification?.subscriptionId,
                // purchaseToken: decoded_data?.subscriptionNotification?.purchaseToken,
                packageName: ANDROID_SUBSCRIPTION_DATA.SUBSCRIPTION_APN,
                productId: decoded_data?.subscriptionNotification?.subscriptionId,
                purchaseToken: decoded_data?.subscriptionNotification?.purchaseToken,
            };

            const subscriptionData = await verifier.verifySub(receipt)

            if (subscriptionData) {
                // console.log("✅ Android webhook_subscriptionData >>>>>>... ", subscriptionData)
                await UserSubscriptionHandler.saveAndroidSubscriptionLogs(decoded_data, subscriptionData)
            }
        } catch (error: any) {
            console.error('❌ Decoded message Error:::::::::::::::::::::::::::::::', error);
            return showResponse(false, error?.message ? error?.message : error, null, statusCodes.SUCCESS);
        }
    },


    // **************************iOS IAP Methods ****************************************//

    //***** At initial iOS purchase time use this function to extract subscription detail like expiry & product-id ****** */
    // validateReceipt: async (receiptData: any): Promise<any> => {
    //     try {
    //         const sharedSecret: any = process.env.SHARED_SECRET;
    //         const sharedSecretMode: any = process.env.SHARED_SECRET_MODE;

    //         appleReceiptVerify.config({
    //             secret: sharedSecret,
    //             environment: [sharedSecretMode] // or 'production' depending on the environment
    //         });
    //         const payload: any = {
    //             'receipt': receiptData,
    //             'password': sharedSecret
    //         };

    //         const response: any = await appleReceiptVerify.validate(payload);
    //         console.log(response, 'responseData==============')
    //         if (response?.length > 0) {
    //             return response;
    //         } else {
    //             return [];
    //         }
    //     } catch (error) {
    //         console.error('Error during receipt validation:', error);
    //     }
    // },
    //          validateReceipt: async (receiptData: any): Promise<any> => {
    //     try {
    //       // For JWT signedPayload (StoreKit v2)
    //       // Decode the JWT payload
    //       const parts = receiptData.split(".");
    //       if (parts.length !== 3) {
    //         // console.error("Invalid JWT format");
    //         return [];
    //       }

    //       // Decode the payload (middle part)
    //       const payload = parts[1];
    //       // Add padding if needed for base64 decode
    //       const paddedPayload = payload.padEnd(
    //         payload.length + ((4 - (payload.length % 4)) % 4),
    //         "="
    //       );
    //       const decodedPayload = JSON.parse(
    //         Buffer.from(paddedPayload, "base64").toString()
    //       );

    //       // console.log("✅ Decoded JWT payload:", decodedPayload);

    //       // Convert to array format that matches your existing code
    //       const response = [
    //         {
    //           // Fields your code uses:
    //           productId: decodedPayload.productId || decodedPayload.product_id,
    //           originalTransactionId:
    //             decodedPayload.originalTransactionId ||
    //             decodedPayload.original_transaction_id,
    //           transactionId:
    //             decodedPayload.transactionId || decodedPayload.transaction_id,
    //           purchaseDate:
    //             decodedPayload.purchaseDate || decodedPayload.purchase_date,
    //           expirationDate:
    //             decodedPayload.expiresDate ||
    //             decodedPayload.expires_date ||
    //             decodedPayload.expiration_date,

    //           // Price and currency from JWT
    //           price: decodedPayload.price,
    //           currency: decodedPayload.currency,

    //           // Add webOrderLineItemId to match your data structure
    //           webOrderLineItemId:
    //             decodedPayload.webOrderLineItemId ||
    //             decodedPayload.web_order_line_item_id,
    //           bundleId: decodedPayload.bundleId || decodedPayload.bundle_id,

    //           // Add any other fields you see in your logs
    //           subscriptionGroupIdentifier:
    //             decodedPayload.subscriptionGroupIdentifier ||
    //             decodedPayload.subscription_group_identifier,
    //           type: decodedPayload.type,
    //           environment: decodedPayload.environment,
    //           signedDate: decodedPayload.signedDate || decodedPayload.signed_date,
    //           transactionReason:
    //             decodedPayload.transactionReason ||
    //             decodedPayload.transaction_reason,
    //           storefront: decodedPayload.storefront,
    //           storefrontId:
    //             decodedPayload.storefrontId || decodedPayload.storefront_id,
    //           quantity: decodedPayload.quantity || 1,

    //           // Add transactionInfo object that your code references
    //           transactionInfo: {
    //             price: decodedPayload.price,
    //             currency: decodedPayload.currency,
    //           },
    //         },
    //       ];

    //       if (response?.length > 0) {

    //         return response;
    //       } else {
    //         return [];
    //       }
    //     } catch (error) {
    //       // console.error("Error during receipt validation:", error);
    //       return [];
    //     }
    //   },

    validateReceipt: async (receiptData: any): Promise<any> => {
        try {
            // 👉 Detect if it's StoreKit 2 (JWT)
            const isJWT = typeof receiptData === "string" && receiptData.split(".").length === 3;

            if (isJWT) {
                // ===== StoreKit 2 (JWT) =====
                const parts = receiptData.split(".");
                const payload = parts[1];

                const paddedPayload = payload.padEnd(
                    payload.length + ((4 - (payload.length % 4)) % 4),
                    "="
                );

                const decodedPayload = JSON.parse(
                    Buffer.from(paddedPayload, "base64").toString()
                );

                return [
                    {
                        productId: decodedPayload.productId || decodedPayload.product_id,
                        originalTransactionId:
                            decodedPayload.originalTransactionId ||
                            decodedPayload.original_transaction_id,
                        transactionId:
                            decodedPayload.transactionId || decodedPayload.transaction_id,
                        purchaseDate:
                            decodedPayload.purchaseDate || decodedPayload.purchase_date,
                        expirationDate:
                            decodedPayload.expiresDate ||
                            decodedPayload.expires_date ||
                            decodedPayload.expiration_date,

                        price: decodedPayload.price,
                        currency: decodedPayload.currency,

                        webOrderLineItemId:
                            decodedPayload.webOrderLineItemId ||
                            decodedPayload.web_order_line_item_id,

                        bundleId: decodedPayload.bundleId || decodedPayload.bundle_id,

                        subscriptionGroupIdentifier:
                            decodedPayload.subscriptionGroupIdentifier ||
                            decodedPayload.subscription_group_identifier,

                        type: decodedPayload.type,
                        environment: decodedPayload.environment,
                        signedDate: decodedPayload.signedDate || decodedPayload.signed_date,
                        transactionReason:
                            decodedPayload.transactionReason ||
                            decodedPayload.transaction_reason,

                        storefront: decodedPayload.storefront,
                        storefrontId:
                            decodedPayload.storefrontId || decodedPayload.storefront_id,

                        quantity: decodedPayload.quantity || 1,

                        transactionInfo: {
                            price: decodedPayload.price,
                            currency: decodedPayload.currency,
                        },
                    },
                ];
            } else {
                // ===== StoreKit 1 (Receipt Validation) =====
                const sharedSecret: any = process.env.SHARED_SECRET;
                const sharedSecretMode: any = process.env.SHARED_SECRET_MODE;

                appleReceiptVerify.config({
                    secret: sharedSecret,
                    environment: [sharedSecretMode],
                });

                const payload = {
                    receipt: receiptData,
                    password: sharedSecret,
                };

                const response: any = await appleReceiptVerify.validate(payload);

                return response?.length > 0 ? response : [];
            }
        } catch (error) {
            console.error("Error during receipt validation:", error);
            return [];
        }
    },

    //***** Function Used To save iOS Subscription Logs In database ****** */
    iosSubscriptionWebhook: async (data: any): Promise<ApiResponse> => {

        try {
            console.log("iosSubscriptionWebhookdatattat", data)

            const signedPayload = data?.signedPayload;
            const notification_data: any = await decodeNotificationPayload(signedPayload);
            if (notification_data) {

                const renewalInfo: any = await decodeRenewalInfo(notification_data?.data?.signedRenewalInfo);

                let transactionInfo: any;
                if (Array.isArray(notification_data?.data?.signedTransactionInfo)) {
                    // If it's an array, use decodeTransactions
                    // console.log(">>>>>>>>>>>> In array check<<<<<<<<<<<<<<")
                    transactionInfo = await decodeTransactions(notification_data?.data?.signedTransactionInfo);
                } else {
                    // console.log(">>>>>>>>>>>> In single value<<<<<<<<<<<<<<")
                    // If it's a single transaction, use decodeTransaction
                    transactionInfo = await decodeTransaction(notification_data?.data?.signedTransactionInfo);
                }
                // console.log("********renewalInfo saveSubscriptionWebhookLogIOS Start ************")
                // console.log("renewalInfo >>>> ", renewalInfo)
                // console.log("********renewalInfo saveSubscriptionWebhookLogIOS Ended ************")
                if (renewalInfo) {
                    let user_id = null
                    let userDetails: any = await userAuthModel.findOne({
                        status: { $ne: USER_STATUS.DELETED }, 'user_subscription.original_transaction_id': renewalInfo?.originalTransactionId
                    })
                    // console.log("User-id >>>>>>>>>>>>> ", userDetails?._id)
                    // console.log("originalTransactionId >>>>>>>>>>>>> ", renewalInfo?.originalTransactionId)
                    if (!userDetails?._id) {
                        // console.log("iOS User not found, retrying in 3 seconds...");

                        await UserSubscriptionHandler.sleep(4000);

                        userDetails = await userAuthModel.findOne({
                            status: { $ne: USER_STATUS.DELETED }, 'user_subscription.original_transaction_id': renewalInfo?.originalTransactionId
                        })
                        // console.log("*After Delay USER ID*********", userDetails?._id);
                        // console.log("*After Delay originalTransactionId*********", renewalInfo?.originalTransactionId);
                    }

                    user_id = userDetails?._id;

                    const data: any = {
                        type: "ios",
                        entire_data: notification_data,
                        renewalInfo: renewalInfo,
                        transactionInfo: transactionInfo
                    }
                    data.renewalInfo.notificaiton_type = notification_data?.notificationType;
                    data.renewalInfo.notificaiton_sub_type = notification_data?.subtype;

                    const subs_logs: any = {
                        original_transaction_id: renewalInfo?.originalTransactionId,
                        package_name: renewalInfo?.autoRenewProductId,
                        subscription_status: notification_data.notificationType + ", " + ((notification_data?.subtype) ?? ""),
                        type: "ios",
                        ios_event: data,

                    }
                    if (userDetails?._id) {
                        subs_logs.user_id = user_id;
                        subs_logs.prev_user_subscription_obj = (userDetails?.user_subscription) ?? {};
                    }

                    const saveLogs = await userSusbriptionLogsModel.create(subs_logs);
                    if (!saveLogs) {
                        console.error("Unable to save logs of ios webhook>>>>>>>>>>>>>>>>>>")
                    }

                    if (notification_data.notificationType == "DID_RENEW" || notification_data.notificationType == "DID_CHANGE_RENEWAL_PREF" ||
                        notification_data.notificationType == "SUBSCRIBED" ||
                        (notification_data.notificationType == "DID_CHANGE_RENEWAL_STATUS" && notification_data.subtype == "AUTO_RENEW_ENABLED")) {

                        // console.log("inside DID_RENEW iosSubscriptionWebhook>>>>>>>>>>>>>>>>>>>>>>");

                        if (user_id) {

                            const nextPaymentUnix = renewalInfo?.renewalDate && renewalInfo.renewalDate.toString().length === 13
                                ? Math.floor(renewalInfo.renewalDate / 1000)
                                : renewalInfo?.renewalDate;

                            let purchasedOnUnix = moment().unix();

                            if (transactionInfo?.purchaseDate) {
                                purchasedOnUnix = transactionInfo?.purchaseDate && transactionInfo.purchaseDate.toString().length === 13
                                    ? Math.floor(transactionInfo.purchaseDate / 1000)
                                    : transactionInfo?.purchaseDate;
                            }

                            // 'user_subscription.initially_purchased_on_unix': moment().unix() : No need to update this, this is just for initial time
                            const updateSubscriptionObj: any = {
                                'user_subscription.is_subscribed': 1,
                                'user_subscription.stripe_subscription_id': "",
                                'user_subscription.purchased_in_device': "ios",
                                'user_subscription.package_name': renewalInfo?.autoRenewProductId,
                                'user_subscription.subscribed_price': (transactionInfo?.price) ?? "",
                                'user_subscription.subscribed_currency': (transactionInfo?.currency) ?? "",
                                'user_subscription.original_transaction_id': renewalInfo?.originalTransactionId,
                                'user_subscription.android_order_id': "",
                                'user_subscription.purchase_token': "",
                                'user_subscription.cancelled_on_unix': 0,
                                'user_subscription.purchased_on_unix': purchasedOnUnix,
                                'user_subscription.next_payment_unix': nextPaymentUnix,
                                'user_subscription.stripe_subscription_obj': {},
                                'user_subscription.app_subscription_obj': data
                            }

                            if (transactionInfo?.offerDiscountType && transactionInfo?.offerDiscountType == "FREE_TRIAL") {

                                const trialStartDateUnix = transactionInfo?.purchaseDate && transactionInfo.purchaseDate.toString().length === 13
                                    ? Math.floor(transactionInfo.purchaseDate / 1000)
                                    : transactionInfo?.purchaseDate;

                                const trialEndDateUnix = transactionInfo?.expiresDate && transactionInfo.expiresDate.toString().length === 13
                                    ? Math.floor(transactionInfo.expiresDate / 1000)
                                    : transactionInfo?.expiresDate;

                                if (trialStartDateUnix && trialEndDateUnix) {
                                    updateSubscriptionObj['user_subscription.trial_period_start_unix'] = trialStartDateUnix;
                                    updateSubscriptionObj['user_subscription.trial_period_end_unix'] = trialEndDateUnix;
                                }
                            }
                            await userAuthModel.updateOne({ _id: user_id }, updateSubscriptionObj)
                        }

                    }
                    else if ((notification_data.notificationType == "DID_CHANGE_RENEWAL_STATUS" && notification_data.subtype == "AUTO_RENEW_DISABLED")
                        || notification_data.notificationType == "EXPIRED") {
                        // console.log("inside AUTO_RENEW_DISABLED iosSubscriptionWebhook>>>>>>>>>>>>>>>>>>>>>>");

                        if (user_id) {
                            const cancelPaymentUnix = renewalInfo?.signedDate && renewalInfo.signedDate.toString().length === 13
                                ? Math.floor(renewalInfo.signedDate / 1000)
                                : renewalInfo?.signedDate;

                            const updateSubscriptionObj: any = {
                                'user_subscription.original_transaction_id': "",
                                'user_subscription.cancelled_on_unix': cancelPaymentUnix,
                                'user_subscription.app_subscription_obj': data
                            }
                            if (notification_data.notificationType == "EXPIRED") {
                                updateSubscriptionObj['user_subscription.is_subscribed'] = 0;
                                updateSubscriptionObj['user_subscription.package_name'] = "";
                                updateSubscriptionObj['user_subscription.next_payment_unix'] = 0;
                                updateSubscriptionObj['user_subscription.cancelled_on_unix'] = 0;
                            }
                            await userAuthModel.updateOne({ _id: user_id }, updateSubscriptionObj)
                        }
                    } else {
                        console.error("iOS no handeled this subscription event: notificationType", notification_data?.notificationType, " Sub-type : ", notification_data?.subtype)
                    }
                    return showResponse(true, "Ios webhook log saved successfully", null, statusCodes.SUCCESS)
                }
                else {
                    return showResponse(false, "Renewal information get data error occured", null, statusCodes.API_ERROR)
                }
            } else {
                return showResponse(false, "Decode payload error occured", null, statusCodes.API_ERROR)
            }
        } catch (error) {
            return showResponse(false, "Weebhook error occured", error, statusCodes.API_ERROR)
        }
    },

    //*******At very first iOS will use this function, & for restore subscription time same function will use *****/
    initialPurchasedIosSubscription: async (data: any, user_id: string): Promise<ApiResponse> => {

        try {
            const { original_transaction_id, package_name, signedPayload } = data;
            // console.log(data, "data")

            // console.log("✅ >>>>>>>>>>>>>>. purchaseSubscriptionIos", {
            //     original_transaction_id, package_name
            // })

            const queryObj = {
                _id: { $ne: commonHelper.convertToObjectId(user_id) },
                'user_subscription.original_transaction_id': original_transaction_id,
                status: { $ne: USER_STATUS.DELETED }
            }
            // Check if the subscription already exists
            const existingSubscription = await userAuthModel.findOne(queryObj);
            if (existingSubscription) {
                return showResponse(false, `Subscription already purchased and linked with ${existingSubscription?.email}`, null, statusCodes.API_ERROR);
            }

            const userDetail: any = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(user_id), status: USER_STATUS.ACTIVE });
            if (!userDetail) {
                return showResponse(false, `Invalid user detail`, null, statusCodes.API_ERROR);
            }

            let expirationDateUnix = 0;
            let purchaseDateUnix = moment().unix();
            const appSubscriptionObj: any = {};

            const packageName = package_name;
            const originalTransactionId = original_transaction_id;

            const validateReceiptData = await UserSubscriptionHandler.validateReceipt(signedPayload);
            // console.log("✅ validateReceiptData :::>>>>> ", validateReceiptData)
            if (validateReceiptData.length > 0) {
                let indData = (validateReceiptData.length) - 1;
                for (let a = 0; a < validateReceiptData.length; a++) {
                    if (validateReceiptData[indData]?.productId == package_name) {
                        indData = a;
                    }
                }
                const purchaseDate = validateReceiptData[indData]?.purchaseDate;
                const expirationDate = validateReceiptData[indData]?.expirationDate;

                purchaseDateUnix = purchaseDate && purchaseDate.toString().length === 13
                    ? Math.floor(purchaseDate / 1000)
                    : 0;

                expirationDateUnix = expirationDate && expirationDate.toString().length === 13
                    ? Math.floor(expirationDate / 1000)
                    : 0;

                appSubscriptionObj.receipt_detail = validateReceiptData;
                // console.log(appSubscriptionObj, "appSubscriptionObjupperrrrr")

                // packageName = validateReceiptData[indData]?.productId;
                // originalTransactionId = validateReceiptData[indData]?.originalTransactionId;


                if (moment().unix() > expirationDateUnix) {
                    //this is for restore subscription time
                    return showResponse(false, "You have already expired subscription", { detail: validateReceiptData }, statusCodes.API_ERROR);
                }
            }

            const createLogObj: any = {
                original_transaction_id: originalTransactionId,
                package_name: packageName,
                subscription_status: "SUBSCRIBED INITIALLY",
                user_id,
                type: "ios",
                ios_event: { receipt_detail: validateReceiptData },
                prev_user_subscription_obj: (userDetail?.user_subscription) ?? {}
            }

            // console.log("✅ createLogObj ::>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", createLogObj);

            // Prepare subscription data
            const updateSubscriptionData = {
                'user_subscription.is_subscribed': 1,
                'user_subscription.stripe_subscription_id': "",
                'user_subscription.purchased_in_device': 'ios',
                'user_subscription.package_name': packageName,
                'user_subscription.subscribed_price': (appSubscriptionObj?.transactionInfo?.price) ?? "",
                'user_subscription.subscribed_currency': (appSubscriptionObj?.transactionInfo?.currency) ?? "",
                'user_subscription.original_transaction_id': originalTransactionId,
                'user_subscription.android_order_id': '',
                'user_subscription.purchase_token': '',
                'user_subscription.cancelled_on_unix': 0,
                'user_subscription.trial_period_start_unix': (userDetail?.user_subscription?.trial_period_start_unix) ?? 0,
                'user_subscription.trial_period_end_unix': (userDetail?.user_subscription?.trial_period_end_unix) ?? 0,
                'user_subscription.initially_purchased_on_unix': moment().unix(),
                'user_subscription.purchased_on_unix': purchaseDateUnix,
                'user_subscription.next_payment_unix': expirationDateUnix,
                'user_subscription.stripe_subscription_obj': {},
                'user_subscription.app_subscription_obj': appSubscriptionObj,
            };
            // console.log("updateSubscriptionData ✅ ", appSubscriptionObj)


            // Update User Model With Subscription Data
            const response = await userAuthModel.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, updateSubscriptionData);
            if (!response) {
                return showResponse(false, "Unable to update initial update subscription detail", null, statusCodes.API_ERROR);
            }

            const addLogs = await userSusbriptionLogsModel.create(createLogObj);
            if (!addLogs) {
                console.log("❌ Unable to save ios logs.......")
            }
            return showResponse(true, "Initial purchased in ios successfully", null, statusCodes.SUCCESS);

        } catch (error) {
            // console.log("❌ Initial ios purchased error occured :: ", error)
            return showResponse(false, "Initial ios purchased error occured", error, statusCodes.API_ERROR)
        }
    },

    appSubscriptionPlan: async (): Promise<ApiResponse> => {
        const getResponse = await subscriptionPlans.find({});
        if (getResponse.length < 1) {
            return showResponse(false, "Empty plan list", null, statusCodes.API_ERROR)
        }
        return showResponse(true, "Plan list get successfully", getResponse, statusCodes.SUCCESS)
    },

    addCredit: async (data: any, user_id: string): Promise<ApiResponse> => {
        try {
            const { package_name, transaction_id } = data;

            if (!package_name || !transaction_id) {
                return showResponse(false, "package_name and transaction_id required", null, statusCodes.VALIDATION_ERROR);
            }

            // console.log("Incoming:", package_name, transaction_id);

            // ✅ USER CHECK
            const user: any = await userAuthModel.findById(user_id);
            if (!user) {
                return showResponse(false, "User not found", null, statusCodes.API_ERROR);
            }

            // ✅ DUPLICATE TRANSACTION CHECK
            const existingLog = await userSusbriptionLogsModel.findOne({ transaction_id });
            if (existingLog) {
                return showResponse(false, "Transaction already used", null, statusCodes.API_ERROR);
            }

            // ✅ GET PLAN
            const plan: any = await subscriptionPlans.findOne({
                plan_name: { $regex: `^${package_name}$`, $options: "i" }
            });

            // 🔥 AUTO CREATE PLAN (fallback)
            if (!plan) {
                // console.log("⚠️ Plan not found, creating default plan...");
                return showResponse(false, "Invalid credit pack type", null, statusCodes.API_ERROR);

                // plan = await subscriptionPlans.create({
                //     plan_name: package_name,
                //     type: "credit",
                //     credits: 500,        // 🔥 default (change if needed)
                //     amount: 12.99,
                //     status: 1
                // });
            }

            // console.log("PLAN:", plan);

            if (plan.type !== "credit") {
                return showResponse(false, "Invalid credit pack type", null, statusCodes.API_ERROR);
            }

            const creditsToAdd = plan.credits || 0;

            if (creditsToAdd <= 0) {
                return showResponse(false, "Invalid credit value in plan", null, statusCodes.API_ERROR);
            }

            // ✅ ADD CREDITS (atomic)
            await userAuthModel.updateOne(
                { _id: user_id },
                { $inc: { pack_credits: creditsToAdd }, is_credit_pack: true }
            );

            // ✅ SAVE LOG
            await userSusbriptionLogsModel.create({
                user_id,
                package_name: plan.plan_name,
                transaction_id,
                credits_added: creditsToAdd,
                type: "credit",
                subscription_status: "CREDIT_PURCHASE",
                prev_user_subscription_obj: user.user_subscription || {},
                amount: plan.amount || 0,
                currency: "USD"
            });

            return showResponse(true, "Credits added successfully", {
                credits_added: creditsToAdd
            }, statusCodes.SUCCESS);

        } catch (error: any) {
            console.error("❌ createCredit error:", error);
            return showResponse(false, error?.message || "Something went wrong", null, statusCodes.API_ERROR);
        }
    }
}


export default UserSubscriptionHandler
