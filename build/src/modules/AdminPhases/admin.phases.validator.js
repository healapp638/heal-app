"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateListPhase = exports.validatePhaseDetails = exports.validateDeletePhase = exports.validateUpdatePhase = exports.validateCreatePhase = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateCreatePhase = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().trim().required(),
        points: joi_1.default.number().required(),
        subModuleId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreatePhase = validateCreatePhase;
const validateUpdatePhase = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().optional().allow(''),
        points: joi_1.default.number().optional(),
        phaseId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
    }).validate(common);
};
exports.validateUpdatePhase = validateUpdatePhase;
const validateDeletePhase = (common) => {
    return joi_1.default.object({
        phaseId: joi_1.default.string().trim().required(),
        status: joi_1.default.number().required().allow(workflow_constant_1.USER_STATUS.ACTIVE, workflow_constant_1.USER_STATUS.DEACTIVATED, workflow_constant_1.USER_STATUS.DELETED),
    }).validate(common);
};
exports.validateDeletePhase = validateDeletePhase;
const validatePhaseDetails = (common) => {
    return joi_1.default.object({
        phaseId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validatePhaseDetails = validatePhaseDetails;
const validateListPhase = (common) => {
    return joi_1.default.object({
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
        search: joi_1.default.string().optional(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
        subModuleId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateListPhase = validateListPhase;
