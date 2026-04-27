import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import { USER_STATUS } from "../../constants/workflow.constant";
import { getMessage } from "../../helpers/messages";
import userJournalModel from "./user.journel.model";
import { convertToObjectId } from "../../helpers/common.helper";

const UserCommonHandler = {

    createJournal: async (data: any, userId: string): Promise<ApiResponse> => {
        const { feeling, title, description } = data;
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const response = await userJournalModel.create({
            user_id: userId,
            feeling,
            title,
            description
        })
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_creating_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_created_successfully'), null, statusCodes.SUCCESS)
    },

    journalList: async (cursor: string, limit: number = 10, userId: string, search_key: string): Promise<ApiResponse> => {
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const match: any = {
            user_id: userId,
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
        ])
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_getting_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_fetched_successfully'), response, statusCodes.SUCCESS)
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

    updateJournal: async (data: any, userId: string, journalId: string): Promise<ApiResponse> => {
        const { feeling, title, description } = data;
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const response = await userJournalModel.findOneAndUpdate({ _id: journalId, user_id: userId, status: USER_STATUS.ACTIVE }, {
            feeling,
            title,
            description
        }, { new: true });
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_updating_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_updated_successfully'), response, statusCodes.SUCCESS)
    },

    deleteJournal: async (userId: string, journalId: string): Promise<ApiResponse> => {
        const user: any = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const lang = user.language || 'en'
        if (!user) {
            return showResponse(false, getMessage(lang, 'user_not_found'), null, statusCodes.API_ERROR)
        }
        const response = await userJournalModel.findOneAndUpdate({ _id: journalId, user_id: userId, status: USER_STATUS.ACTIVE }, {
            status: USER_STATUS.DELETED
        }, { new: true });
        if (!response) {
            return showResponse(false, getMessage(lang, 'error_while_deleting_journal'), null, statusCodes.API_ERROR)
        }
        return showResponse(true, getMessage(lang, 'journal_deleted_successfully'), response, statusCodes.SUCCESS)
    },

}

export default UserCommonHandler 
