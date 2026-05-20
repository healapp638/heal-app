"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const moment_1 = __importDefault(require("moment"));
const langSchema = {
    en: { type: String, default: '' },
    zh: { type: String, default: '' },
    hi: { type: String, default: '' },
    es: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
    ru: { type: String, default: '' },
    pt: { type: String, default: '' },
    it: { type: String, default: '' },
    ro: { type: String, default: '' },
};
const daily_challenges = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserAuth',
    },
    title: {
        type: langSchema
    },
    status: {
        type: Number,
        default: workflow_constant_1.USER_STATUS.ACTIVE
    },
    points: {
        type: Number,
        default: 0
    },
    exercises: [
        {
            title: { type: langSchema },
            step_number: { type: Number }
        }
    ],
    challenge_type: {
        type: String,
        enum: ['daily', 'weekly']
    },
    //after 24 hour from now
    end_date_unix: {
        type: Number,
        default: () => {
            const endOfDay = (0, moment_1.default)().endOf('day').unix();
            return endOfDay;
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const userDailyChallengesModel = mongoose_1.default.model('daily_challenges', daily_challenges, 'daily_challenges');
exports.default = userDailyChallengesModel;
