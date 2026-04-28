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
const admin_phases_model_1 = __importDefault(require("./admin.phases.model"));
const phaseHandler = {
    createPhase: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, points, subModuleId } = data;
        const obj = {
            title: {}
        };
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const [translatedTitle] = yield Promise.all([
                (0, langauge_translate_helper_1.translateText)(title, lang)
            ]);
            obj.title[lang] = translatedTitle;
        })));
        const createPhase = yield admin_phases_model_1.default.create({
            title: obj.title,
            points: points,
            subModuleId: (0, common_helper_1.convertToObjectId)(subModuleId),
        });
        if (!createPhase) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, null, statusCodes_1.default.SUCCESS);
    }),
    updatePhase: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, points, lang, phaseId } = data;
        const isModuleExist = yield admin_phases_model_1.default.findOne({ _id: phaseId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.phase_not_found, null, statusCodes_1.default.API_ERROR);
        }
        const obj = Object.assign(Object.assign({}, (title && { [`title.${lang}`]: title })), (points && { points: points }));
        const updatePhase = yield admin_phases_model_1.default.findByIdAndUpdate(phaseId, { $set: obj }, { new: true });
        if (!updatePhase) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.updated_sucessfully, null, statusCodes_1.default.SUCCESS);
    }),
    deletePhase: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { phaseId } = data;
        const deletePhase = yield admin_phases_model_1.default.findOneAndUpdate({ _id: phaseId }, { $set: { status: workflow_constant_1.USER_STATUS.DELETED } }, { new: true });
        if (!deletePhase) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    listPhase: (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, search = '', lang = 'en', subModuleId) {
        const aggregate = [
            { $match: { status: { $ne: workflow_constant_1.USER_STATUS.DELETED }, subModuleId: (0, common_helper_1.convertToObjectId)(subModuleId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                }
            },
            {
                $match: {
                    title: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ];
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_phases_model_1.default, aggregate, page, limit);
        const result = yield admin_phases_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    phaseDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { phaseId, lang } = data;
        const themeDetails = yield admin_phases_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(phaseId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                }
            }
        ]);
        if (!themeDetails) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, themeDetails[0], statusCodes_1.default.SUCCESS);
    })
};
exports.default = phaseHandler;
