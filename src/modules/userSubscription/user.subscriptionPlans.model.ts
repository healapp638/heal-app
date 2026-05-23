import { Schema, model } from 'mongoose';

const susbriptionPlansSchema = new Schema(
    {
        plan_name: {
            type: String,
            default: "",
        },
        duration_in_days: {
            type: Number,
            default: 30,
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
        versionKey: false,
        timestamps: true
    },

)
export default model('susbriptionPlans', susbriptionPlansSchema, "susbription_plans")

