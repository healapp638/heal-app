"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateModuleDetails = exports.validateDeleteModule = exports.validateUpdateModule = exports.validateCreateModule = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCreateModule = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateModule = validateCreateModule;
const validateUpdateModule = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().optional().allow(''),
        moduleId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateUpdateModule = validateUpdateModule;
const validateDeleteModule = (common) => {
    return joi_1.default.object({
        moduleId: joi_1.default.string().trim().required(),
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
