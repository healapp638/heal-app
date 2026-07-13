"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProfile = exports.validateChangePassword = exports.validateResetPassword = exports.validateForgotPassword = exports.validateRegister = exports.validateAdminLogin = exports.validateResendOtp = exports.validateVerifyOtp = exports.validateFileUpload = void 0;
const joi_1 = __importDefault(require("joi"));
const validateFileUpload = (user) => {
    return joi_1.default.object({
        media_type: joi_1.default.number().valid(1, 2).error(new Error('media_type 1 for image 2 for video')).required(),
    }).validate(user);
};
exports.validateFileUpload = validateFileUpload;
const validateVerifyOtp = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        otp: joi_1.default.string().min(4).max(20).required(),
    }).validate(user);
};
exports.validateVerifyOtp = validateVerifyOtp;
const validateResendOtp = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
    }).validate(user);
};
exports.validateResendOtp = validateResendOtp;
const validateAdminLogin = (admin) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        password: joi_1.default.string().min(4).max(20).required(),
    }).validate(admin);
};
exports.validateAdminLogin = validateAdminLogin;
const validateRegister = (admin) => {
    return joi_1.default.object({
        first_name: joi_1.default.string().trim().min(4).max(20).required(),
        last_name: joi_1.default.string().min(4).max(20).required(),
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        password: joi_1.default.string().min(4).max(20).required(),
    }).validate(admin);
};
exports.validateRegister = validateRegister;
const validateForgotPassword = (admin) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required()
    }).validate(admin);
};
exports.validateForgotPassword = validateForgotPassword;
const validateResetPassword = (admin) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        new_password: joi_1.default.string().min(4).max(20).required(),
        otp: joi_1.default.string().required(),
    }).validate(admin);
};
exports.validateResetPassword = validateResetPassword;
const validateChangePassword = (admin) => {
    return joi_1.default.object({
        old_password: joi_1.default.string().min(4).max(20).required(),
        new_password: joi_1.default.string().min(4).max(20).required(),
    }).validate(admin);
};
exports.validateChangePassword = validateChangePassword;
const validateUpdateProfile = (admin) => {
    return joi_1.default.object({
        first_name: joi_1.default.string().optional().allow(''),
        last_name: joi_1.default.string().optional().allow(''),
        phone_number: joi_1.default.string().optional().allow(''),
        country_code: joi_1.default.string().optional().allow(''),
        greet_msg: joi_1.default.boolean().optional().allow(''),
    }).validate(admin);
};
exports.validateUpdateProfile = validateUpdateProfile;
