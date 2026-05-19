import Joi from "joi";

export const validatesendMessage = (request: { message: string, conversation_id?: string, role: string }) => {
    const schema = Joi.object({
        message: Joi.string().required(),
        conversation_id: Joi.string().optional(),
        role: Joi.string().valid('user', 'ai').required(),
    })
    return schema.validate(request)
}

export const validateGetMessageList = (request: { conversation_id: string, page: number, limit: number }) => {
    const schema = Joi.object({
        conversation_id: Joi.string().required(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
    })
    return schema.validate(request)
}

export const validateMessageHistory = (request: { conversation_id: string }) => {
    const schema = Joi.object({
        conversation_id: Joi.string().required(),
    })
    return schema.validate(request)
}

export const validateAiSupportResponse = (request: { message: string }) => {
    const schema = Joi.object({
        message: Joi.string().required(),
    })
    return schema.validate(request)
}

export const validateConversationListing = (conversation:any) => {
    const schema = Joi.object({
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        search: Joi.string().optional(),
        sort_column: Joi.string().optional(),
        sort_direction: Joi.string().optional(),
    })
    return schema.validate(conversation)
}
