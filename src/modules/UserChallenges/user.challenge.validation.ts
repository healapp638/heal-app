import Joi from "joi";

export const validateCompleteChallenge = (request: { challenge_type: string, challenge_id: string }) => {
    const schema = Joi.object({
        challenge_type: Joi.string().required(),
        challenge_id: Joi.string().required(),
    })
    return schema.validate(request)
}