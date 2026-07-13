"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workflow_constant_1 = require("../../constants/workflow.constant");
const ContactUsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: workflow_constant_1.USER_STATUS.ACTIVE
    },
    is_reply: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    timestamps: true
});
exports.default = (0, mongoose_1.model)('contact_us', ContactUsSchema);
