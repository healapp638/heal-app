import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import adminThemeModel from "./admin.theme.model";
import translateText from "../../helpers/langauge.translate.helper";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";

const CommonHandler = {

    createTheme: async (data: any): Promise<ApiResponse> => {
        const { title, description, imgUrl } = data;

        const obj: any = {
            title: {},
            description: {}
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

        console.log(obj, 'FINAL obj ✅'); // now it will have data

        const createTheme = await adminThemeModel.create({
            title: obj.title,
            description: obj.description,
            imgUrl
        });

        if (!createTheme) {
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_retreive_sucess, null, statusCodes.SUCCESS);
    },

    updateTheme: async (data: any): Promise<ApiResponse> => {
        const { title, description, imgUrl, lang, themeId } = data
        const obj: any = {
            ...(title && { [`title.${lang}`]: title }),
            ...(description && { [`description.${lang}`]: description }),
            ...(imgUrl && { imgUrl })
        };
        const updateTheme = await adminThemeModel.findByIdAndUpdate(
            themeId,
            { $set: obj },
            { new: true }
        );
        if (!updateTheme) {
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    deleteTheme: async (data: any): Promise<ApiResponse> => {
        const { themeId } = data
        const deleteTheme = await adminThemeModel.findOneAndUpdate({ _id: themeId }, { $set: { status: USER_STATUS.DELETED } }, { new: true })
        if (!deleteTheme) {
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    },

    listTheme: async (page: number, limit: number, search: string = '', lang: string = 'en'): Promise<ApiResponse> => {
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
        const { totalCount, aggregation } = await getCountAndPagination(adminThemeModel, aggregate, page, limit)
        const result = await adminThemeModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { result, totalCount }, statusCodes.SUCCESS)
    },

    themeDetails: async (data: any): Promise<ApiResponse> => {
        const { themeId, lang } = data
        const themeDetails = await adminThemeModel.aggregate([
            { $match: { _id: convertToObjectId(themeId) } },
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