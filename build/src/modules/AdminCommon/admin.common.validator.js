"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteQuestion = exports.validateUpdateQuestion = exports.validateAddQuestion = exports.validateCommonContent = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCommonContent = (admin) => {
    return joi_1.default.object({
        about: joi_1.default.string().optional(),
        privacy_policy: joi_1.default.string().optional(),
        terms_conditions: joi_1.default.string().optional(),
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
    }).validate(admin);
};
exports.validateUpdateQuestion = validateUpdateQuestion;
const validateDeleteQuestion = (admin) => {
    return joi_1.default.object({
        question_id: joi_1.default.string().required()
    }).validate(admin);
};
exports.validateDeleteQuestion = validateDeleteQuestion;
