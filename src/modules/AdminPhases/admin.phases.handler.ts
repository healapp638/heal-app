import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import { languages, USER_STATUS } from "../../constants/workflow.constant";
import { translateText } from "../../helpers/langauge.translate.helper";
import { convertToObjectId, getCountAndPagination } from "../../helpers/common.helper";
import adminPhasesModel from "./admin.phases.model";
import adminSubmodulesModel from "../AdminSubModules/admin.submodules.model";

const phaseHandler = {

    createPhase: async (data: any): Promise<ApiResponse> => {
        const { title,reflection, points, subModuleId } = data;

        const obj: any = {
            title: {},
            reflection: {}
        };

        const langs = Object.values(languages);

        await Promise.all(
            langs.map(async (lang: string) => {
                const [translatedTitle,translatedReflection] = await Promise.all([
                    translateText(title, lang),
                    translateText(reflection, lang),
                ]);

                obj.title[lang] = translatedTitle;
                obj.reflection[lang] = translatedReflection;
            })
        );

        const existingPhase = await adminPhasesModel.findOne({
            subModuleId: convertToObjectId(subModuleId),
            "title.en": obj.title["en"]
        });
        if (existingPhase) {
            return showResponse(false, responseMessage.common.already_existed, null, statusCodes.VALIDATION_ERROR);
        }

        const createPhase = await adminPhasesModel.create({
            title: obj.title,
            points: points,
            subModuleId: convertToObjectId(subModuleId),
        });
        if (!createPhase) {
            return showResponse(false, responseMessage.common.save_failed, null, statusCodes.API_ERROR);
        }

        return showResponse(true, responseMessage.common.data_save, null, statusCodes.SUCCESS);
    },

    updatePhase: async (data: any): Promise<ApiResponse> => {
        const { title,reflection, points, lang, phaseId } = data
        const isModuleExist = await adminPhasesModel.findOne({ _id: phaseId, status: USER_STATUS.ACTIVE });
        if (!isModuleExist) {
            return showResponse(false, responseMessage.common.phase_not_found, null, statusCodes.API_ERROR)
        }

        if (title && lang === 'en') {
            const existingPhase = await adminPhasesModel.findOne({
                _id: { $ne: convertToObjectId(phaseId) },
                subModuleId: isModuleExist.subModuleId,
                "title.en": title
            });
            if (existingPhase) {
                return showResponse(false, responseMessage.common.already_existed, null, statusCodes.VALIDATION_ERROR);
            }
        }

        const obj: any = {
            ...(title && { [`title.${lang}`]: title }),
            ...(reflection && { [`reflection.${lang}`]: reflection }),
            ...(points && { points: points }),
        };
        const updatePhase = await adminPhasesModel.findByIdAndUpdate(
            phaseId,
            { $set: obj },
            { new: true }
        );
        if (!updatePhase) {
            return showResponse(false, responseMessage.common.update_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.updated_sucessfully, null, statusCodes.SUCCESS)
    },

    deletePhase: async (data: any): Promise<ApiResponse> => {
        const { phaseId,status } = data
        const deletePhase = await adminPhasesModel.findOneAndUpdate({ _id: phaseId }, { $set: { status: status } }, { new: true })
        if (!deletePhase) {
            return showResponse(false, responseMessage.common.delete_failed, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.delete_sucess, null, statusCodes.SUCCESS)
    },

    listPhase: async (page: number, limit: number, search: string = '', lang: string = 'en', subModuleId: string): Promise<ApiResponse> => {
        const sub_module_details = await adminSubmodulesModel.aggregate([
            { $match: { _id: convertToObjectId(subModuleId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    reflection: `$reflection.${lang}`,
                    description: `$description.${lang}`,
                }
            }
        ]);
        const aggregate = [
            { $match: { status: { $ne: USER_STATUS.DELETED }, subModuleId: convertToObjectId(subModuleId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    reflection: `$reflection.${lang}`
                }
            },
            {
                $match: {
                    title: { $regex: search, $options: 'i' },
                }
            },
            { $sort: { createdAt: -1 } },
        ]
        const { totalCount, aggregation } = await getCountAndPagination(adminPhasesModel, aggregate, page, limit)
        const result = await adminPhasesModel.aggregate(aggregation)
        return showResponse(true, responseMessage.common.data_retreive_sucess, { sub_module_details: sub_module_details[0], result, totalCount }, statusCodes.SUCCESS)
    },

    phaseDetails: async (data: any): Promise<ApiResponse> => {
        const { phaseId, lang } = data
        const themeDetails = await adminPhasesModel.aggregate([
            { $match: { _id: convertToObjectId(phaseId) } },
            {
                $addFields: {
                    title: `$title.${lang}`,
                    reflection: `$reflection.${lang}`
                }
            }
        ])
        if (!themeDetails) {
            return showResponse(false, responseMessage.common.data_not_found, null, statusCodes.API_ERROR)
        }
        return showResponse(true, responseMessage.common.data_retreive_sucess, themeDetails[0], statusCodes.SUCCESS)
    }
}

export default phaseHandler