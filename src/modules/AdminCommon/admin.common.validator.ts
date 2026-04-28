import joi from 'joi';
import { languages } from '../../constants/workflow.constant';

export const validateCommonContent = (admin: any) => {
    return joi.object({
        type: joi.string().required().allow('about', 'privacy_policy', 'terms_conditions'),
        content: joi.string().required(),
        language: joi.string().required().allow(...Object.values(languages)),
    }).validate(admin)
}

export const validateAddQuestion = (admin: any) => {
    return joi.object({
        question: joi.string().required(),
        answer: joi.string().required(),
    }).validate(admin)
}

export const validateUpdateQuestion = (admin: any) => {
    return joi.object({
        question_id: joi.string().required(),
        question: joi.string().optional(),
        answer: joi.string().optional(),
        language:joi.string().required().allow(...Object.values(languages)),
    }).validate(admin)
}
export const validateDeleteQuestion = (admin: any) => {
    return joi.object({
        question_id: joi.string().required()
    }).validate(admin)
}

export const validateResetCommonContent = (admin: any) => {
    return joi.object({
         type: joi.string().required().allow('about', 'privacy_policy', 'terms_conditions'),
    }).validate(admin)
}

