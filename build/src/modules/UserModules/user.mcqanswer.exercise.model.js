"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const mcqAnswerSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    mcq_exercise_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'mcqExercise',
        required: true,
    },
    mcq_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    status: { type: Number, default: workflow_constant_1.USER_STATUS.ACTIVE },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model('mcqAnswerExercise', mcqAnswerSchema);
