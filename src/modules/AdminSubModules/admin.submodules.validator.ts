import joi from 'joi';
import { languages, USER_STATUS } from '../../constants/workflow.constant';

export const validateCreateSubModule = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        moduleId: joi.string().trim().required(),
        description: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateSubModule = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        subModuleId: joi.string().trim().required(),
        lang: joi.string().trim().required().valid(...Object.values(languages)),
        description: joi.string().trim().optional().allow(''),
    }).validate(common)
}

export const validateDeleteSubModule = (common: any) => {
    return joi.object({
        subModuleId: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
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
