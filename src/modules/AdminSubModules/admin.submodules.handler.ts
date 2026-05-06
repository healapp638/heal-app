import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import { translateText } from "../../helpers/langauge.translate.helper";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";
import adminSubmodulesModel from "./admin.submodules.model";
import adminModulesModel from "../AdminModules/admin.modules.model";

const CommonHandler = {

    createSubModule: async (data: any): Promise<ApiResponse> => {
        const { title, moduleId, description } = data;

        const obj: any = {
            title: {},
            description: {},
        };

        const langs = Object.values(languages);

        await Promise.all(
            langs.map(async (lang: string) => {
                const [translatedTitle, translatedDescription] = await Promise.all([
                    translateText(title, lang),
                    translateText(description, lang)
                ]);

                obj.title[lang] = translatedTitle;
                obj.description[lang] = translatedDescription;
            })
        );
        const createTheme = await adminSubmodulesModel.create({
            title: obj.title,
            moduleId: convertToObjectId(moduleId),
            description: obj.description,
        });
        if (!createTheme) {
            return showResponse(false, responseMessage.common.save_failed, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_save, null, statusCodes.SUCCESS);
    },

    updateSubModule: async (data: any): Promise<ApiResponse> => {
        const { title, lang, subModuleId, description } = data
        const isModuleExist = await adminSubmodulesModel.findOne({ _id: subModuleId, status: USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return showResponse(false, responseMessage.common.module_not_found, null, statusCodes.API_ERROR)
        }
        const obj: any = {
            ...(title && { [`title.${lang}`]: title }),
            ...(description && { [`description.${lang}`]: description }),
        };
        const updateTheme = await adminSubmodulesModel.findByIdAndUpdate(
            subModuleId,
            { $set: obj },
            { new: true }
        );
        if (!updateTheme) {
            return showResponse(false, responseMessage.common.update_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    deleteSubModule: async (data: any): Promise<ApiResponse> => {
        const { subModuleId,status } = data
        const deleteTheme = await adminSubmodulesModel.findOneAndUpdate({ _id: subModuleId }, { $set: { status: status } }, { new: true })
        if (!deleteTheme) {
            return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    },

    listSubModule: async (page: number, limit: number, search: string = '', lang: string = 'en', moduleId: string): Promise<ApiResponse> => {
        const module_details = await adminModulesModel.aggregate([
            { $match: { _id: convertToObjectId(moduleId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                }
            }
        ])
        const aggregate = [
            { $match: { status: { $ne: USER_STATUS.DELETED }, moduleId: convertToObjectId(moduleId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            },
            {
                $match: {
                    title: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ]
        const { totalCount, aggregation } = await getCountAndPagination(adminSubmodulesModel, aggregate, page, limit)
        const result = await adminSubmodulesModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { module_details: module_details[0], result, totalCount }, statusCodes.SUCCESS)
    },

    subModuleDetails: async (data: any): Promise<ApiResponse> => {
        const { subModuleId, lang } = data
        const themeDetails = await adminSubmodulesModel.aggregate([
            { $match: { _id: convertToObjectId(subModuleId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            }
        ])
        if (!themeDetails) {
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.data_retreive_sucess, themeDetails[0], statusCodes.SUCCESS)
    }
}

export default CommonHandler