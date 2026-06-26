// handlers/user.subscription.handler.ts
import moment from "moment";
import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import * as commonHelper from "../../helpers/common.helper";
import userAuthModel from "../UserAuth/user.auth.model";
import userSusbriptionLogsModel from "./user.subscriptionLogs.model";
import subscriptionPlans from "./user.subscriptionPlans.model";
import statusCodes from '../../constants/statusCodes'
import { USER_STATUS } from "../../constants/workflow.constant";
import { APP } from "../../constants/app.constant";
import crypto from 'crypto';
// import { APP } from "../../constants/app.constant";
import logger from "../../configs/logger.config";
// ============= REVENUECAT CONFIGURATION =============
// Get these from RevenueCat Dashboard → Settings → API Keys
// const REVENUECAT_API_KEY = APP.REVENUECAT_API_KEY || '';
// const REVENUECAT_PROJECT_ID = process.env.REVENUECAT_PROJECT_ID || '';
// const REVENUECAT_WEBHOOK_SECRET = APP.REVENUECAT_WEBHOOK_SECRET || '';

// RevenueCat webhook event types
const REVENUECAT_EVENT_TYPES = {
    INITIAL_PURCHASE: 'INITIAL_PURCHASE',
    RENEWAL: 'RENEWAL',
    CANCELLATION: 'CANCELLATION',
    EXPIRATION: 'EXPIRATION',
    BILLING_ISSUE: 'BILLING_ISSUE',
    UNCANCELLATION: 'UNCANCELLATION',
    NON_RENEWING_PURCHASE: 'NON_RENEWING_PURCHASE',
    SUBSCRIPTION_PAUSED: 'SUBSCRIPTION_PAUSED',
    PRODUCT_CHANGE: 'PRODUCT_CHANGE',
    TRANSFER: 'TRANSFER',
    SUBSCRIPTION_EXTENDED: 'SUBSCRIPTION_EXTENDED',
    TEMPORARY_ENTITLEMENT_GRANT: 'TEMPORARY_ENTITLEMENT_GRANT',
    REFUND_REVERSED: 'REFUND_REVERSED',
    VIRTUAL_CURRENCY_TRANSACTION: 'VIRTUAL_CURRENCY_TRANSACTION',
    EXPERIMENT_ENROLLMENT: 'EXPERIMENT_ENROLLMENT'
};

const CREDIT_PACKS: Record<string, number> = {
    "large_pack": 3000,   // $12.99 — Large pack
    "medium_pack": 1500,  // $6.99  — Medium pack
    "small_pack": 500,   // $2.99  — Small pack
};

// ============= HELPER FUNCTIONS =============

/**
 * Fetch user subscription info from RevenueCat API
 * This calls RevenueCat's REST API to get the latest subscription status
 */
async function fetchRevenueCatSubscription(appUserId: string) {
    // const REVENUECAT_API_KEY = await APP.REVENUECAT_API_KEY || '';
    // console.log(REVENUECAT_API_KEY,"REVENUECAT_API_KEY REVENUECAT_API_KEY")
    try {
        const REVENUECAT_API_KEY = await APP.REVENUECAT_API_KEY || '';
        // Using RevenueCat API v1 (recommended for subscription checks)
        const url = `https://api.revenuecat.com/v1/subscribers/${appUserId}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`RevenueCat API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        logger.error("REVENUECAT_FETCH_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return null;
    }
}

/**
 * Extract subscription data from RevenueCat response
 */
function extractSubscriptionData(revenueCatData: any) {
    try {
        // Get entitlements (what the user has access to)
        const entitlements = revenueCatData?.subscriber?.entitlements || {};

        // Find active entitlement
        let activeEntitlement = null;
        let activeProductId = null;

        for (const [entitlementId, entitlement] of Object.entries(entitlements)) {
            const ent = entitlement as any;
            const expiresDate = ent.expires_date;

            // Entitlement is active if:
            // 1. There is no expiry date (e.g. lifetime entitlement)
            // OR
            // 2. The expiry date is in the future
            if (expiresDate === null || (expiresDate && new Date(expiresDate).getTime() > Date.now())) {
                activeEntitlement = ent;
                activeProductId = ent.product_identifier || entitlementId;
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
            expiryDate: activeEntitlement.expires_date
                ? Math.floor(new Date(activeEntitlement.expires_date).getTime() / 1000)
                : 2147483647, // Far future for lifetime/permanent access
            purchaseDate: Math.floor(new Date(activeEntitlement.purchase_date).getTime() / 1000),
            willRenew: activeEntitlement.will_renew || false
        };
    } catch (error: any) {
        logger.error("REVENUECAT_DATA_EXTRACTION_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
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
async function verifyWebhookSignature(payload: any, signature: string, authorization?: string): Promise<boolean> {
    try {
        // console.log(payload, signature, 'payload signature')
        const REVENUECAT_WEBHOOK_SECRET = await APP.REVENUECAT_WEBHOOK_SECRET || '';
        // console.log(REVENUECAT_WEBHOOK_SECRET,'REVENUECAT_WEBHOOK_SECRET')

        // 1. Check if they used the Authorization header instead of HMAC signature
        const expectedAuth = authorization?.replace('Bearer ', '').trim();
        if (expectedAuth && expectedAuth === REVENUECAT_WEBHOOK_SECRET) {
            // console.log('✅ Validated using Authorization header');
            return true;
        }

        // 2. Otherwise try HMAC signature validation
        const expectedSignature = crypto
            .createHmac('sha256', REVENUECAT_WEBHOOK_SECRET)
            .update(JSON.stringify(payload))
            .digest('hex');

        const sigBuffer = Buffer.from(signature || '');
        const expectedSigBuffer = Buffer.from(expectedSignature);

        if (sigBuffer.length !== expectedSigBuffer.length) {
            console.log('Signature length mismatch')
            return false;
        }
        // console.log(crypto.timingSafeEqual(sigBuffer, expectedSigBuffer), 'crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)')

        return crypto.timingSafeEqual(sigBuffer, expectedSigBuffer);
    } catch (error: any) {
        logger.error("REVENUECAT_SIGNATURE_VERIFICATION_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return false;
    }
}

/**
 * Check if a product ID is a credit pack
 */
function isCreditPack(productId: string): boolean {
    return Object.keys(CREDIT_PACKS).includes(productId.toLowerCase());
}

/**
 * Get credits for a given credit pack product ID
 */
function getCreditsForPack(productId: string): number {
    return CREDIT_PACKS[productId.toLowerCase()] || 0;
}

// ============= MAIN SUBSCRIPTION HANDLER =============

const UserSubscriptionHandler = {

    sleep: async (ms = 3000) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // ============= REVENUECAT WEBHOOK HANDLER (ONE FOR BOTH PLATFORMS) =============
    // This is called by RevenueCat whenever a subscription event happens
    // Set this URL in RevenueCat Dashboard → Integrations → Webhooks

    revenueCatWebhook: async (data: any, signature: string, authorization: string): Promise<ApiResponse> => {
        try {
            // console.log("📨 RevenueCat webhook received");
            // Verify webhook signature (security)
            if (!verifyWebhookSignature(data, signature, authorization)) {
                logger.error("REVENUECAT_INVALID_WEBHOOK_SIGNATURE", {
                    type: "error",
                    message: "Invalid webhook signature",
                });
                return showResponse(false, "Invalid webhook signature", null, statusCodes.VALIDATION_ERROR);
            }
            // console.log(data,'dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

            const event = data.event;
            // const customerInfo = data.customer_info;
            const userId = event?.app_user_id;
            const eventType = event?.type;
            const productId = (event?.product_id || "").toLowerCase();
            const transactionId = event?.transaction_id;

            // console.log(`Event: ${eventType} for user: ${userId}`);

            if (!userId) {
                return showResponse(false, "User ID missing", null, statusCodes.API_ERROR);
            }

            // Find user in database
            let userDetails: any = await userAuthModel.findOne({
                _id: commonHelper.convertToObjectId(userId),
                status: { $ne: USER_STATUS.DELETED }
            });

            if (!userDetails) {
                // console.log(`User ${userId} not found, retrying...`);
                await UserSubscriptionHandler.sleep(4000);
                userDetails = await userAuthModel.findOne({
                    _id: commonHelper.convertToObjectId(userId),
                    status: { $ne: USER_STATUS.DELETED }
                });
            }

            // Create log entry
            const logData: any = {
                subscription_status: eventType,
                type: "revenuecat",
                amount: event?.price || 0,
                currency: event?.currency || "",
                store: event?.store || "",
                package_name: event?.product_id || "",
                revenuecat_event: {
                    event_type: eventType,
                    event_timestamp: event?.timestamp,
                    payload: data
                },
                prev_user_subscription_obj: userDetails?.user_subscription || {}
            };

            if (userDetails) {
                logData.user_id = userId;
                logData.package_name = event?.product_id || "";
            }

            await userSusbriptionLogsModel.create(logData);

            if (!userDetails) {
                return showResponse(true, "Webhook logged (user not found)", null, statusCodes.SUCCESS);
            }

            // ================================================================
            // CREDIT PACK HANDLING (NON_RENEWING_PURCHASE for credit packs)
            // ================================================================

            if (eventType === REVENUECAT_EVENT_TYPES.NON_RENEWING_PURCHASE && isCreditPack(productId)) {
                // Deduplicate: prevent double-crediting if webhook fires twice
                const existingLog = await userSusbriptionLogsModel.findOne({
                    'revenuecat_event.transaction_id': transactionId,
                    subscription_status: { $in: ["CREDIT_PACK_ADDED", "CREDIT_PACK_DUPLICATE"] }
                });

                if (existingLog) {
                    console.log(`⚠️ Duplicate credit pack transaction ${transactionId}, skipping.`);
                    await userSusbriptionLogsModel.updateOne(
                        { 'revenuecat_event.transaction_id': transactionId, subscription_status: "CREDIT_PACK_DUPLICATE" },
                        { $set: { subscription_status: "CREDIT_PACK_DUPLICATE" } },
                        { upsert: false }
                    );
                    return showResponse(true, "Already processed", null, statusCodes.SUCCESS);
                }

                const creditsToAdd = getCreditsForPack(productId);

                if (!creditsToAdd) {
                    logger.error("REVENUECAT_UNKNOWN_CREDIT_PACK", {
                        type: "error",
                        message: `Unknown credit pack product: ${productId}`,
                    });
                    return showResponse(false, "Unknown credit pack", null, statusCodes.VALIDATION_ERROR);
                }

                const userObj = await userAuthModel.findOne({ _id: commonHelper.convertToObjectId(userId) });
                const currentPackCredits = Number(userObj?.pack_credits) || 0;

                await userAuthModel.updateOne(
                    { _id: commonHelper.convertToObjectId(userId) },
                    {
                        $set: {
                            pack_credits: currentPackCredits + creditsToAdd,
                            is_credit_pack: true,
                            pack_name: productId
                        },
                    }
                );

                // Update the existing log entry to mark as successfully processed
                await userSusbriptionLogsModel.updateOne(
                    {
                        user_id: userId,
                        'revenuecat_event.transaction_id': transactionId
                    },
                    {
                        $set: {
                            subscription_status: "CREDIT_PACK_ADDED",
                            credits_added: creditsToAdd
                        }
                    }
                );

                console.log(`✅ Credit pack processed: +${creditsToAdd} pack_credits for user ${userId} (product: ${productId})`);
                return showResponse(true, `Credit pack added: ${creditsToAdd} credits`, { creditsToAdd }, statusCodes.SUCCESS);
            }

            // ================================================================
            // SUBSCRIPTION HANDLING (monthly / yearly)
            // ================================================================

            // Process based on event type
            if (eventType === REVENUECAT_EVENT_TYPES.INITIAL_PURCHASE ||
                eventType === REVENUECAT_EVENT_TYPES.RENEWAL ||
                eventType === REVENUECAT_EVENT_TYPES.UNCANCELLATION ||
                eventType === REVENUECAT_EVENT_TYPES.NON_RENEWING_PURCHASE ||
                eventType === REVENUECAT_EVENT_TYPES.PRODUCT_CHANGE ||
                // eventType === REVENUECAT_EVENT_TYPES.TRANSFER ||
                eventType === REVENUECAT_EVENT_TYPES.SUBSCRIPTION_EXTENDED ||
                eventType === REVENUECAT_EVENT_TYPES.TEMPORARY_ENTITLEMENT_GRANT ||
                eventType === REVENUECAT_EVENT_TYPES.REFUND_REVERSED) {

                // console.log(`Processing active subscription/entitlement event: ${eventType}`);

                // Get full subscription details from RevenueCat
                const revenueCatData = await fetchRevenueCatSubscription(userId);
                const subscriptionData = extractSubscriptionData(revenueCatData);
                // console.log(subscriptionData,'subscriptionData')

                const updateData: any = {
                    'user_subscription.is_subscribed': subscriptionData.isSubscribed ? 1 : 0,
                    'user_subscription.purchased_in_device': event?.store || 'revenuecat',
                    'user_subscription.package_name': subscriptionData.productId || event?.product_id || "",
                    'user_subscription.original_transaction_id': event?.original_transaction_id || event?.transaction_id || "",
                    'user_subscription.cancelled_on_unix': subscriptionData.willRenew ? 0 : moment().unix(),
                    'user_subscription.purchased_on_unix': subscriptionData.purchaseDate || Math.floor(new Date(event?.purchased_at_ms || event?.timestamp).getTime() / 1000) || 0,
                    'user_subscription.next_payment_unix': subscriptionData.expiryDate,
                    'user_subscription.revenuecat_id': userId,
                    'user_subscription.revenuecat_data': revenueCatData,
                    'user_subscription.last_revenuecat_sync': moment().unix(),
                    'user_subscription.app_subscription_obj': {
                        source: "revenuecat",
                        event_type: eventType,
                        webhook_data: data
                    }
                };

                const packageName = (subscriptionData.productId || event?.product_id || "").toLowerCase();
                if (packageName === "yearly_heal") {
                    updateData['sub_credits'] = 2000;
                } else if (packageName === "monthly_heal") {
                    updateData['sub_credits'] = 1000;
                }

                if (eventType === REVENUECAT_EVENT_TYPES.UNCANCELLATION) {
                    updateData['user_subscription.cancelled_on_unix'] = 0;
                }

                await userAuthModel.updateOne(
                    { _id: commonHelper.convertToObjectId(userId) },
                    { $set: updateData }
                );

                // console.log(`✅ Subscription processed/updated for user ${userId} on event ${eventType}`);
                return showResponse(true, `Subscription updated on ${eventType}`, null, statusCodes.SUCCESS);
            }

            else if (eventType === REVENUECAT_EVENT_TYPES.CANCELLATION ||
                eventType === REVENUECAT_EVENT_TYPES.SUBSCRIPTION_PAUSED) {
                // console.log(REVENUECAT_EVENT_TYPES.CANCELLATION,"CANCELLATIONnnnnnnnnnnnnnnnnnnnnnnnn")
                // console.log(REVENUECAT_EVENT_TYPES.SUBSCRIPTION_PAUSED,"SUBSCRIPTION_PAUSEDdddddddddddddddddddddddddddddd")
                // For cancellation or pause, the user still retains access until their expiry date.
                const revenueCatData = await fetchRevenueCatSubscription(userId);
                await userAuthModel.updateOne(
                    { _id: commonHelper.convertToObjectId(userId) },
                    {
                        $set: {
                            'user_subscription.cancelled_on_unix': moment().unix(),
                            'user_subscription.revenuecat_data': revenueCatData,
                            'user_subscription.last_revenuecat_sync': moment().unix()
                        }
                    }
                );
                // console.log(`✅ Event ${eventType} recorded for user ${userId}`);
                return showResponse(true, `${eventType} recorded`, null, statusCodes.SUCCESS);
            }

            else if (eventType === REVENUECAT_EVENT_TYPES.EXPIRATION ||
                eventType === REVENUECAT_EVENT_TYPES.BILLING_ISSUE) {

                // console.log(REVENUECAT_EVENT_TYPES.EXPIRATION,"EXPIRATIONnnnnnnnnnnnnnnnnnnnnnnnn")
                // console.log(REVENUECAT_EVENT_TYPES.BILLING_ISSUE,"BILLING_ISSUEeeeeeeeeeeeeeeeeeeeeeeeee")
                // EXPIRATION and sometimes BILLING_ISSUE mean the user no longer has access.
                const revenueCatData = await fetchRevenueCatSubscription(userId);
                const subscriptionData = extractSubscriptionData(revenueCatData);
                // console.log(subscriptionData,"subscriptionData")

                if (subscriptionData.isSubscribed) {
                    // Still active on some other entitlement (e.g. grace period, user purchased another plan)
                    const updateFields: any = {
                        'user_subscription.is_subscribed': 1,
                        'user_subscription.package_name': subscriptionData.productId,
                        'user_subscription.next_payment_unix': subscriptionData.expiryDate,
                        'user_subscription.revenuecat_data': revenueCatData,
                        'user_subscription.last_revenuecat_sync': moment().unix()
                    };

                    // const packageName = (subscriptionData.productId || "").toLowerCase();
                    // if (packageName === "yearly_heal") {
                    //     updateFields['sub_credits'] = 2000;
                    // } else if (packageName === "monthly_heal") {
                    //     updateFields['sub_credits'] = 1000;
                    // }

                    await userAuthModel.updateOne(
                        { _id: commonHelper.convertToObjectId(userId) },
                        { $set: updateFields }
                    );
                } else {
                    // Fully expired
                    await userAuthModel.updateOne(
                        { _id: commonHelper.convertToObjectId(userId) },
                        {
                            $set: {
                                'user_subscription.is_subscribed': 0,
                                'user_subscription.package_name': "",
                                'user_subscription.next_payment_unix': 0,
                                'user_subscription.cancelled_on_unix': 0,
                                'user_subscription.revenuecat_data': revenueCatData,
                                'user_subscription.last_revenuecat_sync': moment().unix(),
                                'sub_credits': 0
                            }
                        }
                    );
                }
                // console.log(`✅ Event ${eventType} processed for user ${userId}`);
                return showResponse(true, `${eventType} processed`, null, statusCodes.SUCCESS);
            }

            // For VIRTUAL_CURRENCY_TRANSACTION, EXPERIMENT_ENROLLMENT or any other unhandled event, they are logged at the start
            // console.log(`Log-only event: ${eventType} recorded for user: ${userId}`);
            return showResponse(true, `Event ${eventType} logged`, null, statusCodes.SUCCESS);

        } catch (error: any) {
            logger.error("REVENUECAT_WEBHOOK_ERROR", {
                type: "error",
                message: error.message,
                stack: error.stack,
            });
            return showResponse(false, error?.message || "Webhook failed", error, statusCodes.API_ERROR);
        }
    },

    // ============= CHECK SUBSCRIPTION STATUS (USE THIS IN YOUR MIDDLEWARE) =============

    checkRevenueCatSubscriptionStatus: async (user_id: string): Promise<ApiResponse> => {
        try {
            // First check local database (fast)
            const user: any = await userAuthModel.findOne({
                _id: commonHelper.convertToObjectId(user_id),
                status: USER_STATUS.ACTIVE
            });

            if (!user) {
                return showResponse(false, "User not found", null, statusCodes.API_ERROR);
            }

            const currentTime = moment().unix();
            const nextPayment = user.user_subscription?.next_payment_unix || 0;
            const isLocallySubscribed = user.user_subscription?.is_subscribed === 1 && nextPayment > currentTime;

            if (isLocallySubscribed) {
                return showResponse(true, "Active subscription", {
                    isSubscribed: true,
                    productId: user.user_subscription?.package_name,
                    expiryDate: user.user_subscription?.next_payment_unix,
                    packCredits: user.pack_credits || 0,
                    subCredits: user.sub_credits || 0
                }, statusCodes.SUCCESS);
            }

            // If local shows expired, verify with RevenueCat (in case it renewed)
            // console.log("Verifying with RevenueCat...");
            const revenueCatData = await fetchRevenueCatSubscription(user_id);

            if (revenueCatData) {
                const subscriptionData = extractSubscriptionData(revenueCatData);

                // Update local database
                await userAuthModel.updateOne(
                    { _id: commonHelper.convertToObjectId(user_id) },
                    {
                        $set: {
                            'user_subscription.is_subscribed': subscriptionData.isSubscribed ? 1 : 0,
                            'user_subscription.package_name': subscriptionData.productId,
                            'user_subscription.next_payment_unix': subscriptionData.expiryDate,
                            'user_subscription.purchased_on_unix': subscriptionData.purchaseDate,
                            'user_subscription.last_revenuecat_sync': moment().unix(),
                            'user_subscription.revenuecat_data': revenueCatData
                        }
                    }
                );

                return showResponse(true, "Subscription status", {
                    isSubscribed: subscriptionData.isSubscribed,
                    productId: subscriptionData.productId,
                    expiryDate: subscriptionData.expiryDate,
                    willRenew: subscriptionData.willRenew,
                    packCredits: user.pack_credits || 0,
                    subCredits: user.sub_credits || 0
                }, statusCodes.SUCCESS);
            }

            return showResponse(true, "No active subscription", { isSubscribed: false }, statusCodes.SUCCESS);

        } catch (error: any) {
            logger.error("REVENUECAT_CHECK_STATUS_ERROR", {
                type: "error",
                message: error.message,
                stack: error.stack,
            });
           return showResponse(false, error?.message || "Check failed", error, statusCodes.API_ERROR);
        }
    },

    // ============= SYNC USER WITH REVENUECAT AFTER PURCHASE =============
    // Call this from your frontend after a successful RevenueCat purchase

    syncAfterPurchase: async (user_id: string): Promise<ApiResponse> => {
        try {
            const revenueCatData = await fetchRevenueCatSubscription(user_id);

            if (!revenueCatData) {
                return showResponse(false, "Could not verify subscription with RevenueCat", null, statusCodes.API_ERROR);
            }

            const subscriptionData = extractSubscriptionData(revenueCatData);

            if (!subscriptionData.isSubscribed) {
                return showResponse(false, "No active subscription found", null, statusCodes.API_ERROR);
            }

            const updateData: any = {
                'user_subscription.is_subscribed': 1,
                'user_subscription.package_name': subscriptionData.productId,
                'user_subscription.purchased_on_unix': subscriptionData.purchaseDate,
                'user_subscription.next_payment_unix': subscriptionData.expiryDate,
                'user_subscription.revenuecat_id': user_id,
                'user_subscription.revenuecat_data': revenueCatData,
                'user_subscription.last_revenuecat_sync': moment().unix(),
                'user_subscription.initially_purchased_on_unix': moment().unix()
            };

            const packageName = (subscriptionData.productId || "").toLowerCase();
            if (packageName === "yearly_heal") {
                updateData['sub_credits'] = 2000;
            } else if (packageName === "monthly_heal") {
                updateData['sub_credits'] = 1000;
            }

            await userAuthModel.updateOne(
                { _id: commonHelper.convertToObjectId(user_id) },
                { $set: updateData }
            );

            await userSusbriptionLogsModel.create({
                user_id,
                package_name: subscriptionData.productId,
                subscription_status: "PURCHASE_SYNCED",
                type: "revenuecat",
                revenuecat_event: { sync: true, data: revenueCatData },
                prev_user_subscription_obj: {}
            });

            return showResponse(true, "Subscription synced successfully", {
                productId: subscriptionData.productId,
                expiryDate: subscriptionData.expiryDate
            }, statusCodes.SUCCESS);

        } catch (error: any) {
            logger.error("REVENUECAT_SYNC_ERROR", {
                type: "error",
                message: error.message,
                stack: error.stack,
            });
             return showResponse(false, error?.message || "Sync failed", error, statusCodes.API_ERROR);
        }
    },

    // ============= YOUR EXISTING FUNCTIONS (Keep them as is) =============

    addCredit: async (data: any, user_id: string): Promise<ApiResponse> => {
        // Your existing credit code - keep it exactly the same
        try {
            const { package_name, transaction_id } = data;

            if (!package_name || !transaction_id) {
                return showResponse(false, "package_name and transaction_id required", null, statusCodes.VALIDATION_ERROR);
            }

            const user: any = await userAuthModel.findById(user_id);
            if (!user) {
                return showResponse(false, "User not found", null, statusCodes.API_ERROR);
            }

            const existingLog = await userSusbriptionLogsModel.findOne({ transaction_id });
            if (existingLog) {
                return showResponse(false, "Transaction already used", null, statusCodes.API_ERROR);
            }

            const plan: any = await subscriptionPlans.findOne({
                plan_name: { $regex: `^${package_name}$`, $options: "i" }
            });

            if (!plan || plan.type !== "credit") {
                return showResponse(false, "Invalid credit pack", null, statusCodes.API_ERROR);
            }

            const creditsToAdd = plan.credits || 0;

            await userAuthModel.updateOne(
                { _id: user_id },
                { $inc: { pack_credits: creditsToAdd }, is_credit_pack: true }
            );

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

            return showResponse(true, "Credits added successfully", { credits_added: creditsToAdd }, statusCodes.SUCCESS);

        } catch (error: any) {
            logger.error("ADD_CREDIT_ERROR", {
                type: "error",
                message: error.message,
                stack: error.stack,
            });
            return showResponse(false, error?.message || "Something went wrong", null, statusCodes.API_ERROR);
        
        }
    }
};

export default UserSubscriptionHandler;