"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHomeThemeDetails = exports.validateThemeDetails = exports.validateHomeTheme = exports.validateDeleteHomeTheme = exports.validateDeleteTheme = exports.validateAffirmation = exports.validateUpdateHometheme = exports.validateUpdateTheme = exports.validateCreateHomeTheme = exports.validateCreateTheme = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateCreateTheme = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().trim().required(),
        imgUrl: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateTheme = validateCreateTheme;
const validateCreateHomeTheme = (common) => {
    return joi_1.default.object({
        categoryTheme_id: joi_1.default.string().trim().required(),
        imgUrl: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateHomeTheme = validateCreateHomeTheme;
const validateUpdateTheme = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().optional().allow(''),
        imgUrl: joi_1.default.string().optional().allow(''),
        lang: joi_1.default.string().trim().required(),
        themeCategoryId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateUpdateTheme = validateUpdateTheme;
const validateUpdateHometheme = (common) => {
    return joi_1.default.object({
        hometheme_id: joi_1.default.string().optional().allow(''),
        imgUrl: joi_1.default.string().optional().allow(''),
    }).validate(common);
};
exports.validateUpdateHometheme = validateUpdateHometheme;
const validateAffirmation = (common) => {
    return joi_1.default.object({
        affirmation_id: joi_1.default.string().optional()
    }).validate(common);
};
exports.validateAffirmation = validateAffirmation;
const validateDeleteTheme = (common) => {
    return joi_1.default.object({
        themeCategoryId: joi_1.default.string().trim().required(),
        status: joi_1.default.number().required().allow(workflow_constant_1.USER_STATUS.ACTIVE, workflow_constant_1.USER_STATUS.DEACTIVATED, workflow_constant_1.USER_STATUS.DELETED),
    }).validate(common);
};
exports.validateDeleteTheme = validateDeleteTheme;
const validateDeleteHomeTheme = (common) => {
    return joi_1.default.object({
        hometheme_id: joi_1.default.string().trim().required(),
        status: joi_1.default.number().required().allow(workflow_constant_1.USER_STATUS.ACTIVE, workflow_constant_1.USER_STATUS.DEACTIVATED, workflow_constant_1.USER_STATUS.DELETED),
    }).validate(common);
};
exports.validateDeleteHomeTheme = validateDeleteHomeTheme;
const validateHomeTheme = (common) => {
    return joi_1.default.object({
        themeCategoryId: joi_1.default.string().trim().required(),
        status: joi_1.default.number().required().allow(workflow_constant_1.USER_STATUS.ACTIVE, workflow_constant_1.USER_STATUS.DEACTIVATED, workflow_constant_1.USER_STATUS.DELETED),
    }).validate(common);
};
exports.validateHomeTheme = validateHomeTheme;
const validateThemeDetails = (common) => {
    return joi_1.default.object({
        themeCategoryId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateThemeDetails = validateThemeDetails;
const validateHomeThemeDetails = (common) => {
    return joi_1.default.object({
        hometheme_id: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateHomeThemeDetails = validateHomeThemeDetails;
