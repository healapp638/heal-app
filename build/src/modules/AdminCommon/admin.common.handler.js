"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../utils/response.util");
const db_helpers_1 = require("../../helpers/db.helpers");
const commonContent_model_1 = __importDefault(require("../../modules/AdminCommon/commonContent.model"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const faq_model_1 = __importDefault(require("../../modules/AdminCommon/faq.model"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const langauge_translate_helper_1 = require("../../helpers/langauge.translate.helper");
// import xlsx from 'xlsx';
// import Theme from '../AdminTheme/admin.theme.model';
// import Module from '../AdminModules/admin.modules.model';
// import SubModule from '../AdminSubModules/admin.submodules.model';
// import Phase from '../AdminPhases/admin.phases.model';
// import ExerciseDetails from '../AdminExercise/admin.exercise.details..model';
// import Exercise from '../AdminExercise/admin.excercise.model';
const queue_1 = require("../../processQueue/queue");
const admin_exel_model_1 = __importDefault(require("./admin.exel.model"));
const common_helper_1 = require("../../helpers/common.helper");
const user_affirmation_model_1 = __importDefault(require("../UserAffirmation/user.affirmation.model"));
const AdminCommonHandler = {
    addQuestion: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { question, answer } = data;
        const questionData = { en: question };
        const answerData = { en: answer };
        // Translate to all other languages in parallel
        yield Promise.all(workflow_constant_1.SUPPORTED_LANGUAGES.filter((lang) => lang !== "en").map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const [translatedQ, translatedA] = yield Promise.all([
                (0, langauge_translate_helper_1.translateText)(question, lang),
                (0, langauge_translate_helper_1.translateText)(answer, lang),
            ]);
            questionData[lang] = translatedQ;
            answerData[lang] = translatedA;
        })));
        const faq = yield faq_model_1.default.create({ question: questionData, answer: answerData });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.question_added, faq, statusCodes_1.default.SUCCESS);
    }),
    updateQuestion: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { answer, question, question_id, language } = data;
        const faq = yield faq_model_1.default.findOne({ _id: question_id });
        if (!faq) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.API_ERROR);
        }
        const updateData = {};
        if (question !== undefined)
            updateData[`question.${language}`] = question;
        if (answer !== undefined)
            updateData[`answer.${language}`] = answer;
        const updated = yield faq_model_1.default.findByIdAndUpdate(question_id, { $set: updateData }, { new: true, runValidators: true }).lean();
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.update_sucess, updated, statusCodes_1.default.SUCCESS);
    }),
    deleteQuestion: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { question_id } = data;
        const exists = yield (0, db_helpers_1.findOne)(faq_model_1.default, { _id: question_id });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.API_ERROR);
        }
        const response = yield (0, db_helpers_1.findByIdAndRemove)(faq_model_1.default, question_id);
        if (response.status) {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, response, statusCodes_1.default.API_ERROR);
    }),
    updateCommonContent: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { type, content, language } = data;
        const text = String(content).trim();
        // Fetch or initialise the single document
        let doc = yield commonContent_model_1.default.findOne();
        if (!doc) {
            doc = new commonContent_model_1.default({});
        }
        const currentEnglish = ((_a = doc[type]) === null || _a === void 0 ? void 0 : _a.en) || "";
        // Rule 1: Non-English update but English hasn't been filled yet
        if (language !== "en" && !currentEnglish) {
            return (0, response_util_1.showResponse)(false, 'Please add the English content first before adding other languages.', null, statusCodes_1.default.API_ERROR);
        }
        const updateData = {};
        if (language === "en") {
            if (!currentEnglish) {
                // Rule 2a: First-time English → translate to all other languages
                updateData[`${type}.en`] = text;
                const translations = yield Promise.all(workflow_constant_1.SUPPORTED_LANGUAGES.filter((lang) => lang !== "en").map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                    const translated = yield (0, langauge_translate_helper_1.translateText)(text, lang);
                    return { lang, translated };
                })));
                translations.forEach(({ lang, translated }) => {
                    updateData[`${type}.${lang}`] = translated;
                });
            }
            else {
                // Rule 2b: English already exists → update English only
                updateData[`${type}.en`] = text;
            }
        }
        else {
            // Rule 3: Update specific non-English language only
            updateData[`${type}.${language}`] = text;
        }
        const updated = yield commonContent_model_1.default.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true, runValidators: true }).lean();
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.update_sucess, updated, statusCodes_1.default.SUCCESS);
    }),
    resentCommonContent: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { type } = data;
        const updateData = {};
        workflow_constant_1.SUPPORTED_LANGUAGES.forEach((lang) => {
            updateData[`${type}.${lang}`] = "";
        });
        const updated = yield commonContent_model_1.default.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true }).lean();
        return (0, response_util_1.showResponse)(true, `Common content for "${type}" has been reset successfully`, updated, statusCodes_1.default.SUCCESS);
    }),
    excelRead: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { file } = data;
            if (!file || (!file.data && !file.buffer)) {
                return (0, response_util_1.showResponse)(false, "No file data found.", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const fileBuffer = file.data || file.buffer;
            console.log(fileBuffer, "fileBuffer");
            // ✅ PUSH TO QUEUE
            const job = yield queue_1.excelQueue.add("process-excel", {
                fileBuffer
            }, {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000
                }
            });
            return (0, response_util_1.showResponse)(true, "File queued successfully", {
                jobId: job.id
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, "Queue error", error, statusCodes_1.default.API_ERROR);
        }
    }),
    addExcelAffirmation: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { file } = data;
            if (!file || (!file.data && !file.buffer)) {
                return (0, response_util_1.showResponse)(false, "No file data found.", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const fileBuffer = file.data || file.buffer;
            console.log(fileBuffer, "fileBuffer");
            // ✅ PUSH TO QUEUE
            const job = yield queue_1.affirmationQueue.add("process-affirmationexcel", {
                fileBuffer
            }, {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000
                }
            });
            return (0, response_util_1.showResponse)(true, "File queued successfully", {
                jobId: job.id
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            return (0, response_util_1.showResponse)(false, "Queue error", error, statusCodes_1.default.API_ERROR);
        }
    }),
    listExcelImport: (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, search = '') {
        const aggregate = [
            {
                $match: {
                    excelTheme: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ];
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_exel_model_1.default, aggregate, page, limit);
        const result = yield admin_exel_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    addAffirmation: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { affirmation } = data;
        const affirmationData = { en: affirmation };
        // Translate to all other languages in parallel
        yield Promise.all(workflow_constant_1.SUPPORTED_LANGUAGES.filter((lang) => lang !== "en").map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const [translatedQ] = yield Promise.all([
                (0, langauge_translate_helper_1.translateText)(affirmation, lang),
            ]);
            affirmationData[lang] = translatedQ;
        })));
        const Affirmation = yield user_affirmation_model_1.default.create({ affirmation: affirmationData });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.question_added, Affirmation, statusCodes_1.default.SUCCESS);
    }),
    listAffirmation: (page, limit, language) => __awaiter(void 0, void 0, void 0, function* () {
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
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            { $sort: { createdAt: -1 } },
        ];
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(user_affirmation_model_1.default, aggregate, page, limit);
        const result = yield user_affirmation_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    editAffirmation: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { affirmation_id, affirmation, language } = data;
        const existingAffirmation = yield (0, db_helpers_1.findOne)(user_affirmation_model_1.default, {
            _id: (0, common_helper_1.convertToObjectId)(affirmation_id),
        });
        if (!existingAffirmation) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.NOT_FOUND);
        }
        // update only selected language
        yield (0, db_helpers_1.findOneAndUpdate)(user_affirmation_model_1.default, { _id: (0, common_helper_1.convertToObjectId)(affirmation_id) }, {
            $set: {
                [`affirmation.${language}`]: affirmation,
            },
        });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.update_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    deleteAffirmation: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { affirmation_id, status } = data;
        console.log(affirmation_id, "affirmation_id");
        const existingAffirmation = yield (0, db_helpers_1.findOne)(user_affirmation_model_1.default, {
            _id: affirmation_id,
        });
        if (!existingAffirmation) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.NOT_FOUND);
        }
        console.log(affirmation_id, "affirmation_id");
        yield (0, db_helpers_1.findOneAndUpdate)(user_affirmation_model_1.default, { _id: (0, common_helper_1.convertToObjectId)(affirmation_id) }, {
            status
        });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    affirmationDetail: (affirmation_id_1, ...args_1) => __awaiter(void 0, [affirmation_id_1, ...args_1], void 0, function* (affirmation_id, language = "en") {
        // console.log(affirmation_id,"affirmation_id")
        const result = yield user_affirmation_model_1.default.aggregate([
            {
                $match: {
                    _id: (0, common_helper_1.convertToObjectId)(affirmation_id),
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
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);
        if (!result.length) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.NOT_FOUND);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, result[0], statusCodes_1.default.SUCCESS);
    }),
};
exports.default = AdminCommonHandler;
