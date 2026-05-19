"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workflow_constant_1 = require("../../constants/workflow.constant");
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
const mcqOptionSchema = new mongoose_1.default.Schema({
    option: langSchema,
}, {
    _id: true,
    versionKey: false,
});
const mcqexerciseSchema = new mongoose_1.default.Schema({
    title: langSchema,
    description: langSchema,
    phase_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Phase', default: null },
    mcq: [mcqOptionSchema],
    status: { type: Number, default: workflow_constant_1.USER_STATUS.ACTIVE },
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('mcqExercise', mcqexerciseSchema);
