"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const completed_phase_schema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    phase_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'phase' },
    sub_module_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'submodule' },
    status: { type: Number, default: workflow_constant_1.USER_STATUS.ACTIVE },
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('completed_phase', completed_phase_schema);
