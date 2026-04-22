import joi from 'joi';

export const validateCreateModule = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateModule = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        moduleId: joi.string().trim().required(),
    }).validate(common)
}

export const validateDeleteModule = (common: any) => {
    return joi.object({
        moduleId: joi.string().trim().required(),
    }).validate(common)
}

export const validateModuleDetails = (common: any) => {
    return joi.object({
        moduleId: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}
