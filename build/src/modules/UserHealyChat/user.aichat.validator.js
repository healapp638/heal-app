"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConversationListing = exports.validateAiSupportResponse = exports.validateMessageHistory = exports.validateGetMessageList = exports.validatesendMessage = void 0;
const joi_1 = __importDefault(require("joi"));
const validatesendMessage = (request) => {
    const schema = joi_1.default.object({
        message: joi_1.default.string().required(),
        conversation_id: joi_1.default.string().optional(),
        role: joi_1.default.string().valid('user', 'ai').required(),
    });
    return schema.validate(request);
};
exports.validatesendMessage = validatesendMessage;
const validateGetMessageList = (request) => {
    const schema = joi_1.default.object({
        conversation_id: joi_1.default.string().required(),
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(request);
};
exports.validateGetMessageList = validateGetMessageList;
const validateMessageHistory = (request) => {
    const schema = joi_1.default.object({
        conversation_id: joi_1.default.string().required(),
    });
    return schema.validate(request);
};
exports.validateMessageHistory = validateMessageHistory;
const validateAiSupportResponse = (request) => {
    const schema = joi_1.default.object({
        message: joi_1.default.string().required(),
    });
    return schema.validate(request);
};
exports.validateAiSupportResponse = validateAiSupportResponse;
const validateConversationListing = (conversation) => {
    const schema = joi_1.default.object({
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
        search: joi_1.default.string().optional(),
        sort_column: joi_1.default.string().optional(),
        sort_direction: joi_1.default.string().optional(),
    });
    return schema.validate(conversation);
};
exports.validateConversationListing = validateConversationListing;
