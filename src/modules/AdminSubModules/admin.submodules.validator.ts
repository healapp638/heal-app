import joi from 'joi';
import { languages } from '../../constants/workflow.constant';

export const validateCreateSubModule = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        moduleId: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateSubModule = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        subModuleId: joi.string().trim().required(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
    }).validate(common)
}

export const validateDeleteSubModule = (common: any) => {
    return joi.object({
        subModuleId: joi.string().trim().required(),
    }).validate(common)
}

export const validateSubModuleDetails = (common: any) => {
    return joi.object({
        subModuleId: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateListSubModule = (common: any) => {
    return joi.object({
        page: joi.number().optional(),
        limit: joi.number().optional(),
        search: joi.string().optional(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
        moduleId: joi.string().trim().required(),
    }).validate(common)
}
