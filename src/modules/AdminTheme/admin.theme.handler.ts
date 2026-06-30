import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import adminThemeModel from "./admin.theme.model";
import { translateText } from "../../helpers/langauge.translate.helper";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";
import adminModulesModel from "../AdminModules/admin.modules.model";
import adminSubmodulesModel from "../AdminSubModules/admin.submodules.model";
import adminPhasesModel from "../AdminPhases/admin.phases.model";
import adminExerciseDetailsModel from "../AdminExercise/admin.exercise.details..model";
import adminExcerciseModel from "../AdminExercise/admin.excercise.model";

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

        const existingTheme = await adminThemeModel.findOne({
            "title.en": obj.title["en"]
        });
        if (existingTheme) {
            return showResponse(false, responseMessage.common.already_existed, null, statusCodes.VALIDATION_ERROR);
        }

        const createTheme = await adminThemeModel.create({
            title: obj.title,
            description: obj.description,
            imgUrl
        });

        if (!createTheme) {
            return showResponse(false, responseMessage.common.save_failed, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_save, null, statusCodes.SUCCESS);
    },

    updateTheme: async (data: any): Promise<ApiResponse> => {
        const { title, description, imgUrl, lang, themeId } = data

        if (title && lang === 'en') {
            const existingTheme = await adminThemeModel.findOne({
                _id: { $ne: convertToObjectId(themeId) },
                "title.en": title
            });
            if (existingTheme) {
                return showResponse(false, responseMessage.common.already_existed, null, statusCodes.VALIDATION_ERROR);
            }
        }

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
            return showResponse(false, responseMessage.common.update_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    // deleteTheme: async (data: any): Promise<ApiResponse> => {
    //     const { themeId, status } = data
    //     const deleteTheme = await adminThemeModel.findOneAndUpdate({ _id: themeId }, { $set: { status: status } }, { new: true })
    //     if (!deleteTheme) {
    //         return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
    //     }
    //     return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    // },
    deleteTheme: async (data: any): Promise<ApiResponse> => {

    try {

        const {
            themeId,
            status,
        } = data;

        // ================= THEME =================
        const deleteTheme =
            await adminThemeModel.findOneAndUpdate(
                {
                    _id: convertToObjectId(themeId),
                },
                {
                    $set: {
                        status: status,
                    },
                },
                {
                    new: true,
                }
            );

        if (!deleteTheme) {

            return showResponse(
                false,
                responseMessage.common.delete_failed,
                null,
                statusCodes.API_ERROR
            );
        }

        // ================= MODULES =================
        const modules =
            await adminModulesModel.find(
                {
                    themeId: convertToObjectId(themeId),
                },
                {
                    _id: 1,
                }
            );

        const moduleIds =
            modules.map((item: any) => item._id);

        await adminModulesModel.updateMany(
            {
                themeId: convertToObjectId(themeId),
            },
            {
                $set: {
                    status: status,
                },
            }
        );

        // ================= SUB MODULES =================
        const subModules =
            await adminSubmodulesModel.find(
                {
                    moduleId: {
                        $in: moduleIds,
                    },
                },
                {
                    _id: 1,
                }
            );

        const subModuleIds =
            subModules.map((item: any) => item._id);

        await adminSubmodulesModel.updateMany(
            {
                moduleId: {
                    $in: moduleIds,
                },
            },
            {
                $set: {
                    status: status,
                },
            }
        );

        // ================= PHASES =================
        const phases =
            await adminPhasesModel.find(
                {
                    subModuleId: {
                        $in: subModuleIds,
                    },
                },
                {
                    _id: 1,
                }
            );

        const phaseIds =
            phases.map((item: any) => item._id);

        await adminPhasesModel.updateMany(
            {
                subModuleId: {
                    $in: subModuleIds,
                },
            },
            {
                $set: {
                    status: status,
                },
            }
        );

        // ================= EXERCISE DETAILS =================
        const exerciseDetails =
            await adminExerciseDetailsModel.find(
                {
                    phase_id: {
                        $in: phaseIds,
                    },
                },
                {
                    _id: 1,
                }
            );

        const exerciseDetailIds =
            exerciseDetails.map((item: any) => item._id);

        await adminExerciseDetailsModel.updateMany(
            {
                phase_id: {
                    $in: phaseIds,
                },
            },
            {
                $set: {
                    status: status,
                },
            }
        );

        // ================= EXERCISES =================
        await adminExcerciseModel.updateMany(
            {
                exercise_details_id: {
                    $in: exerciseDetailIds,
                },
            },
            {
                $set: {
                    status: status,
                },
            }
        );

        return showResponse(
            true,
            responseMessage.common.delete_sucess,
            null,
            statusCodes.SUCCESS
        );

    } catch (error:any) {

        // console.log(
        //     error,
        //     "DELETE_THEME_ERROR"
        // );

        return showResponse(
            false,
            responseMessage.common.server_error,
            error?.message,
            statusCodes.API_ERROR
        );
    }
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
            { $sort: { createdAt: 1 } },
        ]
        const { totalCount, aggregation } = await getCountAndPagination(adminThemeModel, aggregate, page, limit)
        const result = await adminThemeModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { result, totalCount,excel_format:
                "https://d2aanhz0ffna0r.cloudfront.net/format%20of%20excel.xlsx" }, statusCodes.SUCCESS)
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