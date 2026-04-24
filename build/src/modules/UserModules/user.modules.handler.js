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
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const admin_theme_model_1 = __importDefault(require("../AdminTheme/admin.theme.model"));
const common_helper_1 = require("../../helpers/common.helper");
const UserCommonHandler = {
    themeList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({
            _id: userId,
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        const userLang = user === null || user === void 0 ? void 0 : user.language;
        const match = {
            status: workflow_constant_1.USER_STATUS.ACTIVE
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const themeList = yield admin_theme_model_1.default.aggregate([
            { $match: match },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $limit: Number(limit)
            }
        ]);
        const last = themeList[themeList.length - 1];
        const nextCursor = last
            ? JSON.stringify({
                createdAt: last.createdAt,
                _id: last._id
            })
            : null;
        return (0, response_util_1.showResponse)(true, "success", {
            data: themeList,
            nextCursor
        }, statusCodes_1.default.SUCCESS);
    })
};
exports.default = UserCommonHandler;
