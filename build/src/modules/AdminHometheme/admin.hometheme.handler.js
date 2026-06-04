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
const admin_homethemeCategory_model_1 = __importDefault(require("./admin.homethemeCategory.model"));
const admin_hometheme_model_1 = __importDefault(require("./admin.hometheme.model"));
const user_recentHomeTheme_model_1 = __importDefault(require("../UserHomeTheme/user.recentHomeTheme.model"));
const CommonHandler = {
    createCategoryTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, imgUrl } = data;
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
        const createTheme = yield admin_homethemeCategory_model_1.default.create({
            title: obj.title,
            imgUrl
        });
        if (!createTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, null, statusCodes_1.default.SUCCESS);
    }),
    updateCategoryTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, imgUrl, lang, themeCategoryId } = data;
        const obj = Object.assign(Object.assign({}, (title && { [`title.${lang}`]: title })), (imgUrl && { imgUrl }));
        const updateTheme = yield admin_homethemeCategory_model_1.default.findByIdAndUpdate(themeCategoryId, { $set: obj }, { new: true });
        if (!updateTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.updated_sucessfully, null, statusCodes_1.default.SUCCESS);
    }),
    // deleteCategoryTheme: async (data: any): Promise<ApiResponse> => {
    //     const { themeCategoryId, status } = data
    //     const deleteTheme = await adminHomethemeCategoryModel.findOneAndUpdate({ _id: themeCategoryId }, { $set: { status: status } }, { new: true })
    //     if (!deleteTheme) {
    //         return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
    //     }
    //     return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    // },
    deleteCategoryTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { themeCategoryId, status } = data;
        // 1. Delete Category
        const deleteCategory = yield admin_homethemeCategory_model_1.default.findOneAndUpdate({ _id: (0, common_helper_1.convertToObjectId)(themeCategoryId) }, { $set: { status } }, { new: true });
        if (!deleteCategory) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
        }
        // 2. Find all themes under this category
        const themes = yield admin_hometheme_model_1.default.find({
            categoryTheme_id: (0, common_helper_1.convertToObjectId)(themeCategoryId)
        }).select('_id');
        const themeIds = themes.map((item) => item._id);
        // 3. Soft delete all themes
        yield admin_hometheme_model_1.default.updateMany({ categoryTheme_id: (0, common_helper_1.convertToObjectId)(themeCategoryId) }, { $set: { status } });
        // 4. Soft delete all recent theme records
        if (themeIds.length > 0) {
            yield user_recentHomeTheme_model_1.default.updateMany({ homeTheme_id: { $in: themeIds } }, { $set: { status } });
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    listCategoryTheme: (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, search = '', lang = 'en') {
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
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_homethemeCategory_model_1.default, aggregate, page, limit);
        const result = yield admin_homethemeCategory_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    themeCategoryDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { themeCategoryId, lang } = data;
        const themeDetails = yield admin_homethemeCategory_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(themeCategoryId) } },
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
    }),
    createHomeTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryTheme_id, imgUrl, homeImgUrl } = data;
        const createTheme = yield admin_hometheme_model_1.default.create({
            categoryTheme_id: categoryTheme_id,
            imgUrl,
            homeImgUrl
        });
        if (!createTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, null, statusCodes_1.default.SUCCESS);
    }),
    updateHomeTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { hometheme_id, imgUrl, homeImgUrl } = data;
        const obj = Object.assign(Object.assign({}, (imgUrl && { imgUrl })), (homeImgUrl && { homeImgUrl }));
        const updateTheme = yield admin_hometheme_model_1.default.findByIdAndUpdate(hometheme_id, { $set: obj }, { new: true });
        if (!updateTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.updated_sucessfully, null, statusCodes_1.default.SUCCESS);
    }),
    deleteHomeTheme: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { hometheme_id, status } = data;
        const deleteTheme = yield admin_hometheme_model_1.default.findOneAndUpdate({ _id: hometheme_id }, { $set: { status: status } }, { new: true });
        if (!deleteTheme) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
    }),
    listHomeTheme: (categoryTheme_id, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        const aggregate = [
            { $match: { categoryTheme_id: (0, common_helper_1.convertToObjectId)(categoryTheme_id), status: { $ne: workflow_constant_1.USER_STATUS.DELETED } } },
            { $sort: { createdAt: -1 } },
        ];
        const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_hometheme_model_1.default, aggregate, page, limit);
        const result = yield admin_hometheme_model_1.default.aggregate(aggregation);
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
    }),
    homeThemeDetails: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { hometheme_id } = data;
        const themeDetails = yield admin_hometheme_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(hometheme_id) } },
        ]);
        if (!themeDetails) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, themeDetails[0], statusCodes_1.default.SUCCESS);
    }),
};
exports.default = CommonHandler;
