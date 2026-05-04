import Joi from "joi";

const validateAddJournal = (data: any) => {
    const schema = Joi.object({
        feeling: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
    })
    return schema.validate(data)
}

const validateUpdateJournal = (data: any) => {
    const schema = Joi.object({
        journal_id: Joi.string().required(),
        feeling: Joi.string().optional().allow(""),
        title: Joi.string().optional().allow(""),
        description: Joi.string().optional().allow(""),
    })
    return schema.validate(data)
}

const validateDeleteJournal = (data: any) => {
    const schema = Joi.object({
        journal_id: Joi.string().required(),
    })
    return schema.validate(data)
}

const validateJournalDetail = (data: any) => {
    const schema = Joi.object({
        journal_id: Joi.string().required(),
    })
    return schema.validate(data)
}

const validateJournalListByDate = (data: any) => {
    const schema = Joi.object({
        date: Joi.string().required(),
    })
    return schema.validate(data)
}


        

export { validateAddJournal, validateUpdateJournal, validateDeleteJournal, validateJournalDetail, validateJournalListByDate }