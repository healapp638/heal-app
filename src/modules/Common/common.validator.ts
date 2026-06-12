import joi from 'joi';
import { languages } from '../../constants/workflow.constant';

export const validateStoreParmeterToAws = (common: any) => {
    return joi.object({
        name: joi.string().trim().required(),
        value: joi.string().trim().required(),
    }).validate(common)
}


export const validateGetCommonContent = (common: any) => {
    return joi.object({
        lang: joi.string().trim().required().allow(...Object.values(languages)),
        type: joi.string().trim().required().allow('about', 'privacy_policy', 'terms_conditions'),
    }).validate(common)
}

export const validateDeleteAccount = (user: any) => {
    return joi.object({
        email: joi.string().trim().email().min(4).max(35).required(),
        password: joi.string().required(),
    }).validate(user)
}
