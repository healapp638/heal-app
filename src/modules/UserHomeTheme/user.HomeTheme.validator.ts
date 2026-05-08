import joi from 'joi';

export const validateAddUserTheme = (user: any) => {
    return joi.object({
        homeTheme_id: joi.string().trim().required(),
    }).validate(user)
}
