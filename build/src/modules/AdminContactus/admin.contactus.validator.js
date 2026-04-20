"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReplyContactUs = exports.validateListContactDetails = exports.validateDeleteContactUs = exports.validateGetContactDetail = exports.validateAddContactUs = void 0;
const joi_1 = __importDefault(require("joi"));
const validateAddContactUs = (admin) => {
    return joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().required(),
        message: joi_1.default.string().optional(),
    }).validate(admin);
};
exports.validateAddContactUs = validateAddContactUs;
const validateGetContactDetail = (admin) => {
    return joi_1.default.object({
        contact_id: joi_1.default.string().required()
    }).validate(admin);
};
exports.validateGetContactDetail = validateGetContactDetail;
const validateDeleteContactUs = (admin) => {
    return joi_1.default.object({
        contact_id: joi_1.default.string().required(),
    }).validate(admin);
};
exports.validateDeleteContactUs = validateDeleteContactUs;
const validateListContactDetails = (admin) => {
    return joi_1.default.object({
        sort_column: joi_1.default.string().optional().allow(''),
        sort_direction: joi_1.default.string().optional().allow(''),
        page: joi_1.default.string().optional().allow(''),
        limit: joi_1.default.string().optional().allow(''),
        search_key: joi_1.default.string().optional().allow(''),
    }).validate(admin);
};
exports.validateListContactDetails = validateListContactDetails;
const validateReplyContactUs = (admin) => {
    return joi_1.default.object({
        contact_id: joi_1.default.string().required(),
        html: joi_1.default.string().required()
    }).validate(admin);
};
exports.validateReplyContactUs = validateReplyContactUs;
