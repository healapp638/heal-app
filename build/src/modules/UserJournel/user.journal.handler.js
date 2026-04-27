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
const messages_1 = require("../../helpers/messages");
const user_journel_model_1 = __importDefault(require("./user.journel.model"));
const common_helper_1 = require("../../helpers/common.helper");
const UserCommonHandler = {
    createJournal: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { feeling, title, description } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const response = yield user_journel_model_1.default.create({
            user_id: userId,
            feeling,
            title,
            description
        });
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_creating_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_created_successfully'), null, statusCodes_1.default.SUCCESS);
    }),
    journalList: (cursor_1, ...args_1) => __awaiter(void 0, [cursor_1, ...args_1], void 0, function* (cursor, limit = 10, userId, search_key) {
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const match = {
            user_id: userId,
            status: workflow_constant_1.USER_STATUS.ACTIVE
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match._id = { $gt: parsedCursor._id };
        }
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
        const response = yield user_journel_model_1.default.aggregate([
            {
                $match: match
            },
            {
                $addFields: {
                    feeling: `$feeling.${lang}`,
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
                }
            },
            {
                $match: Object.assign({}, (search_key && {
                    title: {
                        $regex: search_key,
                        $options: 'i'
                    }
                }))
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $limit: limit
            }
        ]);
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_getting_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_fetched_successfully'), response, statusCodes_1.default.SUCCESS);
    }),
    journalDetail: (journalId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const res = yield user_journel_model_1.default.aggregate([
            {
                $match: {
                    _id: (0, common_helper_1.convertToObjectId)(journalId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    feeling: `$feeling.${lang}`,
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
                }
            }
        ]);
        if (!res) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_getting_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_fetched_successfully'), res[0], statusCodes_1.default.SUCCESS);
    }),
    updateJournal: (data, userId, journalId) => __awaiter(void 0, void 0, void 0, function* () {
        const { feeling, title, description } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const response = yield user_journel_model_1.default.findOneAndUpdate({ _id: journalId, user_id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE }, {
            feeling,
            title,
            description
        }, { new: true });
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_updating_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_updated_successfully'), response, statusCodes_1.default.SUCCESS);
    }),
    deleteJournal: (userId, journalId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const response = yield user_journel_model_1.default.findOneAndUpdate({ _id: journalId, user_id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE }, {
            status: workflow_constant_1.USER_STATUS.DELETED
        }, { new: true });
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_deleting_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_deleted_successfully'), response, statusCodes_1.default.SUCCESS);
    }),
};
exports.default = UserCommonHandler;
