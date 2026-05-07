"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAffirmation = exports.validateResetCommonContent = exports.validateDeleteQuestion = exports.validateUpdateQuestion = exports.validateAddQuestion = exports.validateCommonContent = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateCommonContent = (admin) => {
    return joi_1.default.object({
        type: joi_1.default.string().required().allow('about', 'privacy_policy', 'terms_conditions'),
        content: joi_1.default.string().required(),
        language: joi_1.default.string().required().allow(...Object.values(workflow_constant_1.languages)),
    }).validate(admin);
};
exports.validateCommonContent = validateCommonContent;
const validateAddQuestion = (admin) => {
    return joi_1.default.object({
        question: joi_1.default.string().required(),
        answer: joi_1.default.string().required(),
    }).validate(admin);
};
exports.validateAddQuestion = validateAddQuestion;
const validateUpdateQuestion = (admin) => {
    return joi_1.default.object({
        question_id: joi_1.default.string().required(),
        question: joi_1.default.string().optional(),
        answer: joi_1.default.string().optional(),
        language: joi_1.default.string().required().allow(...Object.values(workflow_constant_1.languages)),
    }).validate(admin);
};
exports.validateUpdateQuestion = validateUpdateQuestion;
const validateDeleteQuestion = (admin) => {
    return joi_1.default.object({
        question_id: joi_1.default.string().required()
    }).validate(admin);
};
exports.validateDeleteQuestion = validateDeleteQuestion;
const validateResetCommonContent = (admin) => {
    return joi_1.default.object({
        type: joi_1.default.string().required().allow('about', 'privacy_policy', 'terms_conditions'),
    }).validate(admin);
};
exports.validateResetCommonContent = validateResetCommonContent;
const validateAffirmation = (admin) => {
    return joi_1.default.object({
        affirmation_id: joi_1.default.string().required()
    }).validate(admin);
};
exports.validateAffirmation = validateAffirmation;
