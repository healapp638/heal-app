"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSingleExercise = exports.validateListExercise = exports.validateExercise = exports.validateDeleteExercise = exports.validateUpdateExercise = exports.validateCreateExercise = exports.validateListExerciseDetails = exports.validateExerciseDetails = exports.validateDeleteExerciseDetails = exports.validateUpdateExerciseDetails = exports.validateCreateExerciseDetails = void 0;
const joi_1 = __importDefault(require("joi"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const validateCreateExerciseDetails = (common) => {
    return joi_1.default.object({
        reading_title: joi_1.default.string().trim().required(),
        reading_description: joi_1.default.string().trim().required(),
        concept_title: joi_1.default.string().trim().required(),
        concept_description: joi_1.default.string().trim().required(),
        reflection: joi_1.default.string().trim().required(),
        phase_id: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateExerciseDetails = validateCreateExerciseDetails;
const validateUpdateExerciseDetails = (common) => {
    return joi_1.default.object({
        reading_title: joi_1.default.string().optional().allow(''),
        reading_description: joi_1.default.string().optional().allow(''),
        concept_title: joi_1.default.string().optional().allow(''),
        concept_description: joi_1.default.string().optional().allow(''),
        reflection: joi_1.default.string().optional().allow(''),
        exercise_details_id: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
    }).validate(common);
};
exports.validateUpdateExerciseDetails = validateUpdateExerciseDetails;
const validateDeleteExerciseDetails = (common) => {
    return joi_1.default.object({
        exercise_details_id: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateDeleteExerciseDetails = validateDeleteExerciseDetails;
const validateExerciseDetails = (common) => {
    return joi_1.default.object({
        exercise_details_id: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateExerciseDetails = validateExerciseDetails;
const validateListExerciseDetails = (common) => {
    return joi_1.default.object({
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
        search: joi_1.default.string().optional(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
        phase_id: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateListExerciseDetails = validateListExerciseDetails;
const validateCreateExercise = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().trim().required(),
        description: joi_1.default.string().trim().required(),
        exercise_details_id: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateCreateExercise = validateCreateExercise;
const validateUpdateExercise = (common) => {
    return joi_1.default.object({
        title: joi_1.default.string().optional().allow(''),
        description: joi_1.default.string().optional().allow(''),
        exercise_id: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
    }).validate(common);
};
exports.validateUpdateExercise = validateUpdateExercise;
const validateDeleteExercise = (common) => {
    return joi_1.default.object({
        exercise_id: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateDeleteExercise = validateDeleteExercise;
const validateExercise = (common) => {
    return joi_1.default.object({
        exercise_id: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateExercise = validateExercise;
const validateListExercise = (common) => {
    return joi_1.default.object({
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
        search: joi_1.default.string().optional(),
        lang: joi_1.default.string().trim().required().valid(...Object.values(workflow_constant_1.languages)),
        exercise_details_id: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateListExercise = validateListExercise;
const validateSingleExercise = (common) => {
    return joi_1.default.object({
        exercise_id: joi_1.default.string().trim().required(),
        lang: joi_1.default.string().trim().required(),
    }).validate(common);
};
exports.validateSingleExercise = validateSingleExercise;
