import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import { translateText } from "../../helpers/langauge.translate.helper";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";
import adminModulesModel from "./admin.modules.model";
import adminThemeModel from "../AdminTheme/admin.theme.model";

const CommonHandler = {

    createModule: async (data: any): Promise<ApiResponse> => {
        const { title, themeId } = data;

        const obj: any = {
            title: {},
        };

        const langs = Object.values(languages);

        await Promise.all(
            langs.map(async (lang: string) => {
                const [translatedTitle] = await Promise.all([
                    translateText(title, lang)
                ]);

                obj.title[lang] = translatedTitle;
            })
        );

        console.log(obj, 'FINAL obj ✅'); // now it will have data

        const createTheme = await adminModulesModel.create({
            title: obj.title,
            themeId: convertToObjectId(themeId),
        });

        if (!createTheme) {
            return showResponse(false, responseMessage.common.save_failed, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_save, null, statusCodes.SUCCESS);
    },

    updateModule: async (data: any): Promise<ApiResponse> => {
        const { title, lang, moduleId } = data
        const isModuleExist = await adminModulesModel.findOne({ _id: moduleId, status: USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return showResponse(false, responseMessage.common.module_not_found, null, statusCodes.API_ERROR)
        }
        const obj: any = {
            ...(title && { [`title.${lang}`]: title }),
        };
        const updateTheme = await adminModulesModel.findByIdAndUpdate(
            moduleId,
            { $set: obj },
            { new: true }
        );
        if (!updateTheme) {
            return showResponse(false, responseMessage.common.update_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    deleteModule: async (data: any): Promise<ApiResponse> => {
        const { moduleId,status} = data
        const deleteTheme = await adminModulesModel.findOneAndUpdate({ _id: moduleId }, { $set: { status: status } }, { new: true })
        if (!deleteTheme) {
            return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    },

    listModule: async (page: number, limit: number, search: string = '', lang: string = 'en', themeId: string): Promise<ApiResponse> => {
        const aggregate = [
            { $match: { status: { $ne: USER_STATUS.DELETED }, themeId: convertToObjectId(themeId) } },
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
        const them_details = await adminThemeModel.aggregate([
            { $match: { _id: convertToObjectId(themeId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`,
                }
            }
        ])
        const { totalCount, aggregation } = await getCountAndPagination(adminModulesModel, aggregate, page, limit)
        const result = await adminModulesModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { them_details: them_details[0], result, totalCount }, statusCodes.SUCCESS)
    },

    moduleDetails: async (data: any): Promise<ApiResponse> => {
        const { moduleId, lang } = data
        const themeDetails = await adminModulesModel.aggregate([
            { $match: { _id: convertToObjectId(moduleId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
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