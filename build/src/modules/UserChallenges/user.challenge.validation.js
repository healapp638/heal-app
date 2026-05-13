"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChallengesDetails = exports.validateCompleteChallenge = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCompleteChallenge = (request) => {
    const schema = joi_1.default.object({
        challenge_type: joi_1.default.string().required(),
        challenge_id: joi_1.default.string().required(),
    });
    return schema.validate(request);
};
exports.validateCompleteChallenge = validateCompleteChallenge;
const validateChallengesDetails = (request) => {
    const schema = joi_1.default.object({
        challenge_type: joi_1.default.string().required(),
        challenge_id: joi_1.default.string().required(),
    });
    return schema.validate(request);
};
exports.validateChallengesDetails = validateChallengesDetails;
