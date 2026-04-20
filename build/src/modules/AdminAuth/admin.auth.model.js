"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workflow_constant_1 = require("../../constants/workflow.constant");
const AdminSchema = new mongoose_1.Schema({
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    email: { type: String },
    password: { type: String },
    profile_pic: { type: String, default: "" },
    user_type: { type: Number, default: workflow_constant_1.ROLE.ADMIN },
    otp: { type: Number, default: null },
    phone_number: { type: String, default: null },
    country_code: { type: String, default: null },
    is_verified: { type: Boolean, default: true },
    os_type: { type: String, default: '' },
    greet_msg: { type: Boolean, default: true },
    status: { type: Number, default: workflow_constant_1.USER_STATUS.ACTIVE },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    // collection: 'admin'
    timestamps: true
});
// Define a virtual property for full_name
AdminSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`.trim();
});
exports.default = (0, mongoose_1.model)('admin', AdminSchema);
