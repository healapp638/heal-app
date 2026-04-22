"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateThemeDetails = exports.validateDeleteTheme = exports.validateUpdateTheme = exports.validateCreateTheme = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCreateTheme = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().trim().required(),
        description: joi_1.default.string().trim().required(),
        imgUrl: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateTheme = validateCreateTheme;
const validateUpdateTheme = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().optional().allow(''),
        description: joi_1.default.string().optional().allow(''),
        imgUrl: joi_1.default.string().optional().allow(''),
        lang: joi_1.default.string().trim().required(),
        themeId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateUpdateTheme = validateUpdateTheme;
const validateDeleteTheme = (common) => {
    return joi_1.default.object({
        themeId: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateDeleteTheme = validateDeleteTheme;
const validateThemeDetails = (common) => {
    return joi_1.default.object({
        themeId: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateThemeDetails = validateThemeDetails;
