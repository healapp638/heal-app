import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import { getMessage } from "../../helpers/messages";
import userJournalModel from "./user.journel.model";
import { convertToObjectId } from "../../helpers/common.helper";
import { UserTranslateText } from "../../helpers/langauge.translate.helper";
import moment from "moment";

const UserCommonHandler = {

    createJournal: async (data: any, userId: string): Promise<ApiResponse> => {
        const { feeling, title, description } = data;
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }

        const obj: any = {
            feeling: {},
            title: {},
            description: {}
        };

        const langs = Object.values(languages);

        await Promise.all(
            langs.map(async (lang: string) => {
                const [translatedFeeling, translatedTitle, translatedDescription] = await Promise.all([
                    UserTranslateText(feeling, lang, user.language),
                    UserTranslateText(title, lang, user.language),
                    UserTranslateText(description, lang, user.language)
                ]);

                obj.feeling[lang] = translatedFeeling;
                obj.title[lang] = translatedTitle;
                obj.description[lang] = translatedDescription;
            })
        );

        const response = await userJournalModel.create({
            user_id: userId,
            feeling: obj.feeling,
            title: obj.title,
            description: obj.description
        })
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_creating_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_created_successfully'), null, statusCodes.SUCCESS)
    },

    journalList: async (cursor: string, limit: number = 10, search_key: string, userId: string): Promise<ApiResponse> => {
        limit = Number(limit)
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user?.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const match: any = {
            user_id: convertToObjectId(userId),
            status: USER_STATUS.ACTIVE
        }
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match._id = { $gt: parsedCursor._id }
        }
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: convertToObjectId(parsedCursor._id) }
                }
            ]
        }

        const response = await userJournalModel.aggregate([
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
                $match: {
                    ...(search_key && {
                        title: {
                            $regex: search_key,
                            $options: 'i'
                        }
                    })
                }
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
            return showResponse(false, getMessage(lang, 'error_while_getting_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_fetched_successfully'), { response, nextCursor }, statusCodes.SUCCESS)
    },

    journalDetail: async (journalId: string, userId: string,): Promise<ApiResponse> => {
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE })
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const res: any = await userJournalModel.aggregate([
            {
                $match: {
                    _id: convertToObjectId(journalId),
                    status: USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    feeling: `$feeling.${lang}`,
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
                }
            }
        ])
        if (!res) {
            return showResponse(false, getMessage(lang, 'error_while_getting_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_fetched_successfully'), res[0], statusCodes.SUCCESS)
    },

    updateJournal: async (data: any, userId: string): Promise<ApiResponse> => {
        const { journal_id, feeling, title, description } = data;
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const updateObj: any = {
            ...(feeling && { feeling: {} }),
            ...(title && { title: {} }),
            ...(description && { description: {} }),
        }
        const langs = Object.values(languages);

        await Promise.all(
            langs.map(async (lang: string) => {
                if (feeling) {
                    updateObj.feeling[lang] = await UserTranslateText(feeling, lang, user.language)
                }
                if (title) {
                    updateObj.title[lang] = await UserTranslateText(title, lang, user.language)
                }
                if (description) {
                    updateObj.description[lang] = await UserTranslateText(description, lang, user.language)
                }
            })
        );

        const response = await userJournalModel.findOneAndUpdate({ _id: journal_id, user_id: userId, status: USER_STATUS.ACTIVE }, updateObj, { new: true });
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_updating_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_updated_successfully'), response, statusCodes.SUCCESS)
    },

    deleteJournal: async (data: any, userId: string): Promise<ApiResponse> => {
        const { journal_id } = data;
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const response = await userJournalModel.findOneAndUpdate({ _id: journal_id, user_id: userId }, {
            status: USER_STATUS.DELETED
        }, { new: true });
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_deleting_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_deleted_successfully'), response, statusCodes.SUCCESS)
    },

    journalListByDate: async (date: string, userId: string): Promise<ApiResponse> => {
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const start_of_day = moment(date).startOf('day').toDate();
        const end_of_day = moment(date).endOf('day').toDate();
        const response = await userJournalModel.aggregate([{
            $match: {
                user_id: convertToObjectId(userId),
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
        const total = await userJournalModel.countDocuments({
            user_id: convertToObjectId(userId),
            createdAt: {
                $gte: start_of_day,
                $lte: end_of_day
            }
        });
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_getting_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_fetched_successfully'), { response, total }, statusCodes.SUCCESS)
    },

    journalMapList: async (userId: string): Promise<ApiResponse> => {
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const response = await userJournalModel.aggregate([
            {
                $match: {
                    user_id: convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE
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
            return showResponse(false, getMessage(lang, 'error_while_getting_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_fetched_successfully'), response, statusCodes.SUCCESS)
    }

}

export default UserCommonHandler 
