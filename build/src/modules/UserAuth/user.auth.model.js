"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workflow_constant_1 = require("../../constants/workflow.constant");
const UserSchema = new mongoose_1.Schema({
    hearAboutUs: { type: String, default: "" },
    bringsYouHere: { type: String, default: "" },
    howFellingLately: { type: String, default: "" },
    likeToFellMore: { type: String, default: "" },
    timeYouCommit: { type: String, default: "" },
    startShowingOfYourSelf: { type: String, default: "" },
    fullName: { type: String, default: "" },
    country: { type: String, default: "" },
    email: { type: String, default: "", index: true },
    dob: { type: Date, default: "" },
    password: { type: String, default: "" },
    otp: { type: String, default: null },
    otpCreatedAt: { type: Date, default: null },
    profilePic: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    deactivateBy: { type: String },
    reason: { type: String },
    status: { type: Number, default: workflow_constant_1.USER_STATUS.ACTIVE },
    language: { type: String, default: "en" },
    first_name: { type: String, default: "" },
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
    timeZone: { type: String, default: "" },
    lastDailyChallengeGeneratedDate: { type: Date, default: null },
    lastWeeklyChallengeGeneratedDate: { type: Date, default: null },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    timestamps: true
});
exports.default = (0, mongoose_1.model)('user', UserSchema);
