"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddUserTheme = void 0;
const joi_1 = __importDefault(require("joi"));
const validateAddUserTheme = (user) => {
    return joi_1.default.object({
        homeTheme_id: joi_1.default.string().trim().required(),
    }).validate(user);
};
exports.validateAddUserTheme = validateAddUserTheme;
