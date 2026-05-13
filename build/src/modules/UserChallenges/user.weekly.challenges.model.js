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
const weekly_challenges = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserAuth',
    },
    title: {
        type: langSchema
    },
    description: {
        type: langSchema,
    },
    status: {
        type: Number,
        default: workflow_constant_1.USER_STATUS.ACTIVE
    },
    points: {
        type: Number,
        default: 0
    },
    concept_title: {
        type: langSchema
    },
    concept_description: {
        type: langSchema
    },
    about_challenge: {
        type: langSchema
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
    //after 7 day from now
    end_date_unix: {
        type: Number,
        default: () => {
            const endOfWeek = (0, moment_1.default)().endOf('week').unix();
            return endOfWeek;
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const userWeeklyChallengesModel = mongoose_1.default.model('weekly_challenges', weekly_challenges, 'weekly_challenges');
exports.default = userWeeklyChallengesModel;
