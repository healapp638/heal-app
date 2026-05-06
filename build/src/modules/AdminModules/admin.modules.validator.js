"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateListModule = exports.validateModuleDetails = exports.validateDeleteModule = exports.validateUpdateModule = exports.validateCreateModule = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateCreateModule = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().trim().required(),
        themeId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateModule = validateCreateModule;
const validateUpdateModule = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().optional().allow(''),
        moduleId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
    }).validate(common);
};
exports.validateUpdateModule = validateUpdateModule;
const validateDeleteModule = (common) => {
    return joi_1.default.object({
        moduleId: joi_1.default.string().trim().required(),
        status: joi_1.default.number().required().allow(workflow_constant_1.USER_STATUS.ACTIVE, workflow_constant_1.USER_STATUS.DEACTIVATED, workflow_constant_1.USER_STATUS.DELETED),
    }).validate(common);
};
exports.validateDeleteModule = validateDeleteModule;
const validateModuleDetails = (common) => {
    return joi_1.default.object({
        moduleId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateModuleDetails = validateModuleDetails;
const validateListModule = (common) => {
    return joi_1.default.object({
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
        search: joi_1.default.string().optional(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
        themeId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateListModule = validateListModule;
