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
const langauge_translate_helper_1 = require("../../helpers/langauge.translate.helper");
const moment_1 = __importDefault(require("moment"));
const UserCommonHandler = {
    createJournal: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { feeling, title, description } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const obj = {
            feeling: {},
            title: {},
            description: {}
        };
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const [translatedFeeling, translatedTitle, translatedDescription] = yield Promise.all([
                (0, langauge_translate_helper_1.UserTranslateText)(feeling, lang, user.language),
                (0, langauge_translate_helper_1.UserTranslateText)(title, lang, user.language),
                (0, langauge_translate_helper_1.UserTranslateText)(description, lang, user.language)
            ]);
            obj.feeling[lang] = translatedFeeling;
            obj.title[lang] = translatedTitle;
            obj.description[lang] = translatedDescription;
        })));
        const response = yield user_journel_model_1.default.create({
            user_id: userId,
            feeling: obj.feeling,
            title: obj.title,
            description: obj.description
        });
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_creating_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_created_successfully'), null, statusCodes_1.default.SUCCESS);
    }),
    journalList: (cursor_1, ...args_1) => __awaiter(void 0, [cursor_1, ...args_1], void 0, function* (cursor, limit = 10, search_key, userId) {
        limit = Number(limit);
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const start_date = (0, moment_1.default)().startOf('day').format("%m-%d-%Y");
        const end_date = (0, moment_1.default)().endOf('day').format("%m-%d-%Y");
        const match = {
            user_id: (0, common_helper_1.convertToObjectId)(userId),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            createdAt: {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
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
                    description: `$description.${lang}`,
                    date: {
                        $dateToString: {
                            format: "%m-%d-%Y", // 👉 change format if needed
                            date: "$createdAt"
                        }
                    }
                }
            },
            {
                $match: Object.assign({}, (search_key && {
                    $or: [
                        { title: { $regex: search_key, $options: 'i' } },
                        { description: { $regex: search_key, $options: 'i' } }
                    ]
                }))
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $group: {
                    _id: "$date",
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $sort: {
                    _id: -1 // latest date first
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    data: 1
                }
            },
            {
                $limit: limit
            }
        ]);
        const nextCursor = response.length > 0 ? JSON.stringify({
            _id: response[response.length - 1]._id,
            createdAt: response[response.length - 1].createdAt
        }) : null;
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_getting_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_fetched_successfully'), { response, nextCursor }, statusCodes_1.default.SUCCESS);
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
    updateJournal: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { journal_id, feeling, title, description } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const updateObj = Object.assign(Object.assign(Object.assign({}, (feeling && { feeling: {} })), (title && { title: {} })), (description && { description: {} }));
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            if (feeling) {
                updateObj.feeling[lang] = yield (0, langauge_translate_helper_1.UserTranslateText)(feeling, lang, user.language);
            }
            if (title) {
                updateObj.title[lang] = yield (0, langauge_translate_helper_1.UserTranslateText)(title, lang, user.language);
            }
            if (description) {
                updateObj.description[lang] = yield (0, langauge_translate_helper_1.UserTranslateText)(description, lang, user.language);
            }
        })));
        const response = yield user_journel_model_1.default.findOneAndUpdate({ _id: journal_id, user_id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE }, updateObj, { new: true });
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_updating_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_updated_successfully'), response, statusCodes_1.default.SUCCESS);
    }),
    deleteJournal: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { journal_id } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const response = yield user_journel_model_1.default.findOneAndUpdate({ _id: journal_id, user_id: userId }, {
            status: workflow_constant_1.USER_STATUS.DELETED
        }, { new: true });
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_deleting_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_deleted_successfully'), response, statusCodes_1.default.SUCCESS);
    }),
    journalListByDate: (date, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const start_of_day = (0, moment_1.default)(date).startOf('day').toDate();
        const end_of_day = (0, moment_1.default)(date).endOf('day').toDate();
        const response = yield user_journel_model_1.default.aggregate([{
                $match: {
                    user_id: (0, common_helper_1.convertToObjectId)(userId),
                    createdAt: {
                        $gte: start_of_day,
                        $lte: end_of_day
                    }
                }
            }, {
                $sort: { createdAt: -1 }
            }, {
                $addFields: {
                    feeling: `$feeling.${lang}`,
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
                }
            }]);
        const total = yield user_journel_model_1.default.countDocuments({
            user_id: (0, common_helper_1.convertToObjectId)(userId),
            createdAt: {
                $gte: start_of_day,
                $lte: end_of_day
            }
        });
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_getting_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_fetched_successfully'), { response, total }, statusCodes_1.default.SUCCESS);
    }),
    journalMapList: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const lang = user.language || 'en';
        if (!user) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'user_not_found'), null, statusCodes_1.default.API_ERROR);
        }
        const response = yield user_journel_model_1.default.aggregate([
            {
                $match: {
                    user_id: (0, common_helper_1.convertToObjectId)(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    feeling: `$feeling.${lang}`,
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
                }
            },
            // 🔥 Convert date → YYYY-MM-DD
            {
                $addFields: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            // 🔥 Group by date
            {
                $group: {
                    _id: "$date",
                    total: { $sum: 1 },
                }
            },
            // 🔥 Rename fields
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    total: 1,
                }
            },
            {
                $sort: { date: -1 }
            }
        ]);
        if (!response) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(lang, 'error_while_getting_journal'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(lang, 'journal_fetched_successfully'), response, statusCodes_1.default.SUCCESS);
    })
};
exports.default = UserCommonHandler;
