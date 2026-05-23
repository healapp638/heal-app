"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const moment_1 = __importDefault(require("moment"));
const response_util_1 = require("../../utils/response.util");
const commonHelper = __importStar(require("../../helpers/common.helper"));
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const user_subscriptionLogs_model_1 = __importDefault(require("./user.subscriptionLogs.model"));
const user_subscriptionPlans_model_1 = __importDefault(require("./user.subscriptionPlans.model"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
//*****Following part used for the subscription *************/
const app_store_server_api_1 = require("app-store-server-api");
const node_apple_receipt_verify_1 = __importDefault(require("node-apple-receipt-verify"));
const google_play_billing_validator_1 = __importDefault(require("google-play-billing-validator"));
const androidInAppPurchase_json_1 = __importDefault(require("../../../public/androidCerts/androidInAppPurchase.json"));
const workflow_constant_1 = require("../../constants/workflow.constant");
console.log("✅ ab1 subscription file email >>>>>>>>>>>>>> ", androidInAppPurchase_json_1.default === null || androidInAppPurchase_json_1.default === void 0 ? void 0 : androidInAppPurchase_json_1.default.client_email);
const options = {
    email: String(androidInAppPurchase_json_1.default.client_email),
    key: String(androidInAppPurchase_json_1.default.private_key)
};
const verifier = new google_play_billing_validator_1.default(options); //verifier instance 
const ANDROID_SUBSCRIPTION_DATA = {
    SUBSCRIPTION_APN: process.env.SUBSCRIPTION_APN,
    SUBSCRIPTION_NAME: process.env.SUBSCRIPTION_NAME,
};
const ANDROID_SUBS_NOTI_TYPE = {
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
    sleep: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (ms = 3000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }),
    // **************************Android IAP Methods ****************************************//
    //*******At very first android will use this function, & for restore subscription time same function will use *****/
    initialPurchasedAndroidSubscription: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        try {
            const { plan_name, purchase_token } = data;
            console.log(data, "initialPurchasedAndroidSubscription");
            const queryObj = {
                _id: { $ne: commonHelper.convertToObjectId(user_id) },
                'user_subscription.purchase_token': purchase_token,
                status: { $ne: workflow_constant_1.USER_STATUS.DELETED }
            };
            // Check if the subscription already exists
            const existingSubscription = yield user_auth_model_1.default.findOne(queryObj);
            if (existingSubscription) {
                return (0, response_util_1.showResponse)(false, `Subscription already purchased and linked with ${existingSubscription === null || existingSubscription === void 0 ? void 0 : existingSubscription.email}`, null, statusCodes_1.default.API_ERROR);
            }
            const userDetail = yield user_auth_model_1.default.findOne({ _id: commonHelper.convertToObjectId(user_id), status: workflow_constant_1.USER_STATUS.ACTIVE });
            if (!userDetail) {
                return (0, response_util_1.showResponse)(false, `Invalid user detail`, null, statusCodes_1.default.API_ERROR);
            }
            const packageName = ANDROID_SUBSCRIPTION_DATA.SUBSCRIPTION_APN; //com. related
            const subscriptionId = plan_name; //this is actually plan-name like monthly yearly
            const receipt = {
                packageName: packageName,
                productId: subscriptionId,
                purchaseToken: purchase_token,
            };
            console.log("✅ >>>>>>. receipt:::::::::::::: ", receipt);
            const receiptDecode = yield verifier.verifySub(receipt);
            console.log("✅ >>>>>>. receiptDecode:::::::::::::: ", receiptDecode);
            let expirationDateUnix = 0;
            let purchaseDateUnix = (0, moment_1.default)().unix();
            const appSubscriptionObj = {
                receiptDecode: receiptDecode
            };
            if (receiptDecode === null || receiptDecode === void 0 ? void 0 : receiptDecode.payload) {
                const purchaseDate = (_a = receiptDecode.payload) === null || _a === void 0 ? void 0 : _a.startTimeMillis;
                const expirationDate = (_b = receiptDecode.payload) === null || _b === void 0 ? void 0 : _b.expiryTimeMillis;
                purchaseDateUnix = purchaseDate && purchaseDate.toString().length === 13
                    ? Math.floor(purchaseDate / 1000)
                    : 0;
                expirationDateUnix = expirationDate && expirationDate.toString().length === 13
                    ? Math.floor(expirationDate / 1000)
                    : 0;
                if ((0, moment_1.default)().unix() > expirationDateUnix) {
                    //this is for restore subscription time
                    return (0, response_util_1.showResponse)(false, "You have already expired subscription", { detail: receiptDecode }, statusCodes_1.default.API_ERROR);
                }
            }
            const createLogObj = {
                package_name: plan_name,
                subscription_status: "SUBSCRIBED INITIALLY",
                user_id,
                type: "android",
                android_event: { receiptDecode: receiptDecode },
                prev_user_subscription_obj: (_c = (userDetail === null || userDetail === void 0 ? void 0 : userDetail.user_subscription)) !== null && _c !== void 0 ? _c : {},
            };
            console.log("createLogObj ::>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", createLogObj);
            // Prepare subscription data
            const updateSubscriptionData = {
                'user_subscription.is_subscribed': 1,
                'user_subscription.stripe_subscription_id': "",
                'user_subscription.purchased_in_device': 'android',
                'user_subscription.package_name': plan_name,
                'user_subscription.subscribed_price': (_e = ((_d = receiptDecode === null || receiptDecode === void 0 ? void 0 : receiptDecode.payload) === null || _d === void 0 ? void 0 : _d.priceAmountMicros)) !== null && _e !== void 0 ? _e : "",
                'user_subscription.subscribed_currency': (_g = ((_f = receiptDecode === null || receiptDecode === void 0 ? void 0 : receiptDecode.payload) === null || _f === void 0 ? void 0 : _f.priceCurrencyCode)) !== null && _g !== void 0 ? _g : "",
                'user_subscription.original_transaction_id': "",
                'user_subscription.android_order_id': (_j = ((_h = receiptDecode === null || receiptDecode === void 0 ? void 0 : receiptDecode.payload) === null || _h === void 0 ? void 0 : _h.orderId)) !== null && _j !== void 0 ? _j : "",
                'user_subscription.purchase_token': purchase_token,
                'user_subscription.cancelled_on_unix': 0,
                'user_subscription.trial_period_start_unix': (_l = ((_k = userDetail === null || userDetail === void 0 ? void 0 : userDetail.user_subscription) === null || _k === void 0 ? void 0 : _k.trial_period_start_unix)) !== null && _l !== void 0 ? _l : 0,
                'user_subscription.trial_period_end_unix': (_o = ((_m = userDetail === null || userDetail === void 0 ? void 0 : userDetail.user_subscription) === null || _m === void 0 ? void 0 : _m.trial_period_end_unix)) !== null && _o !== void 0 ? _o : 0,
                'user_subscription.initially_purchased_on_unix': (0, moment_1.default)().unix(),
                'user_subscription.purchased_on_unix': purchaseDateUnix,
                'user_subscription.next_payment_unix': expirationDateUnix,
                'user_subscription.stripe_subscription_obj': {},
                'user_subscription.app_subscription_obj': appSubscriptionObj,
            };
            console.log("✅ Android initially updateSubscriptionData :: ", updateSubscriptionData);
            //Possible values are: 0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade
            if (((_p = receiptDecode === null || receiptDecode === void 0 ? void 0 : receiptDecode.payload) === null || _p === void 0 ? void 0 : _p.paymentState) == 2) {
                updateSubscriptionData['user_subscription.trial_period_start_unix'] = purchaseDateUnix;
                updateSubscriptionData['user_subscription.trial_period_end_unix'] = expirationDateUnix;
            }
            // Update User Model With Subscription Data
            const response = yield user_auth_model_1.default.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, updateSubscriptionData);
            if (!response) {
                return (0, response_util_1.showResponse)(false, "Unable to update initial update subscription detail", null, statusCodes_1.default.API_ERROR);
            }
            const addLogs = yield user_subscriptionLogs_model_1.default.create(createLogObj);
            if (!addLogs) {
                console.error("❌ Unable to save andoid logs.......");
            }
            return (0, response_util_1.showResponse)(true, "Initial purchased in android successfully", null, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.error("❌ Initial android purchased error occured ", error);
            return (0, response_util_1.showResponse)(false, "Initial android purchased error occured", error, statusCodes_1.default.API_ERROR);
        }
    }),
    //***** Function Used To save android Subscription Logs In database ****** */
    saveAndroidSubscriptionLogs: (decoded_data, subscriptionData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        try {
            const notification_type = (_a = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.subscriptionNotification) === null || _a === void 0 ? void 0 : _a.notificationType;
            const subscription_id = (_b = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.subscriptionNotification) === null || _b === void 0 ? void 0 : _b.subscriptionId;
            const purchase_token = (_c = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.subscriptionNotification) === null || _c === void 0 ? void 0 : _c.purchaseToken;
            console.log("✅ saveAndroidSubscriptionLogs coming :::: ", notification_type, subscription_id, " purchase_token : ", purchase_token);
            let getUserDetails = yield user_auth_model_1.default.findOne({ 'user_subscription.purchase_token': purchase_token, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } }); //not deleted
            console.log("*USER ID*********", getUserDetails === null || getUserDetails === void 0 ? void 0 : getUserDetails._id);
            console.log("*saveSubscriptionWebhookLogAndroid purchaseToken*********", purchase_token);
            if (!(getUserDetails === null || getUserDetails === void 0 ? void 0 : getUserDetails._id)) {
                console.log("User not found, retrying in 3 seconds...");
                yield UserSubscriptionHandler.sleep(4000); // Delay of 3 seconds
                getUserDetails = yield user_auth_model_1.default.findOne({ 'user_subscription.purchase_token': purchase_token, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } });
                console.log("*After Delay USER ID*********", getUserDetails === null || getUserDetails === void 0 ? void 0 : getUserDetails._id);
                console.log("*After Delay purchaseToken*********", purchase_token);
            }
            const subscriptionKey = Object.keys(ANDROID_SUBS_NOTI_TYPE).find(key => ANDROID_SUBS_NOTI_TYPE[key] === notification_type); //get subs-status by name
            // If no key is found, set subscriptionKey to an empty string
            const logSubscriptionKey = subscriptionKey || "";
            const log_data = {
                package_name: subscription_id,
                subscription_status: notification_type + " - " + logSubscriptionKey,
                type: "android",
                android_event: {
                    notificaiton_type: notification_type,
                    package_data: decoded_data,
                    response_data: subscriptionData,
                }
            };
            if (getUserDetails) {
                const user_id = getUserDetails === null || getUserDetails === void 0 ? void 0 : getUserDetails._id;
                log_data.user_id = user_id;
                log_data.prev_user_subscription_obj = (_d = (getUserDetails === null || getUserDetails === void 0 ? void 0 : getUserDetails.user_subscription)) !== null && _d !== void 0 ? _d : {};
                const addLog = yield user_subscriptionLogs_model_1.default.create(log_data);
                if (!addLog) {
                    console.error("❌ Unable to save android subscription log");
                }
                const latest_purchased_on = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.eventTimeMillis;
                let purchasedOnUnix = parseInt(latest_purchased_on);
                purchasedOnUnix = purchasedOnUnix && purchasedOnUnix.toString().length === 13
                    ? Math.floor(purchasedOnUnix / 1000)
                    : purchasedOnUnix;
                /*********Check notificaiton type and updated data in user DB *******/
                if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_PURCHASED ||
                    notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_RESTARTED ||
                    notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_RENEWED) {
                    if (((_e = subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.payload) === null || _e === void 0 ? void 0 : _e.acknowledgementState) == 1) {
                        const startTimeMillis = parseInt((_f = subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.payload) === null || _f === void 0 ? void 0 : _f.startTimeMillis);
                        const startTimeUnix = startTimeMillis && startTimeMillis.toString().length === 13
                            ? Math.floor(startTimeMillis / 1000)
                            : startTimeMillis;
                        const expiryTimeMillis = parseInt((_g = subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.payload) === null || _g === void 0 ? void 0 : _g.expiryTimeMillis);
                        const nextPaymentUnix = expiryTimeMillis && expiryTimeMillis.toString().length === 13
                            ? Math.floor(expiryTimeMillis / 1000)
                            : expiryTimeMillis;
                        const updateSubObj = {
                            'user_subscription.is_subscribed': 1,
                            'user_subscription.stripe_subscription_id': "",
                            'user_subscription.purchased_in_device': "android",
                            'user_subscription.package_name': subscription_id,
                            'user_subscription.subscribed_price': (_j = ((_h = subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.payload) === null || _h === void 0 ? void 0 : _h.priceAmountMicros)) !== null && _j !== void 0 ? _j : "",
                            'user_subscription.subscribed_currency': (_l = ((_k = subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.payload) === null || _k === void 0 ? void 0 : _k.priceCurrencyCode)) !== null && _l !== void 0 ? _l : "",
                            'user_subscription.original_transaction_id': "",
                            'user_subscription.android_order_id': (_o = ((_m = subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.payload) === null || _m === void 0 ? void 0 : _m.orderId)) !== null && _o !== void 0 ? _o : "",
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
                        };
                        //0. Payment pending 1. Payment received 2. Free trial 3. Pending deferred upgrade/downgrade
                        if (((_p = subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.payload) === null || _p === void 0 ? void 0 : _p.paymentState) == 2) {
                            updateSubObj['user_subscription.trial_period_start_unix'] = startTimeUnix;
                            updateSubObj['user_subscription.trial_period_end_unix'] = nextPaymentUnix;
                        }
                        const update_user = yield user_auth_model_1.default.updateOne({ _id: user_id }, updateSubObj);
                        if (update_user) {
                            console.log(`✅ *******USER SUBSCRIPNTION UPDATED IN USER INFO**************`);
                            return (0, response_util_1.showResponse)(true, "subscription renewal success", null, statusCodes_1.default.SUCCESS);
                        }
                        console.log(`❌ *******Unable to update android subscribed detail**************`);
                        return (0, response_util_1.showResponse)(false, "Unable to renew subscription at the moment", null, statusCodes_1.default.SUCCESS);
                    }
                    console.error("❌ android subscription acknowledgementState is not 1");
                }
                else if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_CANCELED
                    || notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_REVOKED
                    || notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_EXPIRED) {
                    const updateSubObj = {
                        'user_subscription.cancelled_on_unix': purchasedOnUnix,
                        'user_subscription.purchase_token': "",
                        'user_subscription.app_subscription_obj': {
                            notificaiton_type: notification_type,
                            package_data: decoded_data,
                            response_data: subscriptionData,
                        },
                    };
                    if (notification_type == ANDROID_SUBS_NOTI_TYPE.SUBSCRIPTION_EXPIRED) { //inthis case never come bcz removed purchase-token
                        updateSubObj['user_subscription.is_subscribed'] = 0;
                        updateSubObj['user_subscription.package_name'] = "";
                        updateSubObj['user_subscription.next_payment_unix'] = 0;
                        updateSubObj['user_subscription.cancelled_on_unix'] = 0;
                    }
                    console.log(user_id, "user_idandroid");
                    const update_user = yield user_auth_model_1.default.updateOne({ _id: user_id }, updateSubObj);
                    if (update_user) {
                        console.log(`✅ *******USER SUBSCRIPNTION UPDATED IN USER info(for cancel)**************`);
                        return (0, response_util_1.showResponse)(true, "✅ Operation performed successfully", null, statusCodes_1.default.SUCCESS);
                    }
                    console.error(`❌ *******Unable to update android subscription cancel detail**************`);
                }
                return (0, response_util_1.showResponse)(true, "✅ log added success", null, statusCodes_1.default.SUCCESS);
            }
            else {
                console.log("❌ Android log added without userId");
                const result = yield user_subscriptionLogs_model_1.default.create(log_data);
                return (0, response_util_1.showResponse)(true, "❌ Android log added without userId", result, statusCodes_1.default.SUCCESS);
            }
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) ? error === null || error === void 0 ? void 0 : error.message : error, null, statusCodes_1.default.SUCCESS);
        }
    }),
    // *****Decode Messages From Play Store Subscription Notifications ****** */
    decodeAndroidSubscriptionMessage: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const decoded_data = JSON.parse(Buffer.from(data, 'base64').toString());
            console.log("✅ decoded_data?.subscriptionNotification?.subscriptionId ", (_a = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.subscriptionNotification) === null || _a === void 0 ? void 0 : _a.subscriptionId, "✅ decoded_data?.subscriptionNotification?.purchaseToken ", (_b = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.subscriptionNotification) === null || _b === void 0 ? void 0 : _b.purchaseToken);
            const receipt = {
                // packageName: 'com.subscriptiondemosts',
                // productId: decoded_data?.subscriptionNotification?.subscriptionId,
                // purchaseToken: decoded_data?.subscriptionNotification?.purchaseToken,
                packageName: ANDROID_SUBSCRIPTION_DATA.SUBSCRIPTION_APN,
                productId: (_c = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.subscriptionNotification) === null || _c === void 0 ? void 0 : _c.subscriptionId,
                purchaseToken: (_d = decoded_data === null || decoded_data === void 0 ? void 0 : decoded_data.subscriptionNotification) === null || _d === void 0 ? void 0 : _d.purchaseToken,
            };
            const subscriptionData = yield verifier.verifySub(receipt);
            if (subscriptionData) {
                console.log("✅ Android webhook_subscriptionData >>>>>>... ", subscriptionData);
                yield UserSubscriptionHandler.saveAndroidSubscriptionLogs(decoded_data, subscriptionData);
            }
        }
        catch (error) {
            console.error('❌ Decoded message Error:::::::::::::::::::::::::::::::', error);
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) ? error === null || error === void 0 ? void 0 : error.message : error, null, statusCodes_1.default.SUCCESS);
        }
    }),
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
    validateReceipt: (receiptData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 👉 Detect if it's StoreKit 2 (JWT)
            const isJWT = typeof receiptData === "string" && receiptData.split(".").length === 3;
            if (isJWT) {
                // ===== StoreKit 2 (JWT) =====
                const parts = receiptData.split(".");
                const payload = parts[1];
                const paddedPayload = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
                const decodedPayload = JSON.parse(Buffer.from(paddedPayload, "base64").toString());
                return [
                    {
                        productId: decodedPayload.productId || decodedPayload.product_id,
                        originalTransactionId: decodedPayload.originalTransactionId ||
                            decodedPayload.original_transaction_id,
                        transactionId: decodedPayload.transactionId || decodedPayload.transaction_id,
                        purchaseDate: decodedPayload.purchaseDate || decodedPayload.purchase_date,
                        expirationDate: decodedPayload.expiresDate ||
                            decodedPayload.expires_date ||
                            decodedPayload.expiration_date,
                        price: decodedPayload.price,
                        currency: decodedPayload.currency,
                        webOrderLineItemId: decodedPayload.webOrderLineItemId ||
                            decodedPayload.web_order_line_item_id,
                        bundleId: decodedPayload.bundleId || decodedPayload.bundle_id,
                        subscriptionGroupIdentifier: decodedPayload.subscriptionGroupIdentifier ||
                            decodedPayload.subscription_group_identifier,
                        type: decodedPayload.type,
                        environment: decodedPayload.environment,
                        signedDate: decodedPayload.signedDate || decodedPayload.signed_date,
                        transactionReason: decodedPayload.transactionReason ||
                            decodedPayload.transaction_reason,
                        storefront: decodedPayload.storefront,
                        storefrontId: decodedPayload.storefrontId || decodedPayload.storefront_id,
                        quantity: decodedPayload.quantity || 1,
                        transactionInfo: {
                            price: decodedPayload.price,
                            currency: decodedPayload.currency,
                        },
                    },
                ];
            }
            else {
                // ===== StoreKit 1 (Receipt Validation) =====
                const sharedSecret = process.env.SHARED_SECRET;
                const sharedSecretMode = process.env.SHARED_SECRET_MODE;
                node_apple_receipt_verify_1.default.config({
                    secret: sharedSecret,
                    environment: [sharedSecretMode],
                });
                const payload = {
                    receipt: receiptData,
                    password: sharedSecret,
                };
                const response = yield node_apple_receipt_verify_1.default.validate(payload);
                return (response === null || response === void 0 ? void 0 : response.length) > 0 ? response : [];
            }
        }
        catch (error) {
            console.error("Error during receipt validation:", error);
            return [];
        }
    }),
    //***** Function Used To save iOS Subscription Logs In database ****** */
    iosSubscriptionWebhook: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            console.log("iosSubscriptionWebhookdatattat", data);
            const signedPayload = data === null || data === void 0 ? void 0 : data.signedPayload;
            const notification_data = yield (0, app_store_server_api_1.decodeNotificationPayload)(signedPayload);
            if (notification_data) {
                const renewalInfo = yield (0, app_store_server_api_1.decodeRenewalInfo)((_a = notification_data === null || notification_data === void 0 ? void 0 : notification_data.data) === null || _a === void 0 ? void 0 : _a.signedRenewalInfo);
                let transactionInfo;
                if (Array.isArray((_b = notification_data === null || notification_data === void 0 ? void 0 : notification_data.data) === null || _b === void 0 ? void 0 : _b.signedTransactionInfo)) {
                    // If it's an array, use decodeTransactions
                    console.log(">>>>>>>>>>>> In array check<<<<<<<<<<<<<<");
                    transactionInfo = yield (0, app_store_server_api_1.decodeTransactions)((_c = notification_data === null || notification_data === void 0 ? void 0 : notification_data.data) === null || _c === void 0 ? void 0 : _c.signedTransactionInfo);
                }
                else {
                    console.log(">>>>>>>>>>>> In single value<<<<<<<<<<<<<<");
                    // If it's a single transaction, use decodeTransaction
                    transactionInfo = yield (0, app_store_server_api_1.decodeTransaction)((_d = notification_data === null || notification_data === void 0 ? void 0 : notification_data.data) === null || _d === void 0 ? void 0 : _d.signedTransactionInfo);
                }
                console.log("********renewalInfo saveSubscriptionWebhookLogIOS Start ************");
                console.log("renewalInfo >>>> ", renewalInfo);
                console.log("********renewalInfo saveSubscriptionWebhookLogIOS Ended ************");
                if (renewalInfo) {
                    let user_id = null;
                    let userDetails = yield user_auth_model_1.default.findOne({
                        status: { $ne: workflow_constant_1.USER_STATUS.DELETED }, 'user_subscription.original_transaction_id': renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.originalTransactionId
                    });
                    console.log("User-id >>>>>>>>>>>>> ", userDetails === null || userDetails === void 0 ? void 0 : userDetails._id);
                    console.log("originalTransactionId >>>>>>>>>>>>> ", renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.originalTransactionId);
                    if (!(userDetails === null || userDetails === void 0 ? void 0 : userDetails._id)) {
                        console.log("iOS User not found, retrying in 3 seconds...");
                        yield UserSubscriptionHandler.sleep(4000);
                        userDetails = yield user_auth_model_1.default.findOne({
                            status: { $ne: workflow_constant_1.USER_STATUS.DELETED }, 'user_subscription.original_transaction_id': renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.originalTransactionId
                        });
                        console.log("*After Delay USER ID*********", userDetails === null || userDetails === void 0 ? void 0 : userDetails._id);
                        console.log("*After Delay originalTransactionId*********", renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.originalTransactionId);
                    }
                    user_id = userDetails === null || userDetails === void 0 ? void 0 : userDetails._id;
                    const data = {
                        type: "ios",
                        entire_data: notification_data,
                        renewalInfo: renewalInfo,
                        transactionInfo: transactionInfo
                    };
                    data.renewalInfo.notificaiton_type = notification_data === null || notification_data === void 0 ? void 0 : notification_data.notificationType;
                    data.renewalInfo.notificaiton_sub_type = notification_data === null || notification_data === void 0 ? void 0 : notification_data.subtype;
                    const subs_logs = {
                        original_transaction_id: renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.originalTransactionId,
                        package_name: renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.autoRenewProductId,
                        subscription_status: notification_data.notificationType + ", " + ((_e = (notification_data === null || notification_data === void 0 ? void 0 : notification_data.subtype)) !== null && _e !== void 0 ? _e : ""),
                        type: "ios",
                        ios_event: data,
                    };
                    if (userDetails === null || userDetails === void 0 ? void 0 : userDetails._id) {
                        subs_logs.user_id = user_id;
                        subs_logs.prev_user_subscription_obj = (_f = (userDetails === null || userDetails === void 0 ? void 0 : userDetails.user_subscription)) !== null && _f !== void 0 ? _f : {};
                    }
                    const saveLogs = yield user_subscriptionLogs_model_1.default.create(subs_logs);
                    if (!saveLogs) {
                        console.error("Unable to save logs of ios webhook>>>>>>>>>>>>>>>>>>");
                    }
                    if (notification_data.notificationType == "DID_RENEW" || notification_data.notificationType == "DID_CHANGE_RENEWAL_PREF" ||
                        notification_data.notificationType == "SUBSCRIBED" ||
                        (notification_data.notificationType == "DID_CHANGE_RENEWAL_STATUS" && notification_data.subtype == "AUTO_RENEW_ENABLED")) {
                        console.log("inside DID_RENEW iosSubscriptionWebhook>>>>>>>>>>>>>>>>>>>>>>");
                        if (user_id) {
                            const nextPaymentUnix = (renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.renewalDate) && renewalInfo.renewalDate.toString().length === 13
                                ? Math.floor(renewalInfo.renewalDate / 1000)
                                : renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.renewalDate;
                            let purchasedOnUnix = (0, moment_1.default)().unix();
                            if (transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.purchaseDate) {
                                purchasedOnUnix = (transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.purchaseDate) && transactionInfo.purchaseDate.toString().length === 13
                                    ? Math.floor(transactionInfo.purchaseDate / 1000)
                                    : transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.purchaseDate;
                            }
                            // 'user_subscription.initially_purchased_on_unix': moment().unix() : No need to update this, this is just for initial time
                            const updateSubscriptionObj = {
                                'user_subscription.is_subscribed': 1,
                                'user_subscription.stripe_subscription_id': "",
                                'user_subscription.purchased_in_device': "ios",
                                'user_subscription.package_name': renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.autoRenewProductId,
                                'user_subscription.subscribed_price': (_g = (transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.price)) !== null && _g !== void 0 ? _g : "",
                                'user_subscription.subscribed_currency': (_h = (transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.currency)) !== null && _h !== void 0 ? _h : "",
                                'user_subscription.original_transaction_id': renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.originalTransactionId,
                                'user_subscription.android_order_id': "",
                                'user_subscription.purchase_token': "",
                                'user_subscription.cancelled_on_unix': 0,
                                'user_subscription.purchased_on_unix': purchasedOnUnix,
                                'user_subscription.next_payment_unix': nextPaymentUnix,
                                'user_subscription.stripe_subscription_obj': {},
                                'user_subscription.app_subscription_obj': data
                            };
                            if ((transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.offerDiscountType) && (transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.offerDiscountType) == "FREE_TRIAL") {
                                const trialStartDateUnix = (transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.purchaseDate) && transactionInfo.purchaseDate.toString().length === 13
                                    ? Math.floor(transactionInfo.purchaseDate / 1000)
                                    : transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.purchaseDate;
                                const trialEndDateUnix = (transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.expiresDate) && transactionInfo.expiresDate.toString().length === 13
                                    ? Math.floor(transactionInfo.expiresDate / 1000)
                                    : transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.expiresDate;
                                if (trialStartDateUnix && trialEndDateUnix) {
                                    updateSubscriptionObj['user_subscription.trial_period_start_unix'] = trialStartDateUnix;
                                    updateSubscriptionObj['user_subscription.trial_period_end_unix'] = trialEndDateUnix;
                                }
                            }
                            yield user_auth_model_1.default.updateOne({ _id: user_id }, updateSubscriptionObj);
                        }
                    }
                    else if ((notification_data.notificationType == "DID_CHANGE_RENEWAL_STATUS" && notification_data.subtype == "AUTO_RENEW_DISABLED")
                        || notification_data.notificationType == "EXPIRED") {
                        console.log("inside AUTO_RENEW_DISABLED iosSubscriptionWebhook>>>>>>>>>>>>>>>>>>>>>>");
                        if (user_id) {
                            const cancelPaymentUnix = (renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.signedDate) && renewalInfo.signedDate.toString().length === 13
                                ? Math.floor(renewalInfo.signedDate / 1000)
                                : renewalInfo === null || renewalInfo === void 0 ? void 0 : renewalInfo.signedDate;
                            const updateSubscriptionObj = {
                                'user_subscription.original_transaction_id': "",
                                'user_subscription.cancelled_on_unix': cancelPaymentUnix,
                                'user_subscription.app_subscription_obj': data
                            };
                            if (notification_data.notificationType == "EXPIRED") {
                                updateSubscriptionObj['user_subscription.is_subscribed'] = 0;
                                updateSubscriptionObj['user_subscription.package_name'] = "";
                                updateSubscriptionObj['user_subscription.next_payment_unix'] = 0;
                                updateSubscriptionObj['user_subscription.cancelled_on_unix'] = 0;
                            }
                            yield user_auth_model_1.default.updateOne({ _id: user_id }, updateSubscriptionObj);
                        }
                    }
                    else {
                        console.error("iOS no handeled this subscription event: notificationType", notification_data === null || notification_data === void 0 ? void 0 : notification_data.notificationType, " Sub-type : ", notification_data === null || notification_data === void 0 ? void 0 : notification_data.subtype);
                    }
                    return (0, response_util_1.showResponse)(true, "Ios webhook log saved successfully", null, statusCodes_1.default.SUCCESS);
                }
                else {
                    return (0, response_util_1.showResponse)(false, "Renewal information get data error occured", null, statusCodes_1.default.API_ERROR);
                }
            }
            else {
                return (0, response_util_1.showResponse)(false, "Decode payload error occured", null, statusCodes_1.default.API_ERROR);
            }
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, "Weebhook error occured", error, statusCodes_1.default.API_ERROR);
        }
    }),
    //*******At very first iOS will use this function, & for restore subscription time same function will use *****/
    initialPurchasedIosSubscription: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            const { original_transaction_id, package_name, signedPayload } = data;
            console.log(data, "data");
            console.log("✅ >>>>>>>>>>>>>>. purchaseSubscriptionIos", {
                original_transaction_id, package_name
            });
            const queryObj = {
                _id: { $ne: commonHelper.convertToObjectId(user_id) },
                'user_subscription.original_transaction_id': original_transaction_id,
                status: { $ne: workflow_constant_1.USER_STATUS.DELETED }
            };
            // Check if the subscription already exists
            const existingSubscription = yield user_auth_model_1.default.findOne(queryObj);
            if (existingSubscription) {
                return (0, response_util_1.showResponse)(false, `Subscription already purchased and linked with ${existingSubscription === null || existingSubscription === void 0 ? void 0 : existingSubscription.email}`, null, statusCodes_1.default.API_ERROR);
            }
            const userDetail = yield user_auth_model_1.default.findOne({ _id: commonHelper.convertToObjectId(user_id), status: workflow_constant_1.USER_STATUS.ACTIVE });
            if (!userDetail) {
                return (0, response_util_1.showResponse)(false, `Invalid user detail`, null, statusCodes_1.default.API_ERROR);
            }
            let expirationDateUnix = 0;
            let purchaseDateUnix = (0, moment_1.default)().unix();
            const appSubscriptionObj = {};
            const packageName = package_name;
            const originalTransactionId = original_transaction_id;
            const validateReceiptData = yield UserSubscriptionHandler.validateReceipt(signedPayload);
            console.log("✅ validateReceiptData :::>>>>> ", validateReceiptData);
            if (validateReceiptData.length > 0) {
                let indData = (validateReceiptData.length) - 1;
                for (let a = 0; a < validateReceiptData.length; a++) {
                    if (((_a = validateReceiptData[indData]) === null || _a === void 0 ? void 0 : _a.productId) == package_name) {
                        indData = a;
                    }
                }
                const purchaseDate = (_b = validateReceiptData[indData]) === null || _b === void 0 ? void 0 : _b.purchaseDate;
                const expirationDate = (_c = validateReceiptData[indData]) === null || _c === void 0 ? void 0 : _c.expirationDate;
                purchaseDateUnix = purchaseDate && purchaseDate.toString().length === 13
                    ? Math.floor(purchaseDate / 1000)
                    : 0;
                expirationDateUnix = expirationDate && expirationDate.toString().length === 13
                    ? Math.floor(expirationDate / 1000)
                    : 0;
                appSubscriptionObj.receipt_detail = validateReceiptData;
                console.log(appSubscriptionObj, "appSubscriptionObjupperrrrr");
                // packageName = validateReceiptData[indData]?.productId;
                // originalTransactionId = validateReceiptData[indData]?.originalTransactionId;
                if ((0, moment_1.default)().unix() > expirationDateUnix) {
                    //this is for restore subscription time
                    return (0, response_util_1.showResponse)(false, "You have already expired subscription", { detail: validateReceiptData }, statusCodes_1.default.API_ERROR);
                }
            }
            const createLogObj = {
                original_transaction_id: originalTransactionId,
                package_name: packageName,
                subscription_status: "SUBSCRIBED INITIALLY",
                user_id,
                type: "ios",
                ios_event: { receipt_detail: validateReceiptData },
                prev_user_subscription_obj: (_d = (userDetail === null || userDetail === void 0 ? void 0 : userDetail.user_subscription)) !== null && _d !== void 0 ? _d : {}
            };
            console.log("✅ createLogObj ::>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", createLogObj);
            // Prepare subscription data
            const updateSubscriptionData = {
                'user_subscription.is_subscribed': 1,
                'user_subscription.stripe_subscription_id': "",
                'user_subscription.purchased_in_device': 'ios',
                'user_subscription.package_name': packageName,
                'user_subscription.subscribed_price': (_f = ((_e = appSubscriptionObj === null || appSubscriptionObj === void 0 ? void 0 : appSubscriptionObj.transactionInfo) === null || _e === void 0 ? void 0 : _e.price)) !== null && _f !== void 0 ? _f : "",
                'user_subscription.subscribed_currency': (_h = ((_g = appSubscriptionObj === null || appSubscriptionObj === void 0 ? void 0 : appSubscriptionObj.transactionInfo) === null || _g === void 0 ? void 0 : _g.currency)) !== null && _h !== void 0 ? _h : "",
                'user_subscription.original_transaction_id': originalTransactionId,
                'user_subscription.android_order_id': '',
                'user_subscription.purchase_token': '',
                'user_subscription.cancelled_on_unix': 0,
                'user_subscription.trial_period_start_unix': (_k = ((_j = userDetail === null || userDetail === void 0 ? void 0 : userDetail.user_subscription) === null || _j === void 0 ? void 0 : _j.trial_period_start_unix)) !== null && _k !== void 0 ? _k : 0,
                'user_subscription.trial_period_end_unix': (_m = ((_l = userDetail === null || userDetail === void 0 ? void 0 : userDetail.user_subscription) === null || _l === void 0 ? void 0 : _l.trial_period_end_unix)) !== null && _m !== void 0 ? _m : 0,
                'user_subscription.initially_purchased_on_unix': (0, moment_1.default)().unix(),
                'user_subscription.purchased_on_unix': purchaseDateUnix,
                'user_subscription.next_payment_unix': expirationDateUnix,
                'user_subscription.stripe_subscription_obj': {},
                'user_subscription.app_subscription_obj': appSubscriptionObj,
            };
            console.log("updateSubscriptionData ✅ ", appSubscriptionObj);
            // Update User Model With Subscription Data
            const response = yield user_auth_model_1.default.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, updateSubscriptionData);
            if (!response) {
                return (0, response_util_1.showResponse)(false, "Unable to update initial update subscription detail", null, statusCodes_1.default.API_ERROR);
            }
            const addLogs = yield user_subscriptionLogs_model_1.default.create(createLogObj);
            if (!addLogs) {
                console.log("❌ Unable to save ios logs.......");
            }
            return (0, response_util_1.showResponse)(true, "Initial purchased in ios successfully", null, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log("❌ Initial ios purchased error occured :: ", error);
            return (0, response_util_1.showResponse)(false, "Initial ios purchased error occured", error, statusCodes_1.default.API_ERROR);
        }
    }),
    appSubscriptionPlan: () => __awaiter(void 0, void 0, void 0, function* () {
        const getResponse = yield user_subscriptionPlans_model_1.default.find({});
        if (getResponse.length < 1) {
            return (0, response_util_1.showResponse)(false, "Empty plan list", null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, "Plan list get successfully", getResponse, statusCodes_1.default.SUCCESS);
    }),
};
exports.default = UserSubscriptionHandler;
