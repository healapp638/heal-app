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
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const langauge_translate_helper_1 = require("../../helpers/langauge.translate.helper");
const common_helper_1 = require("../../helpers/common.helper");
const admin_exercise_details__model_1 = __importDefault(require("./admin.exercise.details..model"));
const admin_excercise_model_1 = __importDefault(require("./admin.excercise.model"));
const exerciseHandler = {
    createExerciseDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { reading_title, reading_description, concept_title, concept_description, reflection, phase_id } = data;
        const obj = {
            reading_title: {},
            reading_description: {},
            concept_title: {},
            concept_description: {},
            reflection: {}
        };
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const [translatedReadingTitle, translatedReadingDescription, translatedConceptTitle, translatedConceptDescription, translatedReflection] = yield Promise.all([
                (0, langauge_translate_helper_1.translateText)(reading_title, lang),
                (0, langauge_translate_helper_1.translateText)(reading_description, lang),
                (0, langauge_translate_helper_1.translateText)(concept_title, lang),
                (0, langauge_translate_helper_1.translateText)(concept_description, lang),
                (0, langauge_translate_helper_1.translateText)(reflection, lang)
            ]);
            obj.reading_title[lang] = translatedReadingTitle;
            obj.reading_description[lang] = translatedReadingDescription;
            obj.concept_title[lang] = translatedConceptTitle;
            obj.concept_description[lang] = translatedConceptDescription;
            obj.reflection[lang] = translatedReflection;
        })));
        const createExerciseDetails = yield admin_exercise_details__model_1.default.create({
            reading_title: obj.reading_title,
            reading_description: obj.reading_description,
            concept_title: obj.concept_title,
            concept_description: obj.concept_description,
            reflection: obj.reflection,
            phase_id: (0, common_helper_1.convertToObjectId)(phase_id),
        });
        if (!createExerciseDetails) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, null, statusCodes_1.default.SUCCESS);
    }),
    updateExerciseDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { reading_title, reading_description, concept_title, concept_description, reflection, exercise_details_id, lang } = data;
        const isModuleExist = yield admin_exercise_details__model_1.default.findOne({ _id: exercise_details_id, status: workflow_constant_1.USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.exercise_details_not_found, null, statusCodes_1.default.API_ERROR);
        }
        const obj = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (reading_title && { [`reading_title.${lang}`]: reading_title })), (reading_description && { [`reading_description.${lang}`]: reading_description })), (concept_title && { [`concept_title.${lang}`]: concept_title })), (concept_description && { [`concept_description.${lang}`]: concept_description })), (reflection && { [`reflection.${lang}`]: reflection }));
        const updateExerciseDetails = yield admin_exercise_details__model_1.default.findByIdAndUpdate(exercise_details_id, { $set: obj }, { new: true });
        if (!updateExerciseDetails) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.updated_sucessfully, null, statusCodes_1.default.SUCCESS);
    }),
    deleteExerciseDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { exercise_details_id } = data;
        const deleteExerciseDetails = yield admin_exercise_details__model_1.default.findOneAndUpdate({ _id: exercise_details_id }, { $set: { status: workflow_constant_1.USER_STATUS.DELETED } }, { new: true });
        if (!deleteExerciseDetails) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    listExerciseDetails: (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, search = '', lang = 'en', phase_id) {
        const aggregate = [
            { $match: { status: { $ne: workflow_constant_1.USER_STATUS.DELETED }, phase_id: (0, common_helper_1.convertToObjectId)(phase_id) } },
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
        ];
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_exercise_details__model_1.default, aggregate, page, limit);
        const result = yield admin_exercise_details__model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    exerciseDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { exercise_details_id, lang } = data;
        const themeDetails = yield admin_exercise_details__model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(exercise_details_id) } },
            {
                $addFields: {
                    reading_title: `$reading_title.${lang}`,
                    reading_description: `$reading_description.${lang}`,
                    concept_title: `$concept_title.${lang}`,
                    concept_description: `$concept_description.${lang}`,
                    reflection: `$reflection.${lang}`,
                }
            }
        ]);
        if (!themeDetails) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, themeDetails[0], statusCodes_1.default.SUCCESS);
    }),
    createExercise: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, exercise_details_id } = data;
        const obj = {
            title: {},
            description: {}
        };
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const [translatedTitle, translatedDescription] = yield Promise.all([
                (0, langauge_translate_helper_1.translateText)(title, lang),
                (0, langauge_translate_helper_1.translateText)(description, lang)
            ]);
            obj.title[lang] = translatedTitle;
            obj.description[lang] = translatedDescription;
        })));
        const createExercise = yield admin_excercise_model_1.default.create({
            title: obj.title,
            description: obj.description,
            exercise_details_id: (0, common_helper_1.convertToObjectId)(exercise_details_id),
        });
        if (!createExercise) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, null, statusCodes_1.default.SUCCESS);
    }),
    updateExercise: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, exercise_id, lang } = data;
        const isModuleExist = yield admin_excercise_model_1.default.findOne({ _id: exercise_id, status: workflow_constant_1.USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.exercise_not_found, null, statusCodes_1.default.API_ERROR);
        }
        const obj = Object.assign(Object.assign({}, (title && { [`title.${lang}`]: title })), (description && { [`description.${lang}`]: description }));
        const updateExercise = yield admin_excercise_model_1.default.findByIdAndUpdate(exercise_id, { $set: obj }, { new: true });
        if (!updateExercise) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.updated_sucessfully, null, statusCodes_1.default.SUCCESS);
    }),
    deleteExercise: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { exercise_id } = data;
        const deleteExercise = yield admin_excercise_model_1.default.findOneAndUpdate({ _id: exercise_id }, { $set: { status: workflow_constant_1.USER_STATUS.DELETED } }, { new: true });
        if (!deleteExercise) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    listExercise: (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, search = '', lang = 'en', exercise_details_id) {
        const aggregate = [
            { $match: { status: { $ne: workflow_constant_1.USER_STATUS.DELETED }, exercise_details_id: (0, common_helper_1.convertToObjectId)(exercise_details_id) } },
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
        ];
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_excercise_model_1.default, aggregate, page, limit);
        const result = yield admin_excercise_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    singleExercise: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { exercise_id, lang } = data;
        const themeDetails = yield admin_excercise_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(exercise_id) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            }
        ]);
        if (!themeDetails) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, themeDetails[0], statusCodes_1.default.SUCCESS);
    })
};
exports.default = exerciseHandler;
