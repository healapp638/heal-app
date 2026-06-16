import { Schema, model } from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';
const UserSchema = new Schema(
    {
        hearAboutUs: { type: String, default: "" },
        howFellingLately: { type: String, default: "" },
        bringsYouHere: { type: String, default: "" },
        startShowingOfYourSelf:{ type: String, default: "" },
        feelThatWay: { type: String, default: "" },
        likeToFellMore: { type: String, default: "" },
        helpFeelBetter: { type: String, default: "" },
        stopFeelBetter: { type: String, default: "" },
        timeYouCommit: { type: String, default: "" },
        goalStartWith: { type: String, default: "" },
        fullName: { type: String, default: "" },
        // country: { type: String, default: "" },
        email: { type: String, default: "", index: true },
        // dob: { type: Date, default: "" },
        // password: { type: String, default: "" },
        // otp: { type: String, default: null },
        // otpCreatedAt: { type: Date, default: null },
        profilePic: { type: String, default: "file/file-1777357630130.webp" },
        isVerified: { type: Boolean, default: true },
        deactivateBy: { type: String },
        reason: { type: String },
        status: { type: Number, default: USER_STATUS.ACTIVE },
        language: { type: String, default: "en" },
        trial_package_use:{type:Boolean,default:false},
        on_trial_period:{type:Boolean,default:false},
        trial_expire_time:{type:String,default:""},
        // first_name: { type: String, default: "" },


        //******Use When Social Login Used******/
        social_account: [{
            source: {
                type: String,
                default: null
            },
            email: {
                type: String,
                default: null
            },
            token: {
                type: String,
                default: null
            },
            name: {
                type: String,
                default: null
            }

        }],
        account_source: {
            type: String,
            default: 'email',
            Comment: "email for normal created google with google apple with apple "
        },
        // is_biometric: { type: Boolean, default: false },
        timeZone: { type: String, default: "" },
        is_onboarding :{ type: Boolean, default: false },
        lastDailyChallengeGeneratedDate: { type: Date, default: null },
        lastWeeklyChallengeGeneratedDate: { type: Date, default: null },
        isDailyChallengeInProgress: { type: Boolean, default: false },
        isWeeklyChallengeInProgress: { type: Boolean, default: false },
        streak_count: { type: Number, default: 0 },
        streak_credit: { type: Number, default: 0 },
        subs_credit:{ type: Number, default: 0 },
        streak_days:{ type: [Number], default: [] },
        last_streak_date: { type: String, default: "" }, // YYYY-MM-DD in user timezone
        extra_credits:{ type: Number, default: 0 },
        sub_credits:{ type: Number, default: 0 },
        pack_credits:{type:Number,default:0},
        is_credit_pack:{type:Boolean,default:false},
        pack_name:{type:String,default:""},
        //***Use When Purchase Used */
        user_subscription: {
            is_subscribed: {
                type: Number,
                default: 0 //default 0, 1: will when active and cancel time till the end of period
            },
            purchased_in_device: {
                type: String,
                default: '', //stripe, android, ios
                Comment: "Device type"
            },
            package_name: {
                type: String,
                default: '',
                Comment: "mobile side created package name"
            },
            original_transaction_id: {
                type: String,
                default: '',
                Comment: "ios subscribe time"
            },
            subscribed_price: {
                type: String,
                default: '',
                Comment: "subscribed price"
            },
            subscribed_currency: {
                type: String,
                default: '',
                Comment: "subscribed currency"
            },
            android_order_id: {
                type: String,
                default: '',
                Comment: "android subscribe time"
            },
            purchase_token: { //have no usage it for now
                type: String,
                default: '',
                Comment: "android subscribe time"
            },
            cancelled_on_unix: {
                type: Number,
                default: 0,
            },
            trial_period_start_unix: {
                type: Number,
                default: 0,
            },
            trial_period_end_unix: {
                type: Number,
                default: 0,
            },
            initially_purchased_on_unix: {
                type: Number,
                default: 0,
            },
            purchased_on_unix: {
                type: Number,
                default: 0,
            },
            next_payment_unix: {
                type: Number,
                default: 0,
            },
            // stripe_subscription_obj: {
            //     type: Object,
            //     default: {},
            // },
            app_subscription_obj: {
                type: Object,
                default: {},
            },
            // ============= NEW REVENUECAT FIELDS =============
            revenuecat_id: {
                type: String,
                default: '',
                index: true, // Important: for looking up by RevenueCat ID
                Comment: "RevenueCat's unique user identifier"
            },
            revenuecat_data: {
                type: Object,
                default: {},
                Comment: "Full customer info from RevenueCat"
            },
            revenuecat_entitlements: {
                type: Object,
                default: {},
                Comment: "User's entitlements from RevenueCat"
            },
            last_revenuecat_sync: {
                type: Number,
                default: 0,
                Comment: "Last time we synced with RevenueCat"
            },
            
            // Store platform for RevenueCat purchases
            store: {
                type: String,
                enum: ['', 'app_store', 'play_store', 'stripe', 'revenuecat'],
                default: '',
                Comment: "Which store processed the purchase"
            },
            
            // Subscription renewal info
            will_renew: {
                type: Boolean,
                default: true,
                Comment: "Whether subscription will auto-renew"
            },
            grace_period_end_unix: {
                type: Number,
                default: 0,
                Comment: "If billing issue, grace period end date"
            },
            unsubscribe_detected_at: {
                type: Number,
                default: 0,
                Comment: "When user turned off auto-renew"
            },
            billing_issue_detected_at: {
                type: Number,
                default: 0,
                Comment: "When billing issue was detected"
            }
        },
        
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
        versionKey: false,
        timestamps: true
    },

)

export default model('user', UserSchema)