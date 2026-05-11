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
const admin_theme_model_1 = __importDefault(require("./admin.theme.model"));
const langauge_translate_helper_1 = require("../../helpers/langauge.translate.helper");
const common_helper_1 = require("../../helpers/common.helper");
const CommonHandler = {
    createTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, imgUrl } = data;
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
        const createTheme = yield admin_theme_model_1.default.create({
            title: obj.title,
            description: obj.description,
            imgUrl
        });
        if (!createTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, null, statusCodes_1.default.SUCCESS);
    }),
    updateTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, imgUrl, lang, themeId } = data;
        const obj = Object.assign(Object.assign(Object.assign({}, (title && { [`title.${lang}`]: title })), (description && { [`description.${lang}`]: description })), (imgUrl && { imgUrl }));
        const updateTheme = yield admin_theme_model_1.default.findByIdAndUpdate(themeId, { $set: obj }, { new: true });
        if (!updateTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.updated_sucessfully, null, statusCodes_1.default.SUCCESS);
    }),
    deleteTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { themeId, status } = data;
        const deleteTheme = yield admin_theme_model_1.default.findOneAndUpdate({ _id: themeId }, { $set: { status: status } }, { new: true });
        if (!deleteTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    listTheme: (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, search = '', lang = 'en') {
        const aggregate = [
            { $match: { status: { $ne: workflow_constant_1.USER_STATUS.DELETED } } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
                }
            },
            {
                $match: {
                    title: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ];
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_theme_model_1.default, aggregate, page, limit);
        const result = yield admin_theme_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount, excel_format: "https://d2aanhz0ffna0r.cloudfront.net/Heal%20Love%20Excel%203.xlsx" }, statusCodes_1.default.SUCCESS);
    }),
    themeDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { themeId, lang } = data;
        const themeDetails = yield admin_theme_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(themeId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
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
