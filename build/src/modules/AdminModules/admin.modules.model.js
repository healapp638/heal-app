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
const moduleSchema = new mongoose_1.default.Schema({
    themeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Theme', default: null },
    title: langSchema,
    status: { type: Number, default: workflow_constant_1.USER_STATUS.ACTIVE },
}, { timestamps: true, versionKey: false });
moduleSchema.index({ themeId: 1, "title.en": 1 }, { unique: true });
exports.default = mongoose_1.default.model('Module', moduleSchema);
