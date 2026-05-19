"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const completed_lesson_schema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    exercise_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'mcqExercise' },
    // exercise_details_id: { type: mongoose.Schema.Types.ObjectId, ref: 'exercise_detail' },
    phase_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'phase' },
    status: { type: Number, default: workflow_constant_1.USER_STATUS.ACTIVE },
    reflection: { type: String, default: "" }
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('completed_lesson', completed_lesson_schema);
