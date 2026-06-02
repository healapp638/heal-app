"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCompleteOnboarding = exports.validateDeleteOrDeactivation = exports.validateRefreshToken = exports.validateSocialLogin = exports.validateUpdateProfile = exports.validateChangePassword = exports.validateResetPassword = exports.validateForgotPassword = exports.validateResendOtp = exports.validateVerifyOtp = exports.validateSendMagicLinkLogin = exports.validateSendMagicLink = exports.validateRegister = exports.validateLoginUser = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateLoginUser = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        password: joi_1.default.string().min(4).max(20).required(),
        language: joi_1.default.string().optional().allow(...Object.values(workflow_constant_1.languages)),
        timeZone: joi_1.default.string().optional().allow(''),
    }).validate(user);
};
exports.validateLoginUser = validateLoginUser;
const validateRegister = (user) => {
    return joi_1.default.object({
        hearAboutUs: joi_1.default.string().optional().allow(''),
        bringsYouHere: joi_1.default.string().optional().allow(''),
        howFeelingLately: joi_1.default.string().optional().allow(''),
        likeToFellMore: joi_1.default.string().optional().allow(''),
        timeYouCommit: joi_1.default.string().optional().allow(''),
        startShowingOfYourSelf: joi_1.default.string().optional().allow(''),
        fullName: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
        email: joi_1.default.string().trim().email().required(),
        dob: joi_1.default.string().required(),
        password: joi_1.default.string().min(4).required(),
        language: joi_1.default.string().optional().allow(...Object.values(workflow_constant_1.languages)),
    }).validate(user);
};
exports.validateRegister = validateRegister;
const validateSendMagicLink = (user) => {
    return joi_1.default.object({
        hearAboutUs: joi_1.default.string().optional().allow(''),
        howFellingLately: joi_1.default.string().optional().allow(''),
        feelThatWay: joi_1.default.string().optional().allow(''),
        likeToFellMore: joi_1.default.string().optional().allow(''),
        helpFeelBetter: joi_1.default.string().optional().allow(''),
        stopFeelBetter: joi_1.default.string().optional().allow(''),
        timeYouCommit: joi_1.default.string().optional().allow(''),
        goalStartWith: joi_1.default.string().optional().allow(''),
        fullName: joi_1.default.string().optional().allow(''),
        email: joi_1.default.string().trim().email().required(),
        language: joi_1.default.string().optional().valid(...Object.values(workflow_constant_1.languages)).allow(''),
    }).validate(user);
};
exports.validateSendMagicLink = validateSendMagicLink;
const validateSendMagicLinkLogin = (user) => {
    return joi_1.default.object({
        hearAboutUs: joi_1.default.string().optional().allow(''),
        howFellingLately: joi_1.default.string().optional().allow(''),
        feelThatWay: joi_1.default.string().optional().allow(''),
        likeToFellMore: joi_1.default.string().optional().allow(''),
        helpFeelBetter: joi_1.default.string().optional().allow(''),
        stopFeelBetter: joi_1.default.string().optional().allow(''),
        timeYouCommit: joi_1.default.string().optional().allow(''),
        goalStartWith: joi_1.default.string().optional().allow(''),
        fullName: joi_1.default.string().max(40).required().allow(''),
        email: joi_1.default.string().trim().email().required(),
        language: joi_1.default.string().optional().valid(...Object.values(workflow_constant_1.languages)).allow(''),
        timeZone: joi_1.default.string().optional().allow(''),
        code: joi_1.default.string().optional().allow(''),
    }).validate(user);
};
exports.validateSendMagicLinkLogin = validateSendMagicLinkLogin;
const validateVerifyOtp = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        otp: joi_1.default.string().min(4).max(20).required(),
        password: joi_1.default.string().optional().allow(''),
    }).validate(user);
};
exports.validateVerifyOtp = validateVerifyOtp;
const validateResendOtp = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
    }).validate(user);
};
exports.validateResendOtp = validateResendOtp;
const validateForgotPassword = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required()
    }).validate(user);
};
exports.validateForgotPassword = validateForgotPassword;
const validateResetPassword = (user) => {
    return joi_1.default.object({
        email: joi_1.default.string().trim().email().min(4).max(35).required(),
        new_password: joi_1.default.string().min(4).max(20).required(),
        otp: joi_1.default.string().required(),
    }).validate(user);
};
exports.validateResetPassword = validateResetPassword;
const validateChangePassword = (user) => {
    return joi_1.default.object({
        old_password: joi_1.default.string().min(4).max(20).required(),
        new_password: joi_1.default.string().min(4).max(20).required(),
    }).validate(user);
};
exports.validateChangePassword = validateChangePassword;
const validateUpdateProfile = (user) => {
    return joi_1.default.object({
        fullName: joi_1.default.string().optional().allow(''),
        country: joi_1.default.string().optional().allow(''),
        dob: joi_1.default.string().optional().allow(''),
        profilePic: joi_1.default.string().optional().allow(''),
        language: joi_1.default.string().optional().allow(...Object.values(workflow_constant_1.languages)),
    }).validate(user);
};
exports.validateUpdateProfile = validateUpdateProfile;
const validateSocialLogin = (user) => {
    return joi_1.default.object({
        login_source: joi_1.default.string().valid('google', 'apple', 'insta', 'facebook').required(),
        email: joi_1.default.string().email().required().messages({ 'string.email': 'Invalid email format or domain is not allowed' }),
        social_auth: joi_1.default.string().required(),
        name: joi_1.default.string().optional().allow(''),
        os_type: joi_1.default.string().optional().allow(''),
        language: joi_1.default.string().optional().allow(''),
        timeZone: joi_1.default.string().optional().allow(''),
        fullName: joi_1.default.string().optional().allow(''),
        hearAboutUs: joi_1.default.string().optional().allow(''),
        howFellingLately: joi_1.default.string().optional().allow(''),
        feelThatWay: joi_1.default.string().optional().allow(''),
        likeToFellMore: joi_1.default.string().optional().allow(''),
        helpFeelBetter: joi_1.default.string().optional().allow(''),
        stopFeelBetter: joi_1.default.string().optional().allow(''),
        timeYouCommit: joi_1.default.string().optional().allow(''),
        goalStartWith: joi_1.default.string().optional().allow(''),
    }).validate(user);
};
exports.validateSocialLogin = validateSocialLogin;
const validateRefreshToken = (common) => {
    return joi_1.default.object({
        refresh_token: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateRefreshToken = validateRefreshToken;
const validateDeleteOrDeactivation = (user) => {
    return joi_1.default.object({
        reason: joi_1.default.string().optional().allow(''),
        status: joi_1.default.number().valid(workflow_constant_1.USER_STATUS.DEACTIVATED, workflow_constant_1.USER_STATUS.DELETED).error(new Error('only use 2 for delete 3 for deactivate')).required(),
    }).validate(user);
};
exports.validateDeleteOrDeactivation = validateDeleteOrDeactivation;
const validateCompleteOnboarding = (user) => {
    return joi_1.default.object({
        hearAboutUs: joi_1.default.string().optional(),
        howFellingLately: joi_1.default.string().optional(),
        feelThatWay: joi_1.default.string().optional(),
        likeToFellMore: joi_1.default.string().optional(),
        helpFeelBetter: joi_1.default.string().optional(),
        stopFeelBetter: joi_1.default.string().optional(),
        timeYouCommit: joi_1.default.string().optional(),
        goalStartWith: joi_1.default.string().optional(),
        fullName: joi_1.default.string().optional(),
        language: joi_1.default.string().optional().valid(...Object.values(workflow_constant_1.languages)),
    }).validate(user);
};
exports.validateCompleteOnboarding = validateCompleteOnboarding;
