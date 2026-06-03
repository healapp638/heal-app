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
// handlers/user.subscription.handler.ts
const moment_1 = __importDefault(require("moment"));
const response_util_1 = require("../../utils/response.util");
const commonHelper = __importStar(require("../../helpers/common.helper"));
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const user_subscriptionLogs_model_1 = __importDefault(require("./user.subscriptionLogs.model"));
const user_subscriptionPlans_model_1 = __importDefault(require("./user.subscriptionPlans.model"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const crypto_1 = __importDefault(require("crypto"));
// ============= REVENUECAT CONFIGURATION =============
// Get these from RevenueCat Dashboard → Settings → API Keys
const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY || '';
// const REVENUECAT_PROJECT_ID = process.env.REVENUECAT_PROJECT_ID || '';
const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET || '';
// RevenueCat webhook event types
const REVENUECAT_EVENT_TYPES = {
    INITIAL_PURCHASE: 'INITIAL_PURCHASE',
    RENEWAL: 'RENEWAL',
    CANCELLATION: 'CANCELLATION',
    EXPIRATION: 'EXPIRATION',
    BILLING_ISSUE: 'BILLING_ISSUE'
};
// ============= HELPER FUNCTIONS =============
/**
 * Fetch user subscription info from RevenueCat API
 * This calls RevenueCat's REST API to get the latest subscription status
 */
function fetchRevenueCatSubscription(appUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Using RevenueCat API v1 (recommended for subscription checks)
            const url = `https://api.revenuecat.com/v1/subscribers/${appUserId}`;
            const response = yield fetch(url, {
                headers: {
                    'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`RevenueCat API error: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error('Error fetching RevenueCat subscription:', error);
            return null;
        }
    });
}
/**
 * Extract subscription data from RevenueCat response
 */
function extractSubscriptionData(revenueCatData) {
    var _a;
    try {
        // Get entitlements (what the user has access to)
        const entitlements = ((_a = revenueCatData === null || revenueCatData === void 0 ? void 0 : revenueCatData.subscriber) === null || _a === void 0 ? void 0 : _a.entitlements) || {};
        // Find active entitlement
        let activeEntitlement = null;
        let activeProductId = null;
        for (const [entitlementId, entitlement] of Object.entries(entitlements)) {
            const ent = entitlement;
            if (ent.expires_date && new Date(ent.expires_date).getTime() > Date.now()) {
                activeEntitlement = ent;
                activeProductId = entitlementId;
                break;
            }
        }
        if (!activeEntitlement) {
            return {
                isSubscribed: false,
                productId: '',
                expiryDate: 0,
                purchaseDate: 0,
                willRenew: false
            };
        }
        return {
            isSubscribed: true,
            productId: activeProductId,
            expiryDate: Math.floor(new Date(activeEntitlement.expires_date).getTime() / 1000),
            purchaseDate: Math.floor(new Date(activeEntitlement.purchase_date).getTime() / 1000),
            willRenew: activeEntitlement.will_renew || false
        };
    }
    catch (error) {
        console.error('Error extracting subscription data:', error);
        return {
            isSubscribed: false,
            productId: '',
            expiryDate: 0,
            purchaseDate: 0,
            willRenew: false
        };
    }
}
/**
 * Verify RevenueCat webhook signature for security
 */
function verifyWebhookSignature(payload, signature, authorization) {
    try {
        console.log(payload, signature, 'payload signature');
        // 1. Check if they used the Authorization header instead of HMAC signature
        const expectedAuth = authorization === null || authorization === void 0 ? void 0 : authorization.replace('Bearer ', '').trim();
        if (expectedAuth && expectedAuth === REVENUECAT_WEBHOOK_SECRET) {
            console.log('✅ Validated using Authorization header');
            return true;
        }
        // 2. Otherwise try HMAC signature validation
        const expectedSignature = crypto_1.default
            .createHmac('sha256', REVENUECAT_WEBHOOK_SECRET)
            .update(JSON.stringify(payload))
            .digest('hex');
        const sigBuffer = Buffer.from(signature || '');
        const expectedSigBuffer = Buffer.from(expectedSignature);
        if (sigBuffer.length !== expectedSigBuffer.length) {
            console.log('Signature length mismatch');
            return false;
        }
        console.log(crypto_1.default.timingSafeEqual(sigBuffer, expectedSigBuffer), 'crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)');
        return crypto_1.default.timingSafeEqual(sigBuffer, expectedSigBuffer);
    }
    catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
}
// ============= MAIN SUBSCRIPTION HANDLER =============
const UserSubscriptionHandler = {
    sleep: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (ms = 3000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }),
    // ============= REVENUECAT WEBHOOK HANDLER (ONE FOR BOTH PLATFORMS) =============
    // This is called by RevenueCat whenever a subscription event happens
    // Set this URL in RevenueCat Dashboard → Integrations → Webhooks
    revenueCatWebhook: (data, signature, authorization) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("📨 RevenueCat webhook received");
            // Verify webhook signature (security)
            if (!verifyWebhookSignature(data, signature, authorization)) {
                console.error("❌ Invalid webhook signature");
                return (0, response_util_1.showResponse)(false, "Invalid webhook signature", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const event = data.event;
            const customerInfo = data.customer_info;
            const userId = customerInfo === null || customerInfo === void 0 ? void 0 : customerInfo.app_user_id;
            const eventType = event === null || event === void 0 ? void 0 : event.type;
            console.log(`Event: ${eventType} for user: ${userId}`);
            if (!userId) {
                return (0, response_util_1.showResponse)(false, "User ID missing", null, statusCodes_1.default.API_ERROR);
            }
            // Find user in database
            let userDetails = yield user_auth_model_1.default.findOne({
                _id: commonHelper.convertToObjectId(userId),
                status: { $ne: workflow_constant_1.USER_STATUS.DELETED }
            });
            if (!userDetails) {
                console.log(`User ${userId} not found, retrying...`);
                yield UserSubscriptionHandler.sleep(4000);
                userDetails = yield user_auth_model_1.default.findOne({
                    _id: commonHelper.convertToObjectId(userId),
                    status: { $ne: workflow_constant_1.USER_STATUS.DELETED }
                });
            }
            // Create log entry
            const logData = {
                subscription_status: eventType,
                type: "revenuecat",
                revenuecat_event: {
                    event_type: eventType,
                    event_timestamp: event === null || event === void 0 ? void 0 : event.timestamp,
                    payload: data
                },
                prev_user_subscription_obj: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.user_subscription) || {}
            };
            if (userDetails) {
                logData.user_id = userId;
                logData.package_name = data.product_id;
            }
            yield user_subscriptionLogs_model_1.default.create(logData);
            if (!userDetails) {
                return (0, response_util_1.showResponse)(true, "Webhook logged (user not found)", null, statusCodes_1.default.SUCCESS);
            }
            // Process based on event type
            if (eventType === REVENUECAT_EVENT_TYPES.INITIAL_PURCHASE ||
                eventType === REVENUECAT_EVENT_TYPES.RENEWAL) {
                console.log("Processing initial purchase or renewal");
                console.log(eventType, "eventType");
                // Get full subscription details from RevenueCat
                const revenueCatData = yield fetchRevenueCatSubscription(userId);
                const subscriptionData = extractSubscriptionData(revenueCatData);
                const updateData = {
                    'user_subscription.is_subscribed': 1,
                    'user_subscription.purchased_in_device': data.store || 'revenuecat',
                    'user_subscription.package_name': subscriptionData.productId,
                    'user_subscription.original_transaction_id': data.transaction_id || "",
                    'user_subscription.cancelled_on_unix': 0,
                    'user_subscription.purchased_on_unix': subscriptionData.purchaseDate,
                    'user_subscription.next_payment_unix': subscriptionData.expiryDate,
                    'user_subscription.revenuecat_id': userId,
                    'user_subscription.revenuecat_data': revenueCatData,
                    'user_subscription.last_revenuecat_sync': (0, moment_1.default)().unix(),
                    'user_subscription.app_subscription_obj': {
                        source: "revenuecat",
                        event_type: eventType,
                        webhook_data: data
                    }
                };
                yield user_auth_model_1.default.updateOne({ _id: commonHelper.convertToObjectId(userId) }, { $set: updateData });
                console.log(`✅ Subscription activated for user ${userId}`);
                return (0, response_util_1.showResponse)(true, "Subscription activated", null, statusCodes_1.default.SUCCESS);
            }
            else if (eventType === REVENUECAT_EVENT_TYPES.CANCELLATION) {
                yield user_auth_model_1.default.updateOne({ _id: commonHelper.convertToObjectId(userId) }, {
                    $set: {
                        'user_subscription.cancelled_on_unix': (0, moment_1.default)().unix(),
                        'user_subscription.revenuecat_data': yield fetchRevenueCatSubscription(userId),
                        'user_subscription.last_revenuecat_sync': (0, moment_1.default)().unix()
                    }
                });
                return (0, response_util_1.showResponse)(true, "Cancellation recorded", null, statusCodes_1.default.SUCCESS);
            }
            else if (eventType === REVENUECAT_EVENT_TYPES.EXPIRATION) {
                yield user_auth_model_1.default.updateOne({ _id: commonHelper.convertToObjectId(userId) }, {
                    $set: {
                        'user_subscription.is_subscribed': 0,
                        'user_subscription.package_name': "",
                        'user_subscription.next_payment_unix': 0,
                        'user_subscription.cancelled_on_unix': 0,
                        'user_subscription.revenuecat_data': yield fetchRevenueCatSubscription(userId),
                        'user_subscription.last_revenuecat_sync': (0, moment_1.default)().unix()
                    }
                });
                return (0, response_util_1.showResponse)(true, "Expiration recorded", null, statusCodes_1.default.SUCCESS);
            }
            return (0, response_util_1.showResponse)(true, `Event ${eventType} logged`, null, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.error("RevenueCat webhook error:", error);
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Webhook failed", error, statusCodes_1.default.API_ERROR);
        }
    }),
    // ============= CHECK SUBSCRIPTION STATUS (USE THIS IN YOUR MIDDLEWARE) =============
    checkRevenueCatSubscriptionStatus: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            // First check local database (fast)
            const user = yield user_auth_model_1.default.findOne({
                _id: commonHelper.convertToObjectId(user_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE
            });
            if (!user) {
                return (0, response_util_1.showResponse)(false, "User not found", null, statusCodes_1.default.API_ERROR);
            }
            const currentTime = (0, moment_1.default)().unix();
            const nextPayment = ((_a = user.user_subscription) === null || _a === void 0 ? void 0 : _a.next_payment_unix) || 0;
            const isLocallySubscribed = ((_b = user.user_subscription) === null || _b === void 0 ? void 0 : _b.is_subscribed) === 1 && nextPayment > currentTime;
            if (isLocallySubscribed) {
                return (0, response_util_1.showResponse)(true, "Active subscription", {
                    isSubscribed: true,
                    productId: (_c = user.user_subscription) === null || _c === void 0 ? void 0 : _c.package_name,
                    expiryDate: (_d = user.user_subscription) === null || _d === void 0 ? void 0 : _d.next_payment_unix
                }, statusCodes_1.default.SUCCESS);
            }
            // If local shows expired, verify with RevenueCat (in case it renewed)
            console.log("Verifying with RevenueCat...");
            const revenueCatData = yield fetchRevenueCatSubscription(user_id);
            if (revenueCatData) {
                const subscriptionData = extractSubscriptionData(revenueCatData);
                // Update local database
                yield user_auth_model_1.default.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, {
                    $set: {
                        'user_subscription.is_subscribed': subscriptionData.isSubscribed ? 1 : 0,
                        'user_subscription.package_name': subscriptionData.productId,
                        'user_subscription.next_payment_unix': subscriptionData.expiryDate,
                        'user_subscription.purchased_on_unix': subscriptionData.purchaseDate,
                        'user_subscription.last_revenuecat_sync': (0, moment_1.default)().unix(),
                        'user_subscription.revenuecat_data': revenueCatData
                    }
                });
                return (0, response_util_1.showResponse)(true, "Subscription status", {
                    isSubscribed: subscriptionData.isSubscribed,
                    productId: subscriptionData.productId,
                    expiryDate: subscriptionData.expiryDate,
                    willRenew: subscriptionData.willRenew
                }, statusCodes_1.default.SUCCESS);
            }
            return (0, response_util_1.showResponse)(true, "No active subscription", { isSubscribed: false }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.error("Error checking subscription:", error);
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Check failed", error, statusCodes_1.default.API_ERROR);
        }
    }),
    // ============= SYNC USER WITH REVENUECAT AFTER PURCHASE =============
    // Call this from your frontend after a successful RevenueCat purchase
    syncAfterPurchase: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const revenueCatData = yield fetchRevenueCatSubscription(user_id);
            if (!revenueCatData) {
                return (0, response_util_1.showResponse)(false, "Could not verify subscription with RevenueCat", null, statusCodes_1.default.API_ERROR);
            }
            const subscriptionData = extractSubscriptionData(revenueCatData);
            if (!subscriptionData.isSubscribed) {
                return (0, response_util_1.showResponse)(false, "No active subscription found", null, statusCodes_1.default.API_ERROR);
            }
            const updateData = {
                'user_subscription.is_subscribed': 1,
                'user_subscription.package_name': subscriptionData.productId,
                'user_subscription.purchased_on_unix': subscriptionData.purchaseDate,
                'user_subscription.next_payment_unix': subscriptionData.expiryDate,
                'user_subscription.revenuecat_id': user_id,
                'user_subscription.revenuecat_data': revenueCatData,
                'user_subscription.last_revenuecat_sync': (0, moment_1.default)().unix(),
                'user_subscription.initially_purchased_on_unix': (0, moment_1.default)().unix()
            };
            yield user_auth_model_1.default.updateOne({ _id: commonHelper.convertToObjectId(user_id) }, { $set: updateData });
            yield user_subscriptionLogs_model_1.default.create({
                user_id,
                package_name: subscriptionData.productId,
                subscription_status: "PURCHASE_SYNCED",
                type: "revenuecat",
                revenuecat_event: { sync: true, data: revenueCatData },
                prev_user_subscription_obj: {}
            });
            return (0, response_util_1.showResponse)(true, "Subscription synced successfully", {
                productId: subscriptionData.productId,
                expiryDate: subscriptionData.expiryDate
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.error("Sync error:", error);
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Sync failed", error, statusCodes_1.default.API_ERROR);
        }
    }),
    // ============= YOUR EXISTING FUNCTIONS (Keep them as is) =============
    addCredit: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // Your existing credit code - keep it exactly the same
        try {
            const { package_name, transaction_id } = data;
            if (!package_name || !transaction_id) {
                return (0, response_util_1.showResponse)(false, "package_name and transaction_id required", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const user = yield user_auth_model_1.default.findById(user_id);
            if (!user) {
                return (0, response_util_1.showResponse)(false, "User not found", null, statusCodes_1.default.API_ERROR);
            }
            const existingLog = yield user_subscriptionLogs_model_1.default.findOne({ transaction_id });
            if (existingLog) {
                return (0, response_util_1.showResponse)(false, "Transaction already used", null, statusCodes_1.default.API_ERROR);
            }
            const plan = yield user_subscriptionPlans_model_1.default.findOne({
                plan_name: { $regex: `^${package_name}$`, $options: "i" }
            });
            if (!plan || plan.type !== "credit") {
                return (0, response_util_1.showResponse)(false, "Invalid credit pack", null, statusCodes_1.default.API_ERROR);
            }
            const creditsToAdd = plan.credits || 0;
            yield user_auth_model_1.default.updateOne({ _id: user_id }, { $inc: { extra_credits: creditsToAdd }, is_credit_pack: true });
            yield user_subscriptionLogs_model_1.default.create({
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
            return (0, response_util_1.showResponse)(true, "Credits added successfully", { credits_added: creditsToAdd }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.error("Credit error:", error);
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong", null, statusCodes_1.default.API_ERROR);
        }
    })
};
exports.default = UserSubscriptionHandler;
