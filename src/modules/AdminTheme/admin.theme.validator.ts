import joi from 'joi';

export const validateCreateTheme = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        description: joi.string().trim().required(),
        imgUrl: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateTheme = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        description: joi.string().optional().allow(''),
        imgUrl: joi.string().optional().allow(''),
        lang: joi.string().trim().required(),
        themeId: joi.string().trim().required(),
    }).validate(common)
}

export const validateDeleteTheme = (common: any) => {
    return joi.object({
        themeId: joi.string().trim().required(),
    }).validate(common)
}

export const validateThemeDetails = (common: any) => {
    return joi.object({
        themeId: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}
