import joi from 'joi';
import { languages, USER_STATUS } from '../../constants/workflow.constant';

export const validateCreateExerciseDetails = (common: any) => {
    return joi.object({
        reading_title: joi.string().trim().required(),
        reading_description: joi.string().trim().required(),
        concept_title: joi.string().trim().required(),
        concept_description: joi.string().trim().required(),
        reflection: joi.string().trim().required(),
        phase_id: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateExerciseDetails = (common: any) => {
    return joi.object({
        reading_title: joi.string().optional().allow(''),
        reading_description: joi.string().optional().allow(''),
        concept_title: joi.string().optional().allow(''),
        concept_description: joi.string().optional().allow(''),
        reflection: joi.string().optional().allow(''),
        exercise_details_id: joi.string().trim().required(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
    }).validate(common)
}

export const validateDeleteExerciseDetails = (common: any) => {
    return joi.object({
        exercise_details_id: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
    }).validate(common)
}

export const validateExerciseDetails = (common: any) => {
    return joi.object({
        exercise_details_id: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateListExerciseDetails = (common: any) => {
    return joi.object({
        page: joi.number().optional(),
        limit: joi.number().optional(),
        search: joi.string().optional(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
        phase_id: joi.string().trim().required(),
    }).validate(common)
}

export const validateCreateExercise = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        description: joi.string().trim().required(),
        exercise_details_id: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateExercise = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        description: joi.string().optional().allow(''),
        exercise_id: joi.string().trim().required(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
    }).validate(common)
}

export const validateDeleteExercise = (common: any) => {
    return joi.object({
        exercise_id: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
    }).validate(common)
}

export const validateExercise = (common: any) => {
    return joi.object({
        exercise_id: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateListExercise = (common: any) => {
    return joi.object({
        page: joi.number().optional(),
        limit: joi.number().optional(),
        search: joi.string().optional(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
        exercise_details_id: joi.string().trim().required(),
    }).validate(common)
}

export const validateSingleExercise = (common: any) => {
    return joi.object({
        exercise_id: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateCreateMcqExercise = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        description: joi.string().trim().required(),
        mcq: joi.array().items({
            question: joi.string().trim().required(),
            option: joi.string().trim().required(),
        }).required(),
        phase_id: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateMcqExercise = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        description: joi.string().optional().allow(''),
        mcq: joi.array().items({
            question: joi.string().trim().required(),
            option: joi.string().trim().required(),
        }).optional(),
        mcqexercise_id: joi.string().trim().required(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
    }).validate(common)
}

export const validateDeleteMcqExercise = (common: any) => {
    return joi.object({
        phase_id: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
    }).validate(common)
}

export const validateMcqExercise = (common: any) => {
    return joi.object({
        mcqexercise_id: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateListMcqExercise = (common: any) => {
    return joi.object({
        page: joi.number().optional(),
        limit: joi.number().optional(),
        search: joi.string().optional(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
        exercise_details_id: joi.string().trim().required(),
    }).validate(common)
}

export const validateSingleMcqExercise = (common: any) => {
    return joi.object({
        mcqexercise_id: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}
