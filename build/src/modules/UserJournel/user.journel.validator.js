"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJournalDetail = exports.validateDeleteJournal = exports.validateUpdateJournal = exports.validateAddJournal = void 0;
const joi_1 = __importDefault(require("joi"));
const validateAddJournal = (data) => {
    const schema = joi_1.default.object({
        feeling: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateAddJournal = validateAddJournal;
const validateUpdateJournal = (data) => {
    const schema = joi_1.default.object({
        journal_id: joi_1.default.string().required(),
        feeling: joi_1.default.string().optional().allow(""),
        title: joi_1.default.string().optional().allow(""),
        description: joi_1.default.string().optional().allow(""),
    });
    return schema.validate(data);
};
exports.validateUpdateJournal = validateUpdateJournal;
const validateDeleteJournal = (data) => {
    const schema = joi_1.default.object({
        journal_id: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateDeleteJournal = validateDeleteJournal;
const validateJournalDetail = (data) => {
    const schema = joi_1.default.object({
        journal_id: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateJournalDetail = validateJournalDetail;
