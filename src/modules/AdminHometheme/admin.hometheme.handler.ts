import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import { translateText } from "../../helpers/langauge.translate.helper";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";
import adminHomethemeCategoryModel from "./admin.homethemeCategory.model";

const CommonHandler = {

    createCategoryTheme: async (data: any): Promise<ApiResponse> => {
        const { title, imgUrl } = data;

        const obj: any = {
            title: {}
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

        const createTheme = await adminHomethemeCategoryModel.create({
            title: obj.title,
            imgUrl
        });

        if (!createTheme) {
            return showResponse(false, responseMessage.common.save_failed, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_save, null, statusCodes.SUCCESS);
    },

    updateCategoryTheme: async (data: any): Promise<ApiResponse> => {
        const { title, imgUrl, lang, themeCategoryId } = data
        const obj: any = {
            ...(title && { [`title.${lang}`]: title }),
            ...(imgUrl && { imgUrl })
        };
        const updateTheme = await adminHomethemeCategoryModel.findByIdAndUpdate(
            themeCategoryId,
            { $set: obj },
            { new: true }
        );
        if (!updateTheme) {
            return showResponse(false, responseMessage.common.update_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    deleteCategoryTheme: async (data: any): Promise<ApiResponse> => {
        const { themeCategoryId, status } = data
        const deleteTheme = await adminHomethemeCategoryModel.findOneAndUpdate({ _id: themeCategoryId }, { $set: { status: status } }, { new: true })
        if (!deleteTheme) {
            return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    },

    listCategoryTheme: async (page: number, limit: number, search: string = '', lang: string = 'en'): Promise<ApiResponse> => {
        const aggregate = [
            { $match: { status: { $ne: USER_STATUS.DELETED } } },
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
        ]
        const { totalCount, aggregation } = await getCountAndPagination(adminHomethemeCategoryModel, aggregate, page, limit)
        const result = await adminHomethemeCategoryModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { result, totalCount }, statusCodes.SUCCESS)
    },

    themeCategoryDetails: async (data: any): Promise<ApiResponse> => {
        const { themeCategoryId, lang } = data
        const themeDetails = await adminHomethemeCategoryModel.aggregate([
            { $match: { _id: convertToObjectId(themeCategoryId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    description: `$description.${lang}`
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