import joi from 'joi';
import { languages, USER_STATUS } from '../../constants/workflow.constant';

export const validateCreateModule = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        themeId: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateModule = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        moduleId: joi.string().trim().required(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
    }).validate(common)
}

export const validateDeleteModule = (common: any) => {
    return joi.object({
        moduleId: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
    }).validate(common)
}

export const validateModuleDetails = (common: any) => {
    return joi.object({
        moduleId: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateListModule = (common: any) => {
    return joi.object({
        page: joi.number().optional(),
        limit: joi.number().optional(),
        search: joi.string().optional(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
        themeId: joi.string().trim().required(),
    }).validate(common)
}
