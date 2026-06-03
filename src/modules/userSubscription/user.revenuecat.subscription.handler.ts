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
import crypto from 'crypto';

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
async function fetchRevenueCatSubscription(appUserId: string) {
    try {
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
    } catch (error) {
        console.error('Error fetching RevenueCat subscription:', error);
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
    } catch (error) {
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
function verifyWebhookSignature(payload: any, signature: string, authorization?: string): boolean {
    try {
        console.log(payload, signature, 'payload signature')
        
        // 1. Check if they used the Authorization header instead of HMAC signature
        const expectedAuth = authorization?.replace('Bearer ', '').trim();
        if (expectedAuth && expectedAuth === REVENUECAT_WEBHOOK_SECRET) {
            console.log('✅ Validated using Authorization header');
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
        console.log(crypto.timingSafeEqual(sigBuffer, expectedSigBuffer), 'crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)')
        
        return crypto.timingSafeEqual(sigBuffer, expectedSigBuffer);
    } catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
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
            console.log("📨 RevenueCat webhook received");
            
            // Verify webhook signature (security)
            if (!verifyWebhookSignature(data, signature, authorization)) {
                console.error("❌ Invalid webhook signature");
                return showResponse(false, "Invalid webhook signature", null, statusCodes.VALIDATION_ERROR);
            }
            
            const event = data.event;
            const customerInfo = data.customer_info;
            const userId = customerInfo?.app_user_id;
            const eventType = event?.type;
            
            console.log(`Event: ${eventType} for user: ${userId}`);
            
            if (!userId) {
                return showResponse(false, "User ID missing", null, statusCodes.API_ERROR);
            }
            
            // Find user in database
            let userDetails:any = await userAuthModel.findOne({
                _id: commonHelper.convertToObjectId(userId),
                status: { $ne: USER_STATUS.DELETED }
            });
            
            if (!userDetails) {
                console.log(`User ${userId} not found, retrying...`);
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
                revenuecat_event: {
                    event_type: eventType,
                    event_timestamp: event?.timestamp,
                    payload: data
                },
                prev_user_subscription_obj: userDetails?.user_subscription || {}
            };
            
            if (userDetails) {
                logData.user_id = userId;
                logData.package_name = data.product_id;
            }
            
            await userSusbriptionLogsModel.create(logData);
            
            if (!userDetails) {
                return showResponse(true, "Webhook logged (user not found)", null, statusCodes.SUCCESS);
            }
            
            // Process based on event type
            if (eventType === REVENUECAT_EVENT_TYPES.INITIAL_PURCHASE ||
                eventType === REVENUECAT_EVENT_TYPES.RENEWAL) {

                    console.log("Processing initial purchase or renewal");
                    console.log(eventType,"eventType")
                
                // Get full subscription details from RevenueCat
                const revenueCatData = await fetchRevenueCatSubscription(userId);
                const subscriptionData = extractSubscriptionData(revenueCatData);
                
                const updateData: any = {
                    'user_subscription.is_subscribed': 1,
                    'user_subscription.purchased_in_device': data.store || 'revenuecat',
                    'user_subscription.package_name': subscriptionData.productId,
                    'user_subscription.original_transaction_id': data.transaction_id || "",
                    'user_subscription.cancelled_on_unix': 0,
                    'user_subscription.purchased_on_unix': subscriptionData.purchaseDate,
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
                
                await userAuthModel.updateOne(
                    { _id: commonHelper.convertToObjectId(userId) },
                    { $set: updateData }
                );
                
                console.log(`✅ Subscription activated for user ${userId}`);
                return showResponse(true, "Subscription activated", null, statusCodes.SUCCESS);
            }
            
            else if (eventType === REVENUECAT_EVENT_TYPES.CANCELLATION) {
                await userAuthModel.updateOne(
                    { _id: commonHelper.convertToObjectId(userId) },
                    {
                        $set: {
                            'user_subscription.cancelled_on_unix': moment().unix(),
                            'user_subscription.revenuecat_data': await fetchRevenueCatSubscription(userId),
                            'user_subscription.last_revenuecat_sync': moment().unix()
                        }
                    }
                );
                return showResponse(true, "Cancellation recorded", null, statusCodes.SUCCESS);
            }
            
            else if (eventType === REVENUECAT_EVENT_TYPES.EXPIRATION) {
                await userAuthModel.updateOne(
                    { _id: commonHelper.convertToObjectId(userId) },
                    {
                        $set: {
                            'user_subscription.is_subscribed': 0,
                            'user_subscription.package_name': "",
                            'user_subscription.next_payment_unix': 0,
                            'user_subscription.cancelled_on_unix': 0,
                            'user_subscription.revenuecat_data': await fetchRevenueCatSubscription(userId),
                            'user_subscription.last_revenuecat_sync': moment().unix()
                        }
                    }
                );
                return showResponse(true, "Expiration recorded", null, statusCodes.SUCCESS);
            }
            
            return showResponse(true, `Event ${eventType} logged`, null, statusCodes.SUCCESS);
            
        } catch (error: any) {
            console.error("RevenueCat webhook error:", error);
            return showResponse(false, error?.message || "Webhook failed", error, statusCodes.API_ERROR);
        }
    },
    
    // ============= CHECK SUBSCRIPTION STATUS (USE THIS IN YOUR MIDDLEWARE) =============
    
    checkRevenueCatSubscriptionStatus: async (user_id: string): Promise<ApiResponse> => {
        try {
            // First check local database (fast)
            const user:any = await userAuthModel.findOne({
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
                    expiryDate: user.user_subscription?.next_payment_unix
                }, statusCodes.SUCCESS);
            }
            
            // If local shows expired, verify with RevenueCat (in case it renewed)
            console.log("Verifying with RevenueCat...");
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
                    willRenew: subscriptionData.willRenew
                }, statusCodes.SUCCESS);
            }
            
            return showResponse(true, "No active subscription", { isSubscribed: false }, statusCodes.SUCCESS);
            
        } catch (error: any) {
            console.error("Error checking subscription:", error);
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
            console.error("Sync error:", error);
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
                { $inc: { extra_credits: creditsToAdd }, is_credit_pack: true }
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
            console.error("Credit error:", error);
            return showResponse(false, error?.message || "Something went wrong", null, statusCodes.API_ERROR);
        }
    }
};

export default UserSubscriptionHandler;