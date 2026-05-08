import joi from 'joi';
import { USER_STATUS } from '../../constants/workflow.constant';

export const validateCreateTheme = (common: any) => {
    return joi.object({
        title: joi.string().trim().required(),
        imgUrl: joi.string().trim().required(),
    }).validate(common)
}
export const validateCreateHomeTheme = (common: any) => {
    return joi.object({
        categoryTheme_id:joi.string().trim().required(),
        imgUrl: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateTheme = (common: any) => {
    return joi.object({
        title: joi.string().optional().allow(''),
        imgUrl: joi.string().optional().allow(''),
        lang: joi.string().trim().required(),
        themeCategoryId: joi.string().trim().required(),
    }).validate(common)
}

export const validateUpdateHometheme = (common: any) => {
    return joi.object({
        hometheme_id: joi.string().optional().allow(''),
        imgUrl: joi.string().optional().allow(''),
    }).validate(common)
}
export const validateAffirmation = (common: any) => {
    return joi.object({
        affirmation_id: joi.string().optional()
    }).validate(common)
}

export const validateDeleteTheme = (common: any) => {
    return joi.object({
        themeCategoryId: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
    }).validate(common)
}


export const validateDeleteHomeTheme = (common: any) => {
    return joi.object({
        hometheme_id: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
    }).validate(common)
}
export const validateHomeTheme = (common: any) => {
    return joi.object({
        themeCategoryId: joi.string().trim().required(),
        status: joi.number().required().allow(USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED, USER_STATUS.DELETED),
    }).validate(common)
}


export const validateThemeDetails = (common: any) => {
    return joi.object({
        themeCategoryId: joi.string().trim().required(),
        lang: joi.string().trim().required(),
    }).validate(common)
}

export const validateHomeThemeDetails = (common: any) => {
    return joi.object({
        hometheme_id: joi.string().trim().required(),
    }).validate(common)
}
