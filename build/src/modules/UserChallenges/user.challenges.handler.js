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
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const messages_1 = require("../../helpers/messages");
const openai_helper_1 = require("../../helpers/openai.helper");
const user_challenges_model_1 = __importDefault(require("./user.challenges.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const common_helper_1 = require("../../helpers/common.helper");
const UserChallengesHandler = {
    add: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const user_details = yield user_auth_model_1.default.findOne({ _id: userId });
        console.log(user_details, 'user_details');
        const user_lang = user_details === null || user_details === void 0 ? void 0 : user_details.language;
        const bringsYouHere = user_details === null || user_details === void 0 ? void 0 : user_details.bringsYouHere; //what bring you here i.e 
        const howFellingLately = user_details === null || user_details === void 0 ? void 0 : user_details.howFellingLately; //how are you feeling lately
        const likeToFellMore = user_details === null || user_details === void 0 ? void 0 : user_details.likeToFellMore; //what would you like to feel more
        const startShowingOfYourSelf = user_details === null || user_details === void 0 ? void 0 : user_details.startShowingOfYourSelf; //are you ready to start showing of yourself
        const timeYouCommit = user_details === null || user_details === void 0 ? void 0 : user_details.timeYouCommit; //how much time you commit to yourself
        if (!bringsYouHere || !howFellingLately || !likeToFellMore || !startShowingOfYourSelf || !timeYouCommit) {
            return (0, response_util_1.showResponse)(false, (0, messages_1.getMessage)(user_lang || 'en', 'please_complete_your_onboarding'), { onboarding_completed: false }, statusCodes_1.default.API_ERROR);
        }
        const isChallangesExist = yield user_challenges_model_1.default.countDocuments({ user_id: userId, status: workflow_constant_1.USER_STATUS.ACTIVE });
        if (isChallangesExist <= 0) {
            const challenges = yield (0, openai_helper_1.generateUserChallenges)({ bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf }, userId);
            if (!challenges.success) {
                return (0, response_util_1.showResponse)(false, 'Something went wrong', null, statusCodes_1.default.API_ERROR);
            }
            const res = yield user_challenges_model_1.default.insertMany(challenges.data);
            if (!res) {
                return (0, response_util_1.showResponse)(false, 'err while saving data', null, statusCodes_1.default.API_ERROR);
            }
            const weeklyChallenges = yield user_challenges_model_1.default.aggregate([
                {
                    $match: {
                        user_id: (0, common_helper_1.convertToObjectId)(userId),
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
                        challenge_type: 'weekly'
                    }
                },
                {
                    $project: {
                        title: `$title.${user_lang}`,
                        description: `$description.${user_lang}`,
                        points: 1,
                        concept_title: `$concept_title.${user_lang}`,
                        concept_description: `$concept_description.${user_lang}`,
                        about_challenge: `$about_challenge.${user_lang}`,
                        exercises: {
                            $map: {
                                input: '$exercises',
                                as: 'exercise',
                                in: {
                                    title: `$exercise.title.${user_lang}`,
                                    step_number: '$exercise.step_number'
                                }
                            }
                        },
                        challenge_type: 1,
                    }
                }
            ]);
            const dailyChallenges = yield user_challenges_model_1.default.aggregate([
                {
                    $match: {
                        user_id: (0, common_helper_1.convertToObjectId)(userId),
                        status: workflow_constant_1.USER_STATUS.ACTIVE,
                        challenge_type: 'daily'
                    }
                },
                {
                    $project: {
                        title: `$title.${user_lang}`,
                        description: `$description.${user_lang}`,
                        points: 1,
                        concept_title: `$concept_title.${user_lang}`,
                        concept_description: `$concept_description.${user_lang}`,
                        about_challenge: `$about_challenge.${user_lang}`,
                        exercises: {
                            $map: {
                                input: '$exercises',
                                as: 'exercise',
                                in: {
                                    title: `$$exercise.title.${user_lang}`,
                                    step_number: '$$exercise.step_number'
                                }
                            }
                        },
                        challenge_type: 1,
                    }
                }
            ]);
            return (0, response_util_1.showResponse)(true, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.challenges_fetched_successfully, { weeklyChallenges, dailyChallenges }, statusCodes_1.default.SUCCESS);
        }
        const weeklyChallenges = yield user_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: (0, common_helper_1.convertToObjectId)(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    challenge_type: 'weekly'
                }
            },
            {
                $project: {
                    title: `$title.${user_lang}`,
                    description: `$description.${user_lang}`,
                    points: 1,
                    concept_title: `$concept_title.${user_lang}`,
                    concept_description: `$concept_description.${user_lang}`,
                    about_challenge: `$about_challenge.${user_lang}`,
                    exercises: {
                        $map: {
                            input: '$exercises',
                            as: 'exercise',
                            in: {
                                title: `$$exercise.title.${user_lang}`,
                                step_number: '$$exercise.step_number'
                            }
                        }
                    },
                    challenge_type: 1,
                }
            }
        ]);
        const dailyChallenges = yield user_challenges_model_1.default.aggregate([
            {
                $match: {
                    user_id: (0, common_helper_1.convertToObjectId)(userId),
                    status: workflow_constant_1.USER_STATUS.ACTIVE,
                    challenge_type: 'daily'
                }
            },
            {
                $project: {
                    title: `$title.${user_lang}`,
                    description: `$description.${user_lang}`,
                    points: 1,
                    concept_title: `$concept_title.${user_lang}`,
                    concept_description: `$concept_description.${user_lang}`,
                    about_challenge: `$about_challenge.${user_lang}`,
                    exercises: {
                        $map: {
                            input: '$exercises',
                            as: 'exercise',
                            in: {
                                title: `$$exercise.title.${user_lang}`,
                                step_number: '$$exercise.step_number'
                            }
                        }
                    },
                    challenge_type: 1
                }
            }
        ]);
        return (0, response_util_1.showResponse)(true, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _b === void 0 ? void 0 : _b.challenges_generated_successfully, { weeklyChallenges, dailyChallenges }, statusCodes_1.default.SUCCESS);
    }),
};
exports.default = UserChallengesHandler;
