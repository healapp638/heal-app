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
const admin_modules_model_1 = __importDefault(require("./admin.modules.model"));
const admin_theme_model_1 = __importDefault(require("../AdminTheme/admin.theme.model"));
const CommonHandler = {
    createModule: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, themeId } = data;
        const obj = {
            title: {},
        };
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const [translatedTitle] = yield Promise.all([
                (0, langauge_translate_helper_1.translateText)(title, lang)
            ]);
            obj.title[lang] = translatedTitle;
        })));
        console.log(obj, 'FINAL obj ✅'); // now it will have data
        const createTheme = yield admin_modules_model_1.default.create({
            title: obj.title,
            themeId: (0, common_helper_1.convertToObjectId)(themeId),
        });
        if (!createTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, null, statusCodes_1.default.SUCCESS);
    }),
    updateModule: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, lang, moduleId } = data;
        const isModuleExist = yield admin_modules_model_1.default.findOne({ _id: moduleId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.module_not_found, null, statusCodes_1.default.API_ERROR);
        }
        const obj = Object.assign({}, (title && { [`title.${lang}`]: title }));
        const updateTheme = yield admin_modules_model_1.default.findByIdAndUpdate(moduleId, { $set: obj }, { new: true });
        if (!updateTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.updated_sucessfully, null, statusCodes_1.default.SUCCESS);
    }),
    deleteModule: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { moduleId, status } = data;
        const deleteTheme = yield admin_modules_model_1.default.findOneAndUpdate({ _id: moduleId }, { $set: { status: status } }, { new: true });
        if (!deleteTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    listModule: (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, search = '', lang = 'en', themeId) {
        const aggregate = [
            { $match: { status: { $ne: workflow_constant_1.USER_STATUS.DELETED }, themeId: (0, common_helper_1.convertToObjectId)(themeId) } },
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
        const them_details = yield admin_theme_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(themeId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            }
        ]);
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_modules_model_1.default, aggregate, page, limit);
        const result = yield admin_modules_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { them_details: them_details[0], result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    moduleDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { moduleId, lang } = data;
        const themeDetails = yield admin_modules_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(moduleId) } },
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
exports.default = CommonHandler;
