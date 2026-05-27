import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import { USER_STATUS } from "../../constants/workflow.constant";
import adminThemeModel from "../AdminTheme/admin.theme.model";
import { convertToObjectId } from "../../helpers/common.helper";
import adminModulesModel from "../AdminModules/admin.modules.model";
import { getMessage } from "../../helpers/messages";
import adminSubmodulesModel from "../AdminSubModules/admin.submodules.model";
import adminPhasesModel from "../AdminPhases/admin.phases.model";
import adminExerciseDetailsModel from "../AdminExercise/admin.exercise.details..model";
import adminExcerciseModel from "../AdminExercise/admin.excercise.model";
import userModulesCompleteLessonModel from "./user.modules.complete.lesson.model";
import userModulesCompletePhaseModel from "./user.modules.complete.phase.model";
import userModuleStartLessonModel from "./user.module.start.lesson.model";
import adminMcqexerciseModel from "../AdminExercise/admin.mcqexercise.model";
import userMcqanswerExerciseModel from "./user.mcqanswer.exercise.model";
import responseMessages from "../../constants/responseMessages";

const UserCommonHandler = {

    themeList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language;
        console.log(userLang, "userLang")

        const match: any = {
            status: USER_STATUS.ACTIVE
        };

        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: convertToObjectId(parsedCursor._id) }
                }
            ];
        }

        const themeList = await adminThemeModel.aggregate([
            { $match: match },

            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            },

            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },

            {
                $limit: Number(limit)
            }
        ]);

        const last = themeList[themeList.length - 1];

        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        console.log(themeList, "themeList")

        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { data: themeList, nextCursor }, statusCodes.SUCCESS);
    },

    moduleList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { theme_id, cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language;

        const theme = await adminThemeModel.aggregate([
            { $match: { _id: convertToObjectId(theme_id), status: USER_STATUS.ACTIVE } },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            }
        ]);
        if (theme.length === 0) {
            return showResponse(false, getMessage(userLang || 'en', 'theme_not_found'), null, statusCodes.NOT_FOUND);
        }


        const match: any = {
            themeId: convertToObjectId(theme_id),
            status: USER_STATUS.ACTIVE
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: convertToObjectId(parsedCursor._id) }
                }
            ];
        }
        const moduleList = await adminModulesModel.aggregate([
            { $match: match },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            },
            {
                $lookup: {
                    from: 'submodules',
                    localField: '_id',
                    foreignField: 'moduleId',
                    as: 'sub_modules',
                    pipeline: [
                        {
                            $match: {
                                status: USER_STATUS.ACTIVE
                            }
                        },
                        {
                            $addFields: {
                                title: `$title.${userLang}`,
                                description: `$description.${userLang}`
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1,
                                _id: -1
                            }
                        },
                        {
                            $lookup: {
                                from: 'phases',
                                localField: '_id',
                                foreignField: 'subModuleId',
                                as: 'phases',
                                pipeline: [
                                    {
                                        $match: {
                                            status: USER_STATUS.ACTIVE
                                        }
                                    },
                                    {
                                        $addFields: {
                                            title: `$title.${userLang}`,
                                        }
                                    },
                                    {
                                        $sort: {
                                            createdAt: -1,
                                            _id: -1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'completed_phases',
                                localField: '_id',
                                foreignField: 'sub_module_id',
                                as: 'completedPhase',
                                pipeline: [
                                    {
                                        $match: {
                                            user_id: convertToObjectId(userId)
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                totalPhaseCount: { $size: "$phases" },
                                totalCompletedPhaseCount: { $size: "$completedPhase" }
                            }
                        },
                        {
                            $project: {
                                phases: 0,
                                completedPhase: 0
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $limit: Number(limit)
            }
        ]);

        const last = moduleList[moduleList.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { moduleList, theme: theme[0], nextCursor }, statusCodes.SUCCESS);
    },

    phaseList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { sub_module_id, cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const subModules = await adminSubmodulesModel.aggregate([
            {
                $match: {
                    _id: convertToObjectId(sub_module_id),
                    status: USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            }
        ]);

        const match: any = {
            status: USER_STATUS.ACTIVE,
            subModuleId: convertToObjectId(sub_module_id)
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

        const phases = await adminPhasesModel.aggregate([
            {
                $match: match
            },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    reflection: `$reflection.${userLang}`
                }
            },
            {
                $lookup: {
                    from: 'completed_phases',
                    localField: '_id',
                    foreignField: 'phase_id',
                    as: 'completedPhase',
                    pipeline: [
                        {
                            $match: {
                                status: USER_STATUS.ACTIVE,
                                user_id: convertToObjectId(userId)
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    isCompleted: {
                        $cond: {
                            if: { $gt: [{ $size: "$completedPhase" }, 0] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    completedPhase: 0
                }
            }
        ]);

        // Add isLocked logic
        const updatedPhases = phases.map((phase, index, arr) => {
            let isLocked = true;

            // First phase always unlocked
            if (index === 0) {
                isLocked = false;
            }
            // Unlock if previous phase completed
            else if (arr[index - 1]?.isCompleted) {
                isLocked = false;
            }

            return {
                ...phase,
                isLocked
            };
        });


        const last = updatedPhases[updatedPhases.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { subModule: subModules[0], phases: updatedPhases, nextCursor }, statusCodes.SUCCESS);
    },

    addMcqAnswer: async (data: any, user_id: any): Promise<ApiResponse> => {
        try {
            const { mcq_exercise_id, mcq_id, phase_id } = data;

            // ======================================================
            // CHECK EXERCISE EXISTS
            // ======================================================

            const exercise = await adminMcqexerciseModel.findOne({
                _id: convertToObjectId(mcq_exercise_id), status: USER_STATUS.ACTIVE,
            });

            if (!exercise) {
                return showResponse(false, "MCQ Exercise not found", null, statusCodes.NOT_FOUND);
            }

            // ======================================================
            // CHECK MCQ OPTION EXISTS
            // ======================================================

            const mcqExists = exercise.mcq.find((item: any) => item?._id?.toString() === mcq_id);

            if (!mcqExists) {
                return showResponse(false, "MCQ option not found", null, statusCodes.NOT_FOUND);
            }

            // ======================================================
            // CHECK ALREADY ANSWERED
            // ======================================================

            const alreadyAnswered = await userMcqanswerExerciseModel.findOne({
                user_id: convertToObjectId(user_id),
                mcq_exercise_id: convertToObjectId(mcq_exercise_id),
                status: USER_STATUS.ACTIVE,
            });

            // ======================================================
            // UPDATE EXISTING ANSWER
            // ======================================================

            if (alreadyAnswered) {
                alreadyAnswered.mcq_id = convertToObjectId(mcq_id);
                await alreadyAnswered.save();
                return showResponse(true, "MCQ answer updated successfully", alreadyAnswered, statusCodes.SUCCESS);
            }

            // ======================================================
            // CREATE ANSWER
            // ======================================================

            const createAnswer = await userMcqanswerExerciseModel.create({
                user_id: convertToObjectId(user_id),
                mcq_exercise_id: convertToObjectId(mcq_exercise_id),
                mcq_id: convertToObjectId(mcq_id),
                phase_id: convertToObjectId(phase_id)
            });

            if (!createAnswer) {
                return showResponse(false, responseMessages.common.save_failed, null, statusCodes.API_ERROR);
            }

            return showResponse(true, responseMessages.common.data_save, createAnswer, statusCodes.SUCCESS);

        } catch (error) {
            console.log(error, "ADD_MCQ_ANSWER_ERROR");
            return showResponse(false, responseMessages.common.server_error, null, statusCodes.API_ERROR);
        }
    },

    excerciseMcqList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { phase_id, cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const match: any = {
            status: USER_STATUS.ACTIVE,
            phase_id: convertToObjectId(phase_id)
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

        const mcqList = await adminMcqexerciseModel.aggregate([
            {
                $match: match
            },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`,
                    mcq: { $map: { input: "$mcq", as: "mcq", in: { _id: "$$mcq._id", option: `$$mcq.option.${userLang}` } } }
                }
            },
            {
                $sort: {
                    createdAt: 1,
                    _id: -1
                }
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    mcq: 1
                }
            }
        ]);

        const last = mcqList[mcqList.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { mcqList, nextCursor }, statusCodes.SUCCESS);
    },

    excerciseMcqAnswerList: async (data: any, userId: string): Promise<ApiResponse> => {
        try {
            const { phase_id, cursor, limit = 10 } = data;

            const user = await userAuthModel.findOne({
                _id: convertToObjectId(userId),
                status: USER_STATUS.ACTIVE,
            });

            if (!user) {
                return showResponse(false, responseMessages.common.not_exist, null, statusCodes.NOT_FOUND);
            }
            const userLang = user?.language || "en";

            const match: any = {
                status: USER_STATUS.ACTIVE,
                phase_id: convertToObjectId(phase_id),
            };

            if (cursor) {
                const parsedCursor = JSON.parse(cursor);
                match.$or = [
                    {
                        createdAt: { $lt: new Date(parsedCursor.createdAt) },
                    },
                    {
                        createdAt: new Date(parsedCursor.createdAt),
                        _id: { $lt: convertToObjectId(parsedCursor._id) },
                    },
                ];
            }

            // ======================================================
            // AGGREGATION
            // ======================================================

            const mcqList = await adminMcqexerciseModel.aggregate([

                {
                    $match: match,
                },

                // ======================================================
                // USER ANSWER
                // ======================================================

                {
                    $lookup: {

                        from: "mcqanswerexercises",

                        let: {
                            exerciseId: "$_id",
                        },

                        pipeline: [

                            {
                                $match: {

                                    $expr: {

                                        $and: [

                                            {
                                                $eq: [
                                                    "$mcq_exercise_id",
                                                    "$$exerciseId",
                                                ],
                                            },

                                            {
                                                $eq: [
                                                    "$user_id",
                                                    convertToObjectId(
                                                        userId
                                                    ),
                                                ],
                                            },

                                            {
                                                $eq: [
                                                    "$status",
                                                    USER_STATUS.ACTIVE,
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],

                        as: "answerData",
                    },
                },

                // ======================================================
                // LANGUAGE + ANSWER FORMAT
                // ======================================================

                {
                    $addFields: {

                        title: {
                            $ifNull: [
                                `$title.${userLang}`,
                                "$title.en",
                            ],
                        },

                        description: {
                            $ifNull: [
                                `$description.${userLang}`,
                                "$description.en",
                            ],
                        },

                        mcq: {

                            $map: {

                                input: "$mcq",

                                as: "mcq",

                                in: {

                                    _id:
                                        "$$mcq._id",

                                    option: {
                                        $ifNull: [
                                            `$$mcq.option.${userLang}`,
                                            "$$mcq.option.en",
                                        ],
                                    },

                                    is_selected: {

                                        $cond: [

                                            {
                                                $eq: [

                                                    "$$mcq._id",

                                                    {
                                                        $arrayElemAt: [
                                                            "$answerData.mcq_id",
                                                            0,
                                                        ],
                                                    },
                                                ],
                                            },

                                            true,

                                            false,
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },

                {
                    $sort: {

                        createdAt: 1,
                        _id: -1,
                    },
                },

                {
                    $limit: Number(limit),
                },

                {
                    $project: {

                        title: 1,

                        description: 1,

                        mcq: 1,

                        createdAt: 1,
                    },
                },
            ]);

            const last = mcqList[mcqList.length - 1];

            const nextCursor = last ? JSON.stringify({

                createdAt: last.createdAt,
                _id: last._id,
            }) : null;

            return showResponse(true, getMessage(userLang || "en", "data_fetch_success"), { mcqList, nextCursor }, statusCodes.SUCCESS);

        } catch (error) {

            console.log(error, "MCQ_EXERCISE_LIST_ERROR");

            return showResponse(false, responseMessages.common.server_error, null, statusCodes.API_ERROR);
        }
    },

    exerciseDetailList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { phase_id, cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const phase = await adminPhasesModel.aggregate([
            {
                $match: {
                    _id: convertToObjectId(phase_id),
                    status: USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                }
            },
        ])

        const match: any = {
            status: USER_STATUS.ACTIVE,
            phase_id: convertToObjectId(phase_id)
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

        const lessons = await adminExerciseDetailsModel.aggregate([
            {
                $match: match
            },
            {
                $addFields: {
                    reading_title: `$reading_title.${userLang}`,
                    reading_description: `$reading_description.${userLang}`,
                    concept_title: `$concept_title.${userLang}`,
                    concept_description: `$concept_description.${userLang}`,
                    reflection: `$reflection.${userLang}`,
                }
            },
            {
                $lookup: {
                    from: 'completed_lessons',
                    localField: '_id',
                    foreignField: 'exercise_details_id',
                    as: 'completed_lesson',
                    pipeline: [
                        {
                            $match: {
                                user_id: convertToObjectId(userId)
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    isCompleted: {
                        $cond: {
                            if: { $eq: [{ $size: '$completed_lesson' }, 1] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    completed_lesson: 0
                }
            }
        ])

        const last = lessons[lessons.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { phase: phase[0], lesson: lessons[0], nextCursor }, statusCodes.SUCCESS);
    },

    exerciseList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { exercise_detail_id, cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const exerciseDetail = await adminExerciseDetailsModel.aggregate([
            {
                $match: {
                    _id: convertToObjectId(exercise_detail_id),
                    status: USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    reading_title: `$reading_title.${userLang}`,
                    reading_description: `$reading_description.${userLang}`,
                    concept_title: `$concept_title.${userLang}`,
                    concept_description: `$concept_description.${userLang}`,
                    reflection: `$reflection.${userLang}`,
                }
            }
        ])

        const match: any = {
            exercise_details_id: convertToObjectId(exercise_detail_id),
            status: USER_STATUS.ACTIVE
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

        const exercises = await adminExcerciseModel.aggregate([
            {
                $match: match
            },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`,
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $limit: Number(limit)
            }
        ])

        const last = exercises[exercises.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { exerciseDetail: exerciseDetail[0], exercises, nextCursor }, statusCodes.SUCCESS);
    },

    // completeLesson: async (data: any, userId: string): Promise<ApiResponse> => {
    //     const { exercise_id, exercise_details_id, phase_id, reflection } = data;
    //     const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
    //     const userLang = user?.language || 'en';

    //     const completedLesson = await userModulesCompleteLessonModel.findOne({
    //         user_id: convertToObjectId(userId),
    //         exercise_id: convertToObjectId(exercise_id),
    //         exercise_details_id: convertToObjectId(exercise_details_id),
    //         phase_id: convertToObjectId(phase_id),
    //         status: USER_STATUS.ACTIVE
    //     });

    //     if (completedLesson) {
    //         return showResponse(false, getMessage(userLang || 'en', 'already_completed'), null, statusCodes.API_ERROR);
    //     }

    //     const completedLessonData = await userModulesCompleteLessonModel.create({
    //         user_id: convertToObjectId(userId),
    //         exercise_id: convertToObjectId(exercise_id),
    //         exercise_details_id: convertToObjectId(exercise_details_id),
    //         phase_id: convertToObjectId(phase_id),
    //         reflection: reflection,
    //         status: USER_STATUS.ACTIVE
    //     });

    //     if (!completedLessonData) {
    //         return showResponse(false, getMessage(userLang || 'en', 'error_while_completing_lesson'), null, statusCodes.API_ERROR);
    //     }

    //     const totalLessonInPhase = await adminExerciseDetailsModel.countDocuments({
    //         phase_id: convertToObjectId(phase_id),
    //         status: USER_STATUS.ACTIVE
    //     })

    //     const completedLessonCount = await userModulesCompleteLessonModel.countDocuments({
    //         user_id: convertToObjectId(userId),
    //         phase_id: convertToObjectId(phase_id),
    //         status: USER_STATUS.ACTIVE
    //     });

    //     const submodule = await adminPhasesModel.findOne({
    //         _id: convertToObjectId(phase_id),
    //         status: USER_STATUS.ACTIVE
    //     });

    //     const subModuleId: any = submodule?.subModuleId;
    //     console.log(subModuleId, "subModuleId")

    //     if (totalLessonInPhase === completedLessonCount) {
    //         await userModulesCompletePhaseModel.create({
    //             user_id: convertToObjectId(userId),
    //             phase_id: convertToObjectId(phase_id),
    //             sub_module_id: subModuleId,
    //             status: USER_STATUS.ACTIVE
    //         });
    //     }


    //     const totalPhaseInSubModule = await adminPhasesModel.countDocuments({
    //         subModuleId: convertToObjectId(subModuleId),
    //         status: USER_STATUS.ACTIVE
    //     })

    //     const completedPhaseInSubModule = await userModulesCompletePhaseModel.countDocuments({
    //         user_id: convertToObjectId(userId),
    //         sub_module_id: convertToObjectId(subModuleId),
    //         status: USER_STATUS.ACTIVE
    //     })

    //     if (totalPhaseInSubModule === completedPhaseInSubModule) {
    //         await userModuleStartLessonModel.updateOne({
    //             user_id: convertToObjectId(userId),
    //             sub_module_id: convertToObjectId(subModuleId),
    //         }, {
    //             $set: {
    //                 sub_module_status: "end"
    //             }
    //         });
    //     }

    //     return showResponse(true, getMessage(userLang || 'en', 'lesson_completed_successfully'), null, statusCodes.SUCCESS);
    // },
    completeLesson: async (data: any, userId: string): Promise<ApiResponse> => {
        const { exercise_id, phase_id, reflection } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const completedLesson = await userModulesCompleteLessonModel.findOne({
            user_id: convertToObjectId(userId),
            exercise_id: convertToObjectId(exercise_id),
            phase_id: convertToObjectId(phase_id),
            status: USER_STATUS.ACTIVE
        });

        if (completedLesson) {
            return showResponse(false, getMessage(userLang || 'en', 'already_completed'), null, statusCodes.API_ERROR);
        }

        const completedLessonData = await userModulesCompleteLessonModel.create({
            user_id: convertToObjectId(userId),
            exercise_id: convertToObjectId(exercise_id),
            phase_id: convertToObjectId(phase_id),
            reflection: reflection,
            status: USER_STATUS.ACTIVE
        });

        if (!completedLessonData) {
            return showResponse(false, getMessage(userLang || 'en', 'error_while_completing_lesson'), null, statusCodes.API_ERROR);
        }

        // const totalLessonInPhase = await adminMcqexerciseModel.countDocuments({
        //     phase_id: convertToObjectId(phase_id),
        //     status: USER_STATUS.ACTIVE
        // })
        // console.log(totalLessonInPhase, "totalLessonInPhase")

        // const completedLessonCount = await userModulesCompleteLessonModel.countDocuments({
        //     user_id: convertToObjectId(userId),
        //     phase_id: convertToObjectId(phase_id),
        //     status: USER_STATUS.ACTIVE
        // });
        // console.log(completedLessonCount, "completedLessonCount")

        const submodule = await adminPhasesModel.findOne({
            _id: convertToObjectId(phase_id),
            status: USER_STATUS.ACTIVE
        });
        console.log(submodule, "submodule")

        const subModuleId: any = submodule?.subModuleId;
        console.log(subModuleId, "subModuleId")

        if (completedLessonData) {
            await userModulesCompletePhaseModel.create({
                user_id: convertToObjectId(userId),
                phase_id: convertToObjectId(phase_id),
                sub_module_id: subModuleId,
                status: USER_STATUS.ACTIVE
            });
        }

        const totalPhaseInSubModule = await adminPhasesModel.countDocuments({
            subModuleId: convertToObjectId(subModuleId),
            status: USER_STATUS.ACTIVE
        })
        console.log(totalPhaseInSubModule, "totalPhaseInSubModule")

        const completedPhaseInSubModule = await userModulesCompletePhaseModel.countDocuments({
            user_id: convertToObjectId(userId),
            sub_module_id: convertToObjectId(subModuleId),
            status: USER_STATUS.ACTIVE
        })
        console.log(completedPhaseInSubModule, "completedPhaseInSubModule")

        if (totalPhaseInSubModule === completedPhaseInSubModule) {
            await userModuleStartLessonModel.updateOne({
                user_id: convertToObjectId(userId),
                sub_module_id: convertToObjectId(subModuleId),
            }, {
                $set: {
                    sub_module_status: "end"
                }
            });
        }

        return showResponse(true, getMessage(userLang || 'en', 'lesson_completed_successfully'), { points: 10 }, statusCodes.SUCCESS);
    },

    // startLesson: async (data: any, userId: string): Promise<ApiResponse> => {
    //     const { phase_id } = data;
    //     const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
    //     const userLang = user?.language || 'en';

    //     const submodule = await adminPhasesModel.findOne({
    //         _id: convertToObjectId(phase_id),
    //         status: USER_STATUS.ACTIVE
    //     });

    //     const subModuleId: any = submodule?.subModuleId;

    //     const start_lesson = await userModuleStartLessonModel.findOneAndUpdate({
    //         user_id: convertToObjectId(userId),
    //         sub_module_id: convertToObjectId(subModuleId),
    //     }, {
    //         $set: {
    //             user_id: convertToObjectId(userId),
    //             sub_module_id: convertToObjectId(subModuleId),
    //             status: USER_STATUS.ACTIVE
    //         }
    //     }, {
    //         upsert: true,
    //         new: true
    //     });

    //     if (!start_lesson) {
    //         return showResponse(false, getMessage(userLang || 'en', 'error_while_starting_lesson'), null, statusCodes.API_ERROR);
    //     }

    //     return showResponse(true, getMessage(userLang || 'en', 'lesson_started_successfully'), null, statusCodes.SUCCESS);
    // },
    startLesson: async (data: any, userId: string): Promise<ApiResponse> => {
        const { phase_id } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const submodule = await adminPhasesModel.findOne({
            _id: convertToObjectId(phase_id),
            status: USER_STATUS.ACTIVE
        });

        const subModuleId: any = submodule?.subModuleId;

        const start_lesson = await userModuleStartLessonModel.findOneAndUpdate({
            user_id: convertToObjectId(userId),
            sub_module_id: convertToObjectId(subModuleId),
        }, {
            $set: {
                user_id: convertToObjectId(userId),
                phase_id: convertToObjectId(phase_id),
                sub_module_id: convertToObjectId(subModuleId),
                status: USER_STATUS.ACTIVE
            }
        }, {
            upsert: true,
            new: true
        });

        if (!start_lesson) {
            return showResponse(false, getMessage(userLang || 'en', 'error_while_starting_lesson'), null, statusCodes.API_ERROR);
        }

        return showResponse(true, getMessage(userLang || 'en', 'lesson_started_successfully'), null, statusCodes.SUCCESS);
    },

    startSubModuleList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const match: any = {
            status: USER_STATUS.ACTIVE,
            sub_module_status: "start",
            user_id: convertToObjectId(userId)
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

        const subModules = await userModuleStartLessonModel.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'submodules',
                    localField: 'sub_module_id',
                    foreignField: '_id',
                    as: 'submodule'
                }
            },
            {
                $unwind: '$submodule'
            },
            {
                $lookup: {
                    from: 'phases',
                    localField: 'sub_module_id',
                    foreignField: 'subModuleId',
                    as: 'phase'
                }
            },
            {
                $addFields: {
                    title: `$submodule.title.${userLang}`,
                    description: `$submodule.description.${userLang}`,
                    total_phase_count: { $size: '$phase' }
                }
            },
            {
                $lookup: {
                    from: 'completed_phases',
                    localField: 'sub_module_id',
                    foreignField: 'sub_module_id',
                    as: 'completed_phase',
                    pipeline: [
                        {
                            $match: {
                                user_id: convertToObjectId(userId)
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    completed_phase_count: { $size: '$completed_phase' }
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    total_phase_count: 1,
                    completed_phase_count: 1,
                    createdAt: 1,
                    _id: 1,
                    sub_module_id: 1
                }
            },
            {
                $limit: Number(limit)
            }
        ])

        const last = subModules[subModules.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { subModules, nextCursor }, statusCodes.SUCCESS);
    },

    endSubModuleList: async (data: any, userId: string): Promise<ApiResponse> => {
        const { cursor, limit = 10 } = data;
        const user = await userAuthModel.findOne({ _id: userId, status: USER_STATUS.ACTIVE });
        const userLang = user?.language || 'en';

        const match: any = {
            status: USER_STATUS.ACTIVE,
            sub_module_status: "end",
            user_id: convertToObjectId(userId)
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

        const subModules = await userModuleStartLessonModel.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'submodules',
                    localField: 'sub_module_id',
                    foreignField: '_id',
                    as: 'submodule'
                }
            },
            {
                $unwind: '$submodule'
            },
            {
                $lookup: {
                    from: 'phases',
                    localField: 'sub_module_id',
                    foreignField: 'subModuleId',
                    as: 'phase'
                }
            },
            {
                $addFields: {
                    title: `$submodule.title.${userLang}`,
                    description: `$submodule.description.${userLang}`,
                    total_phase_count: { $size: '$phase' }
                }
            },
            {
                $lookup: {
                    from: 'completed_phases',
                    localField: 'sub_module_id',
                    foreignField: 'sub_module_id',
                    as: 'completed_phase',
                    pipeline: [
                        {
                            $match: {
                                user_id: convertToObjectId(userId)
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    completed_phase_count: { $size: '$completed_phase' }
                }
            },
            {
                $sort: {
                    createdAt: -1,
                    _id: -1
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    total_phase_count: 1,
                    completed_phase_count: 1,
                    createdAt: 1,
                    _id: 1,
                    sub_module_id: 1
                }
            },
            {
                $limit: Number(limit)
            }
        ])

        const last = subModules[subModules.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return showResponse(true, getMessage(userLang || 'en', 'data_fetch_success'), { subModules, nextCursor }, statusCodes.SUCCESS);
    }

}

export default UserCommonHandler 
