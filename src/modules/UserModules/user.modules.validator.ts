import Joi from "joi";

export const validateModuleList = (data: any) => {
    const schema = Joi.object({
        theme_id: Joi.string().required(),
        cursor: Joi.string().optional(),
        limit: Joi.number().optional(),
    });
    return schema.validate(data);
}

export const validatePhaseList = (data: any) => {
    const schema = Joi.object({
        sub_module_id: Joi.string().required(),
        cursor: Joi.string().optional(),
        limit: Joi.number().optional(),
    });
    return schema.validate(data);
}

export const validateExerciseDetailList = (data: any) => {
    const schema = Joi.object({
        phase_id: Joi.string().required(),
        cursor: Joi.string().optional(),
        limit: Joi.number().optional(),
    });
    return schema.validate(data);
}

export const validateExerciseList = (data: any) => {
    const schema = Joi.object({
        exercise_detail_id: Joi.string().required(),
        cursor: Joi.string().optional(),
        limit: Joi.number().optional(),
    });
    return schema.validate(data);
}

export const validateCompleteLesson = (data: any) => {
    const schema = Joi.object({
        exercise_id: Joi.string().required(),
        exercise_details_id: Joi.string().required(),
        phase_id: Joi.string().required(),
        reflection: Joi.string().required(),
    });
    return schema.validate(data);
}

export const validateCompletePhase = (data: any) => {
    const schema = Joi.object({
        phase_id: Joi.string().required(),
    });
    return schema.validate(data);
}

export const validateStartLesson = (data: any) => {
    const schema = Joi.object({
        exercise_id: Joi.string().required(),
        exercise_details_id: Joi.string().required(),
        phase_id: Joi.string().required(),
    });
    return schema.validate(data);
}
