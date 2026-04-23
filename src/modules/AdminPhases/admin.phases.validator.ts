import joi from 'joi';
import { languages } from '../../constants/workflow.constant';

export const validateCreatePhase = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        points: joi.number().required(),
        subModuleId: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdatePhase = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        points: joi.number().optional(),
        phaseId: joi.string().trim().required(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
    }).validate(common)
}

export const validateDeletePhase = (common: any) => {
    return joi.object({
        phaseId: joi.string().trim().required(),
    }).validate(common)
}

export const validatePhaseDetails = (common: any) => {
    return joi.object({
        phaseId: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateListPhase = (common: any) => {
    return joi.object({
        page: joi.number().optional(),
        limit: joi.number().optional(),
        search: joi.string().optional(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
        subModuleId: joi.string().trim().required(),
    }).validate(common)
}
