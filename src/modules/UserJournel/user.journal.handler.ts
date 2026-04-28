import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import { getMessage } from "../../helpers/messages";
import userJournalModel from "./user.journel.model";
import { convertToObjectId } from "../../helpers/common.helper";
import translateText from "../../helpers/langauge.translate.helper";

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
                    translateText(feeling, lang),
                    translateText(title, lang),
                    translateText(description, lang)
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
                    description: `$description.${lang}`
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
        return showResponse(true, getMessage(lang, 'journal_fetched_successfully'), { data: response, nextCursor }, statusCodes.SUCCESS)
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
            ...(feeling && { feeling: { [lang]: feeling } }),
            ...(title && { title: { [lang]: title } }),
            ...(description && { description: { [lang]: description } }),
        }
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

}

export default UserCommonHandler 
