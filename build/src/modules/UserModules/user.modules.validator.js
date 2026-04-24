"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStartLesson = exports.validateCompletePhase = exports.validateCompleteLesson = exports.validateExerciseList = exports.validateExerciseDetailList = exports.validatePhaseList = exports.validateModuleList = void 0;
const joi_1 = __importDefault(require("joi"));
const validateModuleList = (data) => {
    const schema = joi_1.default.object({
        theme_id: joi_1.default.string().required(),
        cursor: joi_1.default.string().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(data);
};
exports.validateModuleList = validateModuleList;
const validatePhaseList = (data) => {
    const schema = joi_1.default.object({
        sub_module_id: joi_1.default.string().required(),
        cursor: joi_1.default.string().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(data);
};
exports.validatePhaseList = validatePhaseList;
const validateExerciseDetailList = (data) => {
    const schema = joi_1.default.object({
        phase_id: joi_1.default.string().required(),
        cursor: joi_1.default.string().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(data);
};
exports.validateExerciseDetailList = validateExerciseDetailList;
const validateExerciseList = (data) => {
    const schema = joi_1.default.object({
        exercise_detail_id: joi_1.default.string().required(),
        cursor: joi_1.default.string().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(data);
};
exports.validateExerciseList = validateExerciseList;
const validateCompleteLesson = (data) => {
    const schema = joi_1.default.object({
        exercise_id: joi_1.default.string().required(),
        exercise_details_id: joi_1.default.string().required(),
        phase_id: joi_1.default.string().required(),
        reflection: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateCompleteLesson = validateCompleteLesson;
const validateCompletePhase = (data) => {
    const schema = joi_1.default.object({
        phase_id: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateCompletePhase = validateCompletePhase;
const validateStartLesson = (data) => {
    const schema = joi_1.default.object({
        exercise_id: joi_1.default.string().required(),
        exercise_details_id: joi_1.default.string().required(),
        phase_id: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateStartLesson = validateStartLesson;
