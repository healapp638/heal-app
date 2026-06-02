"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const susbriptionPlansSchema = new mongoose_1.Schema({
    plan_name: {
        type: String,
        default: "",
    },
    // duration_in_days: {
    //     type: Number,
    //     default: 30,
    // },
    credits: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        default: "normal",
    },
    amount: {
        type: Number,
    },
    apple_id: {
        type: String,
        default: "",
    },
    google_id: {
        type: String,
        default: "",
    },
    status: {
        type: Number,
        default: 1, //1:active, 2: inactive, 3 delete
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    timestamps: true
});
exports.default = (0, mongoose_1.model)('susbriptionPlans', susbriptionPlansSchema, "susbription_plans");
