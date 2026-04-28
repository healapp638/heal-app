import joi from 'joi';
import { languages, USER_STATUS } from '../../constants/workflow.constant';

export const validateLoginUser = (user: any) => {
    return joi.object({
        email: joi.string().trim().email().min(4).max(35).required(),
        password: joi.string().min(4).max(20).required(),
        language: joi.string().optional().allow(...Object.values(languages)),
    }).validate(user)
}

export const validateRegister = (user: any) => {
    return joi.object({
        hearAboutUs: joi.string().optional().allow(''),
        bringsYouHere: joi.string().optional().allow(''),
        howFellingLately: joi.string().optional().allow(''),
        likeToFellMore: joi.string().optional().allow(''),
        timeYouCommit: joi.string().optional().allow(''),
        startShowingOfYourSelf: joi.string().optional().allow(''),
        fullName: joi.string().required(),
        country: joi.string().required(),
        email: joi.string().trim().email().required(),
        dob: joi.string().required(),
        password: joi.string().min(4).required(),
        language: joi.string().optional().allow(...Object.values(languages)),
    }).validate(user)
}

export const validateVerifyOtp = (user: any) => {
    return joi.object({
        email: joi.string().trim().email().min(4).max(35).required(),
        otp: joi.string().min(4).max(20).required(),
        password: joi.string().optional().allow(''),
    }).validate(user)
}

export const validateResendOtp = (user: any) => {
    return joi.object({
        email: joi.string().trim().email().min(4).max(35).required(),
    }).validate(user)
}

export const validateForgotPassword = (user: any) => {
    return joi.object({
        email: joi.string().trim().email().min(4).max(35).required()
    }).validate(user)
}

export const validateResetPassword = (user: any) => {
    return joi.object({
        email: joi.string().trim().email().min(4).max(35).required(),
        new_password: joi.string().min(4).max(20).required(),
        otp: joi.string().required(),
    }).validate(user)
}

export const validateChangePassword = (user: any) => {
    return joi.object({
        old_password: joi.string().min(4).max(20).required(),
        new_password: joi.string().min(4).max(20).required(),
    }).validate(user)
}

export const validateUpdateProfile = (user: any) => {
    return joi.object({
        fullName: joi.string().optional().allow(''),
        country: joi.string().optional().allow(''),
        dob: joi.string().optional().allow(''),
        profilePic: joi.string().optional().allow(''),
        language: joi.string().optional().allow(...Object.values(languages)),
    }).validate(user)
}


export const validateSocialLogin = (user: any) => {
    return joi.object({
        login_source: joi.string().valid('google', 'apple', 'insta', 'facebook').required(),
        email: joi.string().email().required().messages({ 'string.email': 'Invalid email format or domain is not allowed' }),
        social_auth: joi.string().required(),
        name: joi.string().optional().allow(''),
        os_type: joi.string().optional().allow(''),
        language: joi.string().optional().allow('')
    }).validate(user)
}


export const validateRefreshToken = (common: any) => {
    return joi.object({
        refresh_token: joi.string().trim().required(),
    }).validate(common)
}


export const validateDeleteOrDeactivation = (user: any) => {
    return joi.object({
        reason: joi.string().optional().allow(''),
        status: joi.number().valid(USER_STATUS.DEACTIVATED, USER_STATUS.DELETED).error(new Error('only use 2 for delete 3 for deactivate')).required(),
    }).validate(user)
}
