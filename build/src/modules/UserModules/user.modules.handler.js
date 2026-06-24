"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const admin_theme_model_1 = __importDefault(require("../AdminTheme/admin.theme.model"));
const common_helper_1 = require("../../helpers/common.helper");
const admin_modules_model_1 = __importDefault(require("../AdminModules/admin.modules.model"));
const messages_1 = require("../../helpers/messages");
const admin_submodules_model_1 = __importDefault(require("../AdminSubModules/admin.submodules.model"));
const admin_phases_model_1 = __importDefault(require("../AdminPhases/admin.phases.model"));
const admin_exercise_details__model_1 = __importDefault(require("../AdminExercise/admin.exercise.details..model"));
const admin_excercise_model_1 = __importDefault(require("../AdminExercise/admin.excercise.model"));
const user_modules_complete_lesson_model_1 = __importDefault(require("./user.modules.complete.lesson.model"));
const user_modules_complete_phase_model_1 = __importDefault(require("./user.modules.complete.phase.model"));
const user_module_start_lesson_model_1 = __importDefault(require("./user.module.start.lesson.model"));
const admin_mcqexercise_model_1 = __importDefault(require("../AdminExercise/admin.mcqexercise.model"));
const user_mcqanswer_exercise_model_1 = __importDefault(require("./user.mcqanswer.exercise.model"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const user_themeEngagement_model_1 = __importDefault(require("./user.themeEngagement.model"));
const UserCommonHandler = {
    themeList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = user === null || user === void 0 ? void 0 : user.language;
        console.log(userLang, "userLang");
        const match = {
            status: workflow_constant_1.USER_STATUS.ACTIVE
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const themeList = yield admin_theme_model_1.default.aggregate([
            { $match: match },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
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
            }
        ]);
        const last = themeList[themeList.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        console.log(themeList, "themeList");
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { data: themeList, nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    moduleList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { theme_id, cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = user === null || user === void 0 ? void 0 : user.language;
        const theme = yield admin_theme_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(theme_id), status: workflow_constant_1.USER_STATUS.ACTIVE } },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            }
        ]);
        if (theme.length === 0) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(userLang || 'en', 'theme_not_found'), null, statusCodes_1.default.NOT_FOUND);
        }
        //calculate user enagement of each theme
        // await userThemeEngagementModel.create({ theme_id: convertToObjectId(theme_id), user_id: userId, theme_name: theme[0].title });
        const match = {
            themeId: (0, common_helper_1.convertToObjectId)(theme_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const moduleList = yield admin_modules_model_1.default.aggregate([
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
                                status: workflow_constant_1.USER_STATUS.ACTIVE
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
                                createdAt: 1,
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
                                            status: workflow_constant_1.USER_STATUS.ACTIVE
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
                                            _id: 1
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
                                            user_id: (0, common_helper_1.convertToObjectId)(userId)
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
                    createdAt: 1,
                    _id: -1
                }
            },
            {
                $limit: Number(limit)
            }
        ]);
        const last = moduleList[moduleList.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { moduleList, theme: theme[0], nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    phaseList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub_module_id, cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const subModules = yield admin_submodules_model_1.default.aggregate([
            {
                $match: {
                    _id: (0, common_helper_1.convertToObjectId)(sub_module_id),
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                    description: `$description.${userLang}`
                }
            }
        ]);
        const match = {
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            subModuleId: (0, common_helper_1.convertToObjectId)(sub_module_id)
        };
        if (cursor) {
            // const parsedCursor = JSON.parse(cursor);
            // match.$or = [
            //     { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
            //     {
            //         createdAt: new Date(parsedCursor.createdAt),
            //         _id: { $lt: convertToObjectId(parsedCursor._id) }
            //     }
            // ]
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { subModule: subModules[0], phases: [], nextCursor: "" }, statusCodes_1.default.SUCCESS);
        }
        const phases = yield admin_phases_model_1.default.aggregate([
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
                                status: workflow_constant_1.USER_STATUS.ACTIVE,
                                user_id: (0, common_helper_1.convertToObjectId)(userId)
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
                    createdAt: 1,
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
            var _a;
            let isLocked = true;
            // First phase always unlocked
            if (index === 0) {
                isLocked = false;
            }
            // Unlock if previous phase completed
            else if ((_a = arr[index - 1]) === null || _a === void 0 ? void 0 : _a.isCompleted) {
                isLocked = false;
            }
            return Object.assign(Object.assign({}, phase), { isLocked });
        });
        const last = updatedPhases[updatedPhases.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { subModule: subModules[0], phases: updatedPhases, nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    addMcqAnswer: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { mcq_exercise_id, mcq_id, phase_id } = data;
            // ======================================================
            // CHECK EXERCISE EXISTS
            // ======================================================
            const exercise = yield admin_mcqexercise_model_1.default.findOne({
                _id: (0, common_helper_1.convertToObjectId)(mcq_exercise_id), status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            if (!exercise) {
                return (0, response_util_1.showResponse)(false, "MCQ Exercise not found", null, statusCodes_1.default.NOT_FOUND);
            }
            // ======================================================
            // CHECK MCQ OPTION EXISTS
            // ======================================================
            const mcqExists = exercise.mcq.find((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString()) === mcq_id; });
            if (!mcqExists) {
                return (0, response_util_1.showResponse)(false, "MCQ option not found", null, statusCodes_1.default.NOT_FOUND);
            }
            // ======================================================
            // CHECK ALREADY ANSWERED
            // ======================================================
            const alreadyAnswered = yield user_mcqanswer_exercise_model_1.default.findOne({
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                mcq_exercise_id: (0, common_helper_1.convertToObjectId)(mcq_exercise_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            // ======================================================
            // UPDATE EXISTING ANSWER
            // ======================================================
            if (alreadyAnswered) {
                alreadyAnswered.mcq_id = (0, common_helper_1.convertToObjectId)(mcq_id);
                yield alreadyAnswered.save();
                return (0, response_util_1.showResponse)(true, "MCQ answer updated successfully", alreadyAnswered, statusCodes_1.default.SUCCESS);
            }
            // ======================================================
            // CREATE ANSWER
            // ======================================================
            const createAnswer = yield user_mcqanswer_exercise_model_1.default.create({
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                mcq_exercise_id: (0, common_helper_1.convertToObjectId)(mcq_exercise_id),
                mcq_id: (0, common_helper_1.convertToObjectId)(mcq_id),
                phase_id: (0, common_helper_1.convertToObjectId)(phase_id)
            });
            if (!createAnswer) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, createAnswer, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "ADD_MCQ_ANSWER_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    excerciseMcqList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { phase_id, cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const match = {
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            phase_id: (0, common_helper_1.convertToObjectId)(phase_id)
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const mcqList = yield admin_mcqexercise_model_1.default.aggregate([
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
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { mcqList, nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    excerciseMcqAnswerList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { phase_id, cursor, limit = 10 } = data;
            const user = yield user_auth_model_1.default.findOne({
                _id: (0, common_helper_1.convertToObjectId)(userId),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            if (!user) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.NOT_FOUND);
            }
            const userLang = (user === null || user === void 0 ? void 0 : user.language) || "en";
            const match = {
                status: workflow_constant_1.USER_STATUS.ACTIVE,
                phase_id: (0, common_helper_1.convertToObjectId)(phase_id),
            };
            if (cursor) {
                const parsedCursor = JSON.parse(cursor);
                match.$or = [
                    {
                        createdAt: { $lt: new Date(parsedCursor.createdAt) },
                    },
                    {
                        createdAt: new Date(parsedCursor.createdAt),
                        _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) },
                    },
                ];
            }
            // ======================================================
            // AGGREGATION
            // ======================================================
            const mcqList = yield admin_mcqexercise_model_1.default.aggregate([
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
                                                    (0, common_helper_1.convertToObjectId)(userId),
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$status",
                                                    workflow_constant_1.USER_STATUS.ACTIVE,
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
                                    _id: "$$mcq._id",
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
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || "en", "data_fetch_success"), { mcqList, nextCursor }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "MCQ_EXERCISE_LIST_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    exerciseDetailList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { phase_id, cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const phase = yield admin_phases_model_1.default.aggregate([
            {
                $match: {
                    _id: (0, common_helper_1.convertToObjectId)(phase_id),
                    status: workflow_constant_1.USER_STATUS.ACTIVE
                }
            },
            {
                $addFields: {
                    title: `$title.${userLang}`,
                }
            },
        ]);
        const match = {
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            phase_id: (0, common_helper_1.convertToObjectId)(phase_id)
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const lessons = yield admin_exercise_details__model_1.default.aggregate([
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
                                user_id: (0, common_helper_1.convertToObjectId)(userId)
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
        ]);
        const last = lessons[lessons.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { phase: phase[0], lesson: lessons[0], nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    exerciseList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { exercise_detail_id, cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const exerciseDetail = yield admin_exercise_details__model_1.default.aggregate([
            {
                $match: {
                    _id: (0, common_helper_1.convertToObjectId)(exercise_detail_id),
                    status: workflow_constant_1.USER_STATUS.ACTIVE
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
        ]);
        const match = {
            exercise_details_id: (0, common_helper_1.convertToObjectId)(exercise_detail_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const exercises = yield admin_excercise_model_1.default.aggregate([
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
        ]);
        const last = exercises[exercises.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { exerciseDetail: exerciseDetail[0], exercises, nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    completeLesson: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { exercise_id, phase_id, reflection } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const completedLesson = yield user_modules_complete_lesson_model_1.default.findOne({
            user_id: (0, common_helper_1.convertToObjectId)(userId),
            exercise_id: (0, common_helper_1.convertToObjectId)(exercise_id),
            phase_id: (0, common_helper_1.convertToObjectId)(phase_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        if (completedLesson) {
            return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'already_completed'), null, statusCodes_1.default.SUCCESS);
        }
        const completedLessonData = yield user_modules_complete_lesson_model_1.default.create({
            user_id: (0, common_helper_1.convertToObjectId)(userId),
            exercise_id: (0, common_helper_1.convertToObjectId)(exercise_id),
            phase_id: (0, common_helper_1.convertToObjectId)(phase_id),
            reflection: reflection,
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        if (!completedLessonData) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(userLang || 'en', 'error_while_completing_lesson'), null, statusCodes_1.default.API_ERROR);
        }
        const submodule = yield admin_phases_model_1.default.findOne({
            _id: (0, common_helper_1.convertToObjectId)(phase_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        console.log(submodule, "submodule");
        const subModuleId = submodule === null || submodule === void 0 ? void 0 : submodule.subModuleId;
        console.log(subModuleId, "subModuleId");
        if (completedLessonData) {
            yield user_modules_complete_phase_model_1.default.create({
                user_id: (0, common_helper_1.convertToObjectId)(userId),
                phase_id: (0, common_helper_1.convertToObjectId)(phase_id),
                sub_module_id: subModuleId,
                status: workflow_constant_1.USER_STATUS.ACTIVE
            });
        }
        const totalPhaseInSubModule = yield admin_phases_model_1.default.countDocuments({
            subModuleId: (0, common_helper_1.convertToObjectId)(subModuleId),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        console.log(totalPhaseInSubModule, "totalPhaseInSubModule");
        const completedPhaseInSubModule = yield user_modules_complete_phase_model_1.default.countDocuments({
            user_id: (0, common_helper_1.convertToObjectId)(userId),
            sub_module_id: (0, common_helper_1.convertToObjectId)(subModuleId),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        console.log(completedPhaseInSubModule, "completedPhaseInSubModule");
        if (totalPhaseInSubModule === completedPhaseInSubModule) {
            yield user_module_start_lesson_model_1.default.updateOne({
                user_id: (0, common_helper_1.convertToObjectId)(userId),
                sub_module_id: (0, common_helper_1.convertToObjectId)(subModuleId),
            }, {
                $set: {
                    sub_module_status: "end"
                }
            });
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'lesson_completed_successfully'), { points: 10 }, statusCodes_1.default.SUCCESS);
    }),
    startLesson: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { phase_id } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const submodule = yield admin_phases_model_1.default.findOne({
            _id: (0, common_helper_1.convertToObjectId)(phase_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        const subModuleId = submodule === null || submodule === void 0 ? void 0 : submodule.subModuleId;
        const start_lesson = yield user_module_start_lesson_model_1.default.findOneAndUpdate({
            user_id: (0, common_helper_1.convertToObjectId)(userId),
            sub_module_id: (0, common_helper_1.convertToObjectId)(subModuleId),
        }, {
            $set: {
                user_id: (0, common_helper_1.convertToObjectId)(userId),
                phase_id: (0, common_helper_1.convertToObjectId)(phase_id),
                sub_module_id: (0, common_helper_1.convertToObjectId)(subModuleId),
                status: workflow_constant_1.USER_STATUS.ACTIVE
            }
        }, {
            upsert: true,
            new: true
        });
        if (!start_lesson) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(userLang || 'en', 'error_while_starting_lesson'), null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'lesson_started_successfully'), null, statusCodes_1.default.SUCCESS);
    }),
    startSubModuleList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const match = {
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            sub_module_status: "start",
            user_id: (0, common_helper_1.convertToObjectId)(userId)
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const subModules = yield user_module_start_lesson_model_1.default.aggregate([
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
                                user_id: (0, common_helper_1.convertToObjectId)(userId)
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
        ]);
        const last = subModules[subModules.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { subModules, nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    endSubModuleList: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { cursor, limit = 10 } = data;
        const user = yield user_auth_model_1.default.findOne({ _id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        const userLang = (user === null || user === void 0 ? void 0 : user.language) || 'en';
        const match = {
            status: workflow_constant_1.USER_STATUS.ACTIVE,
            sub_module_status: "end",
            user_id: (0, common_helper_1.convertToObjectId)(userId)
        };
        if (cursor) {
            const parsedCursor = JSON.parse(cursor);
            match.$or = [
                { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
                {
                    createdAt: new Date(parsedCursor.createdAt),
                    _id: { $lt: (0, common_helper_1.convertToObjectId)(parsedCursor._id) }
                }
            ];
        }
        const subModules = yield user_module_start_lesson_model_1.default.aggregate([
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
                                user_id: (0, common_helper_1.convertToObjectId)(userId)
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
        ]);
        const last = subModules[subModules.length - 1];
        const nextCursor = last ? JSON.stringify({ createdAt: last.createdAt, _id: last._id }) : null;
        return (0, response_util_1.showResponse)(true, (0, messages_1.getMessage)(userLang || 'en', 'data_fetch_success'), { subModules, nextCursor }, statusCodes_1.default.SUCCESS);
    }),
    themeEngagementCreate: (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { theme_id } = data;
        const theme = yield admin_theme_model_1.default.aggregate([
            { $match: { _id: (0, common_helper_1.convertToObjectId)(theme_id), status: workflow_constant_1.USER_STATUS.ACTIVE } },
            {
                $addFields: {
                    title: `$title.en`,
                    description: `$description.en`
                }
            }
        ]);
        if (theme.length === 0) {
            return (0, response_util_1.showResponse)(false, 'Theme not found', null, statusCodes_1.default.NOT_FOUND);
        }
        //calculate user enagement of each theme
        yield user_themeEngagement_model_1.default.create({ theme_id: (0, common_helper_1.convertToObjectId)(theme_id), user_id: userId, theme_name: theme[0].title });
        return (0, response_util_1.showResponse)(true, 'Theme engagement created successfully', null, statusCodes_1.default.SUCCESS);
    })
};
exports.default = UserCommonHandler;
