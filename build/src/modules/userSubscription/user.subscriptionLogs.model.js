"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subscriptionLogsSchema = new mongoose_1.Schema({
    package_name: {
        type: String,
    },
    subscription_status: {
        type: String,
    },
    // stripe_customer_id:
    // {
    //     type: String,
    //     default: ""
    // },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
    },
    type: {
        type: String,
        default: "stripe", //android, ios
    },
    prev_user_subscription_obj: {
        type: Object,
        default: {},
    },
    // stripe_event: {
    //     type: Object,
    //     default: {},
    // },
    // ios_event: {
    //     type: Object,
    //     default: {},
    // },
    // android_event: {
    //     type: Object,
    //     default: {},
    // },
    revenuecat_event: {
        type: Object,
        default: {},
    },
    // NEW: Credit pack specific fields (if you have credit purchases)
    transaction_id: {
        type: String,
        default: "",
        index: true, // Add index to prevent duplicate transactions
    },
    credits_added: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: "USD",
    },
    // NEW: RevenueCat specific identifiers
    original_transaction_id: {
        type: String,
        default: "",
        index: true, // For looking up by transaction ID
    },
    // revenuecat_id: {
    //     type: String,
    //     default: "",
    //     index: true, // For looking up by RevenueCat user ID
    // },
    // NEW: Store platform info
    store: {
        type: String,
        // enum: ['', 'app_store', 'play_store', 'stripe', 'revenuecat'],
        default: '',
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    timestamps: true
});
exports.default = (0, mongoose_1.model)('subscriptionLogs', subscriptionLogsSchema, "subscription_logs");
