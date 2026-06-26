"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteAccount = exports.validateGetCommonContent = exports.validateStoreParmeterToAws = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateStoreParmeterToAws = (common) => {
    return joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        value: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateStoreParmeterToAws = validateStoreParmeterToAws;
const validateGetCommonContent = (common) => {
    return joi_1.default.object({
        lang: joi_1.default.string().trim().required().allow(...Object.values(workflow_constant_1.languages)),
        type: joi_1.default.string().trim().required().allow('about', 'privacy_policy', 'terms_conditions'),
    }).validate(common);
};
exports.validateGetCommonContent = validateGetCommonContent;
const validateDeleteAccount = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        otp: joi_1.default.string().required(),
    }).validate(user);
};
exports.validateDeleteAccount = validateDeleteAccount;
