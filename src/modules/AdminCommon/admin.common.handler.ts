import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import { findOne, findByIdAndRemove } from "../../helpers/db.helpers";
import commonContentModel from "../../modules/AdminCommon/commonContent.model";
import responseMessage from '../../constants/responseMessages'
import faqModel from '../../modules/AdminCommon/faq.model';
import statusCodes from '../../constants/statusCodes'
import { SUPPORTED_LANGUAGES } from "../../constants/workflow.constant";
import { translateText } from "../../helpers/langauge.translate.helper";
// import xlsx from 'xlsx';
// import Theme from '../AdminTheme/admin.theme.model';
// import Module from '../AdminModules/admin.modules.model';
// import SubModule from '../AdminSubModules/admin.submodules.model';
// import Phase from '../AdminPhases/admin.phases.model';
// import ExerciseDetails from '../AdminExercise/admin.exercise.details..model';
// import Exercise from '../AdminExercise/admin.excercise.model';
import { excelQueue } from "../../processQueue/queue";
import adminExelModel from "./admin.exel.model";
import { getCountAndPagination } from "../../helpers/common.helper";

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
        return showResponse(true, responseMessage.common.data_retreive_sucess, { result, totalCount }, statusCodes.SUCCESS)
    },
}

export default AdminCommonHandler;
