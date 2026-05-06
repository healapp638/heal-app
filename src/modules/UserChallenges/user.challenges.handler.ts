import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import userAuthModel from "../UserAuth/user.auth.model";
import { getMessage } from "../../helpers/messages";
import { generateUserChallenges } from "../../helpers/openai.helper";
import userChallengesModel from "./user.challenges.model";
import { USER_STATUS } from "../../constants/workflow.constant";
import { convertToObjectId } from "../../helpers/common.helper";

const UserChallengesHandler = {

    add: async (userId: string): Promise<ApiResponse> => {
        const user_details = await userAuthModel.findOne({ _id: userId });
        console.log(user_details, 'user_details')

        const user_lang = user_details?.language;
        const bringsYouHere = user_details?.bringsYouHere;//what bring you here i.e 
        const howFellingLately = user_details?.howFellingLately;//how are you feeling lately
        const likeToFellMore = user_details?.likeToFellMore;//what would you like to feel more
        const startShowingOfYourSelf = user_details?.startShowingOfYourSelf;//are you ready to start showing of yourself
        const timeYouCommit = user_details?.timeYouCommit;//how much time you commit to yourself

        if (!bringsYouHere || !howFellingLately || !likeToFellMore || !startShowingOfYourSelf || !timeYouCommit) {
            return showResponse(false, getMessage(user_lang || 'en', 'please_complete_your_onboarding'), { onboarding_completed: false }, statusCodes.API_ERROR)
        }

        const isChallangesExist = await userChallengesModel.countDocuments({ user_id: userId, status: USER_STATUS.ACTIVE })
        if (isChallangesExist <= 0) {
            const challenges = await generateUserChallenges({ bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf }, userId)
            if (!challenges.success) {
                return showResponse(false, 'Something went wrong', null, statusCodes.API_ERROR)
            }
            const res = await userChallengesModel.insertMany(challenges.data)
            if (!res) {
                return showResponse(false, 'err while saving data', null, statusCodes.API_ERROR)
            }
            const weeklyChallenges =await userChallengesModel.aggregate([
                {
                    $match: {
                        user_id: convertToObjectId(userId),
                        status: USER_STATUS.ACTIVE,
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

            const dailyChallenges = await userChallengesModel.aggregate([
                {
                    $match: {
                        user_id: convertToObjectId(userId),
                        status: USER_STATUS.ACTIVE,
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

            return showResponse(true, responseMessage?.common?.challenges_fetched_successfully, { weeklyChallenges, dailyChallenges }, statusCodes.SUCCESS)
        }



        const weeklyChallenges =await userChallengesModel.aggregate([
            {
                $match: {
                    user_id: convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE,
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

        const dailyChallenges =await userChallengesModel.aggregate([
            {
                $match: {
                    user_id: convertToObjectId(userId),
                    status: USER_STATUS.ACTIVE,
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

        return showResponse(true, responseMessage?.common?.challenges_generated_successfully, { weeklyChallenges, dailyChallenges }, statusCodes.SUCCESS)
    },

}

export default UserChallengesHandler 
