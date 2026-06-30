import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import { translateText } from "../../helpers/langauge.translate.helper";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";
import adminExerciseDetailsModel from "./admin.exercise.details..model";
import adminExerciseModel from "./admin.excercise.model";
import adminPhasesModel from "../AdminPhases/admin.phases.model";
import adminMcqexerciseModel from "./admin.mcqexercise.model";

const exerciseHandler = {

    createExerciseDetails: async (data: any): Promise<ApiResponse> => {
        const { reading_title, reading_description, concept_title, concept_description, reflection, phase_id } = data;

        const obj: any = {
            reading_title: {},
            reading_description: {},
            concept_title: {},
            concept_description: {},
            reflection: {}
        };

        const langs = Object.values(languages);

        await Promise.all(
            langs.map(async (lang: string) => {
                const [translatedReadingTitle, translatedReadingDescription, translatedConceptTitle, translatedConceptDescription, translatedReflection] = await Promise.all([
                    translateText(reading_title, lang),
                    translateText(reading_description, lang),
                    translateText(concept_title, lang),
                    translateText(concept_description, lang),
                    translateText(reflection, lang)
                ]);
                obj.reading_title[lang] = translatedReadingTitle;
                obj.reading_description[lang] = translatedReadingDescription;
                obj.concept_title[lang] = translatedConceptTitle;
                obj.concept_description[lang] = translatedConceptDescription;
                obj.reflection[lang] = translatedReflection;
            })
        );
        const createExerciseDetails = await adminExerciseDetailsModel.create({
            reading_title: obj.reading_title,
            reading_description: obj.reading_description,
            concept_title: obj.concept_title,
            concept_description: obj.concept_description,
            reflection: obj.reflection,
            phase_id: convertToObjectId(phase_id),
        });
        if (!createExerciseDetails) {
            return showResponse(false, responseMessage.common.save_failed, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_save, null, statusCodes.SUCCESS);
    },

    updateExerciseDetails: async (data: any): Promise<ApiResponse> => {
        const { reading_title, reading_description, concept_title, concept_description, reflection, exercise_details_id, lang } = data
        const isModuleExist = await adminExerciseDetailsModel.findOne({ _id: exercise_details_id, status: USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return showResponse(false, responseMessage.common.exercise_details_not_found, null, statusCodes.API_ERROR)
        }
        const obj: any = {
            ...(reading_title && { [`reading_title.${lang}`]: reading_title }),
            ...(reading_description && { [`reading_description.${lang}`]: reading_description }),
            ...(concept_title && { [`concept_title.${lang}`]: concept_title }),
            ...(concept_description && { [`concept_description.${lang}`]: concept_description }),
            ...(reflection && { [`reflection.${lang}`]: reflection }),
        };
        const updateExerciseDetails = await adminExerciseDetailsModel.findByIdAndUpdate(
            exercise_details_id,
            { $set: obj },
            { new: true }
        );
        if (!updateExerciseDetails) {
            return showResponse(false, responseMessage.common.update_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    deleteExerciseDetails: async (data: any): Promise<ApiResponse> => {
        const { exercise_details_id, status } = data
        const deleteExerciseDetails = await adminExerciseDetailsModel.findOneAndUpdate({ _id: exercise_details_id }, { $set: { status: status } }, { new: true })
        if (!deleteExerciseDetails) {
            return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    },

    listExerciseDetails: async (page: number, limit: number, search: string = '', lang: string = 'en', phase_id: string): Promise<ApiResponse> => {

        const phaseDetails = await adminPhasesModel.aggregate([
            { $match: { _id: convertToObjectId(phase_id), status: { $ne: USER_STATUS.DELETED } } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            }
        ]);


        const aggregate = [
            { $match: { status: { $ne: USER_STATUS.DELETED }, phase_id: convertToObjectId(phase_id) } },
            {
                $addFields: {
                    reading_title: `$reading_title.${lang}`,
                    reading_description: `$reading_description.${lang}`,
                    concept_title: `$concept_title.${lang}`,
                    concept_description: `$concept_description.${lang}`,
                    reflection: `$reflection.${lang}`,
                }
            },
            {
                $match: {
                    reading_title: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ]
        const { totalCount, aggregation } = await getCountAndPagination(adminExerciseDetailsModel, aggregate, page, limit)
        const result = await adminExerciseDetailsModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { phaseDetails: phaseDetails[0], result, totalCount }, statusCodes.SUCCESS)
    },

    exerciseDetails: async (data: any): Promise<ApiResponse> => {
        const { exercise_details_id, lang } = data
        const themeDetails = await adminExerciseDetailsModel.aggregate([
            { $match: { _id: convertToObjectId(exercise_details_id) } },
            {
                $addFields: {
                    reading_title: `$reading_title.${lang}`,
                    reading_description: `$reading_description.${lang}`,
                    concept_title: `$concept_title.${lang}`,
                    concept_description: `$concept_description.${lang}`,
                    reflection: `$reflection.${lang}`,
                }
            }
        ])
        if (!themeDetails) {
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.data_retreive_sucess, themeDetails[0], statusCodes.SUCCESS)
    },

    createExercise: async (data: any): Promise<ApiResponse> => {
        const { title, description, exercise_details_id } = data;

        const obj: any = {
            title: {},
            description: {}
        };

        const langs = Object.values(languages);

        await Promise.all(
            langs.map(async (lang: string) => {
                const [translatedTitle, translatedDescription] = await Promise.all([
                    translateText(title, lang),
                    translateText(description, lang)
                ]);
                obj.title[lang] = translatedTitle;
                obj.description[lang] = translatedDescription;
            })
        );
        const createExercise = await adminExerciseModel.create({
            title: obj.title,
            description: obj.description,
            exercise_details_id: convertToObjectId(exercise_details_id),
        });
        if (!createExercise) {
            return showResponse(false, responseMessage.common.save_failed, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_save, null, statusCodes.SUCCESS);
    },

    updateExercise: async (data: any): Promise<ApiResponse> => {
        const { title, description, exercise_id, lang } = data
        const isModuleExist = await adminExerciseModel.findOne({ _id: exercise_id, status: USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return showResponse(false, responseMessage.common.exercise_not_found, null, statusCodes.API_ERROR)
        }
        const obj: any = {
            ...(title && { [`title.${lang}`]: title }),
            ...(description && { [`description.${lang}`]: description }),
        };
        const updateExercise = await adminExerciseModel.findByIdAndUpdate(
            exercise_id,
            { $set: obj },
            { new: true }
        );
        if (!updateExercise) {
            return showResponse(false, responseMessage.common.update_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    deleteExercise: async (data: any): Promise<ApiResponse> => {
        const { exercise_id, status } = data
        const deleteExercise = await adminExerciseModel.findOneAndUpdate({ _id: exercise_id }, { $set: { status: status } }, { new: true })
        if (!deleteExercise) {
            return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    },

    listExercise: async (page: number, limit: number, search: string = '', lang: string = 'en', exercise_details_id: string): Promise<ApiResponse> => {
        const exerciseDetails = await adminExerciseDetailsModel.aggregate([
            { $match: { _id: convertToObjectId(exercise_details_id), status: { $ne: USER_STATUS.DELETED } } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                    concept_description: `$concept_description.${lang}`,
                    reading_description: `$reading_description.${lang}`,
                    reading_title: `$reading_title.${lang}`,
                    concept_title: `$concept_title.${lang}`,
                    reflection: `$reflection.${lang}`,
                }
            }
        ]);

        const aggregate = [
            { $match: { status: { $ne: USER_STATUS.DELETED }, exercise_details_id: convertToObjectId(exercise_details_id) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            },
            {
                $match: {
                    title: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ]
        const { totalCount, aggregation } = await getCountAndPagination(adminExerciseModel, aggregate, page, limit)
        const result = await adminExerciseModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { exerciseDetails: exerciseDetails[0], result, totalCount }, statusCodes.SUCCESS)
    },

    singleExercise: async (data: any): Promise<ApiResponse> => {
        const { exercise_id, lang } = data
        const themeDetails = await adminExerciseModel.aggregate([
            { $match: { _id: convertToObjectId(exercise_id) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            }
        ])
        if (!themeDetails) {
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.data_retreive_sucess, themeDetails[0], statusCodes.SUCCESS)
    },
    createmcqExercise: async (data: any): Promise<ApiResponse> => {
    try {
        const {title, description, phase_id, mcq = []} = data;

        const existingExercise = await adminMcqexerciseModel.findOne({
            "title.en": title,
            status: { $ne: USER_STATUS.DELETED }
        });

        if (existingExercise) {
            return showResponse(false, responseMessage.common.already_existed, null, statusCodes.VALIDATION_ERROR);
        }

        const obj: any = {
            title: {},
            description: {},
        };

        const langs =
            Object.values(languages);

        // ================= TRANSLATE TITLE/DESC =================
        await Promise.all(

            langs.map(
                async (lang: string) => {

                    const [translatedTitle, translatedDescription] = await Promise.all([
                        translateText(title, lang),
                        translateText(
                            description,
                            lang
                        ),
                    ]);

                    obj.title[lang] = translatedTitle;
                    obj.description[lang] = translatedDescription;
                }
            )
        );

        // ================= TRANSLATE MCQ OPTIONS =================
        const translatedMcqs: any[] = [];

        for (const optionText of mcq) {

            const optionObj: any = {option: {}};

            await Promise.all(

                langs.map(
                    async (lang: string) => {

                        const translatedOption = await translateText(optionText, lang);

                        optionObj.option[lang] = translatedOption;
                    }
                )
            );

            translatedMcqs.push(optionObj);
        }

        // ================= CREATE =================
        const createExercise =
            await adminMcqexerciseModel.create({

                title: obj.title,
                description: obj.description,
                phase_id: convertToObjectId(phase_id),
                mcq: translatedMcqs,
            });

        if (!createExercise) {

            return showResponse(
                false,
                responseMessage.common
                    .save_failed,
                null,
                statusCodes.API_ERROR
            );
        }

        return showResponse(true,responseMessage.common.data_save,createExercise,statusCodes.SUCCESS);

    } catch (error:any) {
        // console.log(error,"CREATE_MCQ_EXERCISE_ERROR");
        return showResponse(false,responseMessage.common.server_error,error?.message,statusCodes.API_ERROR);
    }
},
updateMcqExercise: async (data: any): Promise<ApiResponse> => {

    try {

        const {
            mcqexercise_id,
            title,
            description,
            phase_id,
            mcq
        } = data;

        // =====================================================
        // CHECK EXISTING
        // =====================================================

        const existingExercise =
            await adminMcqexerciseModel.findOne({
                _id: convertToObjectId(mcqexercise_id),
                status: USER_STATUS.ACTIVE,
            });

        if (!existingExercise) {

            return showResponse(
                false,
                responseMessage.common.not_exist,
                null,
                statusCodes.NOT_FOUND
            );
        }

        if (title) {
            const duplicateExercise = await adminMcqexerciseModel.findOne({
                _id: { $ne: convertToObjectId(mcqexercise_id) },
                "title.en": title,
                status: { $ne: USER_STATUS.DELETED }
            });

            if (duplicateExercise) {
                return showResponse(
                    false,
                    responseMessage.common.already_existed,
                    null,
                    statusCodes.VALIDATION_ERROR
                );
            }
        }

        const langs = Object.values(languages);

        const updateData: any = {};

        // =====================================================
        // TITLE
        // =====================================================

        if (title) {

            const translatedTitle: any = {};

            await Promise.all(
                langs.map(async (lang: string) => {

                    translatedTitle[lang] =
                        await translateText(title, lang);
                })
            );

            updateData.title = translatedTitle;
        }

        // =====================================================
        // DESCRIPTION
        // =====================================================

        if (description) {

            const translatedDescription: any = {};

            await Promise.all(
                langs.map(async (lang: string) => {

                    translatedDescription[lang] =
                        await translateText(description, lang);
                })
            );

            updateData.description = translatedDescription;
        }

        // =====================================================
        // MCQ OPTIONS
        // =====================================================

        if (mcq && Array.isArray(mcq)) {

            const translatedMcqs: any[] = [];

            for (const optionText of mcq) {

                const optionObj: any = {
                    option: {},
                };

                await Promise.all(
                    langs.map(async (lang: string) => {

                        optionObj.option[lang] =
                            await translateText(optionText, lang);
                    })
                );

                translatedMcqs.push(optionObj);
            }

            updateData.mcq = translatedMcqs;
        }

        // =====================================================
        // PHASE
        // =====================================================

        if (phase_id) {

            updateData.phase_id =
                convertToObjectId(phase_id);
        }

        // =====================================================
        // UPDATE
        // =====================================================

        const updatedExercise =
            await adminMcqexerciseModel.findOneAndUpdate(
                {
                    _id: convertToObjectId(mcqexercise_id),
                },
                {
                    $set: updateData,
                },
                {
                    new: true,
                }
            );

        return showResponse(
            true,
            responseMessage.common.updated_sucessfully,
            updatedExercise,
            statusCodes.SUCCESS
        );

    } catch (error:any) {

        // console.log(
        //     error,
        //     "UPDATE_MCQ_EXERCISE_ERROR"
        // );

        return showResponse(
            false,
            responseMessage.common.server_error,
            error?.message,
            statusCodes.API_ERROR
        );
    }
},
deleteMcqExercise: async (data: any): Promise<ApiResponse> => {

    try {

        const { mcqexercise_id,status } = data;

        const existingExercise = await adminMcqexerciseModel.findOne({ _id: convertToObjectId(mcqexercise_id), status: USER_STATUS.ACTIVE, });

        if (!existingExercise) {

            return showResponse(false,responseMessage.common.not_exist,null,statusCodes.NOT_FOUND);
        }

        const updatedExercise = await adminMcqexerciseModel.findOneAndUpdate(
                { _id: convertToObjectId(mcqexercise_id), },
                { $set: { status: status } },
                { new: true }
            );

        return showResponse(true, responseMessage.common.delete_sucess, updatedExercise, statusCodes.SUCCESS);

    } catch (error:any) {

        // console.log(error,"DELETE_MCQ_EXERCISE_ERROR");

        return showResponse(false, responseMessage.common.server_error,error?.message, statusCodes.API_ERROR);
    }
},
listMcqExercise: async (page:number, limit:number, search:string, lang:string, phase_id:string):Promise<ApiResponse> => {

    try {
        const phaseDetails = await adminPhasesModel.aggregate([
            { $match: { _id: convertToObjectId(phase_id), status: { $ne: USER_STATUS.DELETED } } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                    reflection: `$reflection.${lang}`,
                }
            }
        ]);


        const aggregate:any[] = [
            { $match: { status: USER_STATUS.ACTIVE, phase_id: convertToObjectId(phase_id), }, },

            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                    mcq: {
                        $map: {
                            input: "$mcq",
                            as: "mcqItem",
                            in: {
                                _id: "$$mcqItem._id",
                                option: `$$mcqItem.option.${lang}`,
                            },
                        },
                    },
                },
            },

            {
                $match: {
                    title: {
                        $regex: search || "",
                        $options: "i",
                    },
                },
            },

            { $sort: { createdAt: 1 } },
        ];

        const { totalCount, aggregation } = await getCountAndPagination(adminMcqexerciseModel, aggregate, page, limit);

        const result = await adminMcqexerciseModel.aggregate(aggregation);

        return showResponse(
            true,
            responseMessage.common.data_retreive_sucess,
            { phase_details:phaseDetails[0],result, totalCount },
            statusCodes.SUCCESS
        );

    } catch (error:any) {

        // console.log(error, "LIST_MCQ_EXERCISE_ERROR");

        return showResponse(false,responseMessage.common.server_error,error?.message,statusCodes.API_ERROR);
    }
},
singleMcqExercise: async (data: any):Promise<ApiResponse> => {

    try {

        const { mcqexercise_id, lang } = data;

        const existingExercise = await adminMcqexerciseModel.findOne({ _id: convertToObjectId(mcqexercise_id), status: USER_STATUS.ACTIVE, });

        if (!existingExercise) {

            return showResponse(false,responseMessage.common.not_exist,null,statusCodes.NOT_FOUND);
        }

        const exercise = await adminMcqexerciseModel.aggregate([
            { $match: { _id: convertToObjectId(mcqexercise_id) } },

            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                    mcq: {
                        $map: {
                            input: "$mcq",
                            as: "mcqItem",
                            in: {
                                _id: "$$mcqItem._id",
                                option: `$$mcqItem.option.${lang}`,
                            },
                        },
                    },
                },
            },
        ]);

        return showResponse(true,responseMessage.common.data_retreive_sucess,exercise[0],statusCodes.SUCCESS);

    } catch (error:any) {

        // console.log(error,"SINGLE_MCQ_EXERCISE_ERROR");

        return showResponse(false, responseMessage.common.server_error,error?.message, statusCodes.API_ERROR);
    }
}
}

export default exerciseHandler