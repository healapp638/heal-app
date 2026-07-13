"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDashboard = exports.validateUpdateUserStatus = exports.validateGetCustomerDetails = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const userStatusValues = Object.values(workflow_constant_1.USER_STATUS);
const validateGetCustomerDetails = (admin) => {
    return joi_1.default.object({
        user_id: joi_1.default.string().required(),
    }).validate(admin);
};
exports.validateGetCustomerDetails = validateGetCustomerDetails;
const validateUpdateUserStatus = (admin) => {
    return joi_1.default.object({
        user_id: joi_1.default.string().required(),
        status: joi_1.default.number().valid(...userStatusValues).required(),
    }).validate(admin);
};
exports.validateUpdateUserStatus = validateUpdateUserStatus;
const validateDashboard = (admin) => {
    return joi_1.default.object({
        past_day: joi_1.default.optional().valid('1M', '6M', '1Y', 'MAX'),
    }).validate(admin);
};
exports.validateDashboard = validateDashboard;
