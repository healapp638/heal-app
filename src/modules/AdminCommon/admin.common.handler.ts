import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import { findOne, findByIdAndRemove, findOneAndUpdate } from "../../helpers/db.helpers";
import commonContentModel from "../../modules/AdminCommon/commonContent.model";
import responseMessage from '../../constants/responseMessages'
import faqModel from '../../modules/AdminCommon/faq.model';
import statusCodes from '../../constants/statusCodes'
import { SUPPORTED_LANGUAGES } from "../../constants/workflow.constant";
import { translatePlainText, translateText } from "../../helpers/langauge.translate.helper";
import { affirmationQueue, excelQueue } from "../../processQueue/queue";
import adminExelModel from "./admin.exel.model";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";
import userAffirmationModel from "../UserAffirmation/user.affirmation.model";

const AdminCommonHandler = {

    addQuestion: async (data: any): Promise<ApiResponse> => {
        const { question, answer } = data;

        const questionData: any = { en: question };
        const answerData: any = { en: answer };

        // Translate to all other languages in parallel
        await Promise.all(
            SUPPORTED_LANGUAGES.filter((lang) => lang !== "en").map(async (lang) => {
                const [translatedQ, translatedA] = await Promise.all([
                    translateText(question, lang),
                    translateText(answer, lang),
                ]);
                questionData[lang] = translatedQ;
                answerData[lang] = translatedA;
            })
        );
        const faq = await faqModel.create({ question: questionData, answer: answerData });


        return showResponse(true, responseMessage.admin.question_added, faq, statusCodes.SUCCESS);
    },

    updateQuestion: async (data: any): Promise<ApiResponse> => {
        const { answer, question, question_id, language } = data;

        const faq = await faqModel.findOne({ _id: question_id });
        if (!faq) {
            return showResponse(false, responseMessage.common.not_exist, null, statusCodes.API_ERROR);
        }


        const updateData: any = {};
        if (question !== undefined) updateData[`question.${language}`] = question;
        if (answer !== undefined) updateData[`answer.${language}`] = answer;

        const updated = await faqModel.findByIdAndUpdate(
            question_id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        return showResponse(true, responseMessage.common.update_sucess, updated, statusCodes.SUCCESS);
    },

    deleteQuestion: async (data: any): Promise<ApiResponse> => {
        const { question_id } = data;

        const exists = await findOne(faqModel, { _id: question_id })
        if (!exists.status) {
            return showResponse(false, responseMessage.common.not_exist, null, statusCodes.API_ERROR)
        }

        const response = await findByIdAndRemove(faqModel, question_id)
        if (response.status) {
            return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS);
        }
        return showResponse(false, responseMessage.common.delete_failed, response, statusCodes.API_ERROR);
    },

    updateCommonContent: async (data: any): Promise<ApiResponse> => {
        const { type, content, language } = data


        const text = String(content).trim();

        // Fetch or initialise the single document
        let doc: any = await commonContentModel.findOne();
        if (!doc) {
            doc = new commonContentModel({});
        }

        const currentEnglish = doc[type]?.en || "";

        // Rule 1: Non-English update but English hasn't been filled yet
        if (language !== "en" && !currentEnglish) {
            return showResponse(false, 'Please add the English content first before adding other languages.', null, statusCodes.API_ERROR)
        }

        const updateData: any = {};

        if (language === "en") {
            if (!currentEnglish) {
                // Rule 2a: First-time English → translate to all other languages
                updateData[`${type}.en`] = text;

                const translations = await Promise.all(
                    SUPPORTED_LANGUAGES.filter((lang) => lang !== "en").map(async (lang) => {
                        const translated = await translateText(text, lang);
                        return { lang, translated };
                    })
                );

                translations.forEach(({ lang, translated }) => {
                    updateData[`${type}.${lang}`] = translated;
                });
            } else {
                // Rule 2b: English already exists → update English only
                updateData[`${type}.en`] = text;
            }
        } else {
            // Rule 3: Update specific non-English language only
            updateData[`${type}.${language}`] = text;
        }

        const updated = await commonContentModel.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
        ).lean();

        return showResponse(true, responseMessage.common.update_sucess, updated, statusCodes.SUCCESS);
    },

    resentCommonContent: async (data: any): Promise<ApiResponse> => {
        const { type } = data;
        const updateData: any = {};
        SUPPORTED_LANGUAGES.forEach((lang) => {
            updateData[`${type}.${lang}`] = "";
        });
        const updated = await commonContentModel.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true }
        ).lean();

        return showResponse(true, `Common content for "${type}" has been reset successfully`, updated, statusCodes.SUCCESS);
    },

excelRead: async (data: any): Promise<ApiResponse> => {
    try {
        const { file } = data;

        if (!file || (!file.data && !file.buffer)) {
            return showResponse(false, "No file data found.", null, statusCodes.VALIDATION_ERROR);
        }

        const fileBuffer = file.data || file.buffer;
        console.log(fileBuffer,"fileBuffer")

        // ✅ PUSH TO QUEUE
        const job = await excelQueue.add("process-excel", {
            fileBuffer
        }, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            }
        });

        return showResponse(true, "File queued successfully", {
            jobId: job.id
        }, statusCodes.SUCCESS);

    } catch (error) {
        return showResponse(false, "Queue error", error, statusCodes.API_ERROR);
    }
},
addExcelAffirmation: async (data: any): Promise<ApiResponse> => {
    try {
        const { file } = data;

        if (!file || (!file.data && !file.buffer)) {
            return showResponse(false, "No file data found.", null, statusCodes.VALIDATION_ERROR);
        }

        const fileBuffer = file.data || file.buffer;
        console.log(fileBuffer,"fileBuffer")

        // ✅ PUSH TO QUEUE
        const job = await affirmationQueue.add("process-affirmationexcel", {
            fileBuffer
        }, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            }
        });

        return showResponse(true, "File queued successfully", {
            jobId: job.id
        }, statusCodes.SUCCESS);

    } catch (error) {
        return showResponse(false, "Queue error", error, statusCodes.API_ERROR);
    }
},
    listExcelImport: async (page: number, limit: number, search: string = ''): Promise<ApiResponse> => {
        const aggregate = [
            {
                $match: {
                    excelTheme: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ]
        const { totalCount, aggregation } = await getCountAndPagination(adminExelModel, aggregate, page, limit)
        const result = await adminExelModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { result, totalCount,excel_format:
                "https://d2aanhz0ffna0r.cloudfront.net/Heal%20Love%20Excel%203.xlsx" }, statusCodes.SUCCESS)
    },

    addAffirmation: async (data: any): Promise<ApiResponse> => {
        const { affirmation } = data;

        const affirmationData: any = { en: affirmation };

        // Translate to all other languages in parallel
        await Promise.all(
            SUPPORTED_LANGUAGES.filter((lang) => lang !== "en").map(async (lang) => {
                const [translatedQ] = await Promise.all([
                    translatePlainText(affirmation, lang),

                ]);
                affirmationData[lang] = translatedQ;
            })
        );
        const Affirmation = await userAffirmationModel.create({ affirmation: affirmationData });

        return showResponse(true, responseMessage.admin.question_added, Affirmation, statusCodes.SUCCESS);
    },
    listAffirmation: async (page: number, limit: number,language:string): Promise<ApiResponse> => {
        const aggregate = [
            {
                $match: {
                    status: { $ne: 2 },
                }
            },
             {
            $project: {
                affirmation: `$affirmation.${language}`,
                type: 1,
                status:1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
            { $sort: { createdAt: -1 } },
        ]
        const { totalCount, aggregation } = await getCountAndPagination(userAffirmationModel, aggregate, page, limit)
        const result = await userAffirmationModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { result, totalCount }, statusCodes.SUCCESS)
    },
    editAffirmation: async (data: any): Promise<ApiResponse> => {
    const { affirmation_id, affirmation, language } = data;
    console.log(affirmation,"affirmation")

    const existingAffirmation = await findOne(userAffirmationModel, {
        _id: convertToObjectId(affirmation_id),
    });

    if (!existingAffirmation) {
        return showResponse(
            false,
            responseMessage.common.data_not_found,
            null,
            statusCodes.NOT_FOUND
        );
    }

    // update only selected language
    const update = await findOneAndUpdate(
        userAffirmationModel,
        { _id: convertToObjectId(affirmation_id) },
        {
        
                [`affirmation.${language}`]: affirmation,
    
        }
    );
    console.log(update,"update")

    return showResponse(
        true,
        responseMessage.common.update_sucess,
        update,
        statusCodes.SUCCESS
    );
},

deleteAffirmation: async (data:any): Promise<ApiResponse> => {
        const { affirmation_id, status } = data;
    console.log(affirmation_id,"affirmation_id")

    const existingAffirmation = await findOne(userAffirmationModel, {
        _id: affirmation_id,
    });

    if (!existingAffirmation) {
        return showResponse(
            false,
            responseMessage.common.data_not_found,
            null,
            statusCodes.NOT_FOUND
        );
    }
    console.log(affirmation_id,"affirmation_id")

     await findOneAndUpdate(
        userAffirmationModel,
        { _id: convertToObjectId(affirmation_id) },
        {
        status
        }
    );

    return showResponse(
        true,
        responseMessage.common.delete_sucess,
        null,
        statusCodes.SUCCESS
    );
},
affirmationDetail: async (
    affirmation_id: any,
    language: any = "en"
): Promise<ApiResponse> => {
    // console.log(affirmation_id,"affirmation_id")

    const result = await userAffirmationModel.aggregate([
        {
            $match: {
                _id: convertToObjectId(affirmation_id),
            },
        },
        {
            $project: {
                affirmation: {
                    $ifNull: [
                        `$affirmation.${language}`,
                        "$affirmation.en"
                    ]
                },
                type: 1,
                status:1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!result.length) {
        return showResponse(
            false,
            responseMessage.common.data_not_found,
            null,
            statusCodes.NOT_FOUND
        );
    }

    return showResponse(
        true,
        responseMessage.common.data_retreive_sucess,
        result[0],
        statusCodes.SUCCESS
    );
},
}

export default AdminCommonHandler;
