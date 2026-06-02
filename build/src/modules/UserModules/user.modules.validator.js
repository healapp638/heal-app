"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateThemeEngagementCreate = exports.validateStartSubModuleList = exports.validateStartLesson = exports.validateCompletePhase = exports.validateCompleteLesson = exports.validateExerciseList = exports.validateExerciseDetailList = exports.validateExcerciseMcqAnswerList = exports.validateExerciseMcqList = exports.validateAddMcqAnswer = exports.validatePhaseList = exports.validateModuleList = void 0;
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
const validateAddMcqAnswer = (data) => {
    const schema = joi_1.default.object({
        mcq_exercise_id: joi_1.default.string().required(),
        mcq_id: joi_1.default.string().required(),
        phase_id: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateAddMcqAnswer = validateAddMcqAnswer;
const validateExerciseMcqList = (data) => {
    const schema = joi_1.default.object({
        phase_id: joi_1.default.string().required(),
        cursor: joi_1.default.string().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(data);
};
exports.validateExerciseMcqList = validateExerciseMcqList;
const validateExcerciseMcqAnswerList = (data) => {
    const schema = joi_1.default.object({
        phase_id: joi_1.default.string().required(),
        cursor: joi_1.default.string().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(data);
};
exports.validateExcerciseMcqAnswerList = validateExcerciseMcqAnswerList;
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
        // exercise_details_id: Joi.string().required(),
        phase_id: joi_1.default.string().required(),
        reflection: joi_1.default.string().optional().allow(''),
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
        phase_id: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateStartLesson = validateStartLesson;
const validateStartSubModuleList = (data) => {
    const schema = joi_1.default.object({
        cursor: joi_1.default.string().optional(),
        limit: joi_1.default.number().optional(),
    });
    return schema.validate(data);
};
exports.validateStartSubModuleList = validateStartSubModuleList;
const validateThemeEngagementCreate = (data) => {
    const schema = joi_1.default.object({
        theme_id: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateThemeEngagementCreate = validateThemeEngagementCreate;
