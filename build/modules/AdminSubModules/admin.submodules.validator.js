"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateListSubModule = exports.validateSubModuleDetails = exports.validateDeleteSubModule = exports.validateUpdateSubModule = exports.validateCreateSubModule = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateCreateSubModule = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().trim().required(),
        moduleId: joi_1.default.string().trim().required(),
        description: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateSubModule = validateCreateSubModule;
const validateUpdateSubModule = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().optional().allow(''),
        subModuleId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
        description: joi_1.default.string().trim().optional().allow(''),
    }).validate(common);
};
exports.validateUpdateSubModule = validateUpdateSubModule;
const validateDeleteSubModule = (common) => {
    return joi_1.default.object({
        subModuleId: joi_1.default.string().trim().required(),
        status: joi_1.default.number().required().allow(workflow_constant_1.USER_STATUS.ACTIVE, workflow_constant_1.USER_STATUS.DEACTIVATED, workflow_constant_1.USER_STATUS.DELETED),
    }).validate(common);
};
exports.validateDeleteSubModule = validateDeleteSubModule;
const validateSubModuleDetails = (common) => {
    return joi_1.default.object({
        subModuleId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateSubModuleDetails = validateSubModuleDetails;
const validateListSubModule = (common) => {
    return joi_1.default.object({
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
        search: joi_1.default.string().optional(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
        moduleId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateListSubModule = validateListSubModule;
