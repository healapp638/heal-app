import { Worker, Queue } from "bullmq";
import { challengsFn } from "./common.helper";
import { generateUserChallengesDaily, generateUserChallengesWeekly } from "./openai.helper";
import userDailyChallengesModel from "../modules/UserChallenges/user.daily.challenges.model";
import userAuthModel from "../modules/UserAuth/user.auth.model";
import userWeeklyChallengesModel from "../modules/UserChallenges/user.weekly.challenges.model";
import { connection as connectDB } from "../configs/mongoose.config";
import { translateText } from "./langauge.translate.helper";
import { languages } from "../constants/workflow.constant";

export const ChallengesQueue = new Queue('challenges', {
    connection: {
        port: 6379,
        host: '127.0.0.1',
        maxRetriesPerRequest: null,
    }
})

export const challengesWorker = new Worker("challenges", async (job: any) => {
    try {
        await connectDB()
        console.log("BullMQ Worker Started...")
        const { userData } = job.data;
        const challengesDetails = await challengsFn(userData);
        const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
        const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
        const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
        const payload: any = challengesDetails?.payload;
        if (isOnBoardingComplete && !isDailyChallengeExist) {
            await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { isDailyChallengeInProgress: true } })
            const res = await generateUserChallengesDaily(payload, userData?._id);
            const languagess = Object.values(languages);
            const formattedChallenges = await Promise.all(
                res?.data?.map(async (challenge: any) => {
                    const titleObj: any = {};
                    await Promise.all(
                        languagess.map(async (lang) => {
                            titleObj[lang] = await translateText(
                                challenge.title,
                                lang
                            );
                        })
                    );

                    const exercises = await Promise.all(
                        challenge.exercises.map(async (exercise: any) => {
                            const exerciseTitleObj: any = {};
                            await Promise.all(
                                languagess.map(async (lang) => {
                                    exerciseTitleObj[lang] = await translateText(
                                        exercise.title,
                                        lang
                                    );
                                })
                            );
                            return {
                                title: exerciseTitleObj,
                                step_number: exercise.step_number,
                            };
                        })
                    );

                    return {
                        user_id: challenge.user_id,
                        challenge_type: challenge.challenge_type,
                        points: challenge.points,
                        title: titleObj,
                        exercises,
                    };
                })
            );
            const result = await userDailyChallengesModel.insertMany(
                formattedChallenges
            );
            console.log(result, 'result')
            if (result) {
                await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date(), isDailyChallengeInProgress: false } })
            }

        }
        if (isOnBoardingComplete && !isWeeklyChallengeExist) {
            await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { isWeeklyChallengeInProgress: true } })
            const res = await generateUserChallengesWeekly(payload, userData?._id)
            const languagess = Object.values(languages);
            const formattedChallenges = await Promise.all(
                res?.data?.map(async (challenge: any) => {
                    const titleObj: any = {};
                    await Promise.all(
                        languagess.map(async (lang) => {
                            titleObj[lang] = await translateText(
                                challenge.title,
                                lang
                            );
                        })
                    );
                    // multilingual exercises
                    const exercises = await Promise.all(
                        challenge.exercises.map(async (exercise: any) => {
                            const exerciseTitleObj: any = {};
                            await Promise.all(
                                languagess.map(async (lang) => {
                                    exerciseTitleObj[lang] = await translateText(
                                        exercise.title,
                                        lang
                                    );
                                })
                            );
                            return {
                                title: exerciseTitleObj,
                                step_number: exercise.step_number,
                            };
                        })
                    );
                    return {
                        user_id: challenge.user_id,
                        challenge_type: challenge.challenge_type,
                        points: challenge.points,
                        title: titleObj,
                        exercises,
                    };
                })
            );
            const result = await userWeeklyChallengesModel.insertMany(
                formattedChallenges
            );
            if (result) {
                await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date(), isWeeklyChallengeInProgress: false } })
            }
        }
    } catch (error) {
        console.log(error, "error")
    }
}, {
    connection: {
        port: 6379,
        host: '127.0.0.1',
        maxRetriesPerRequest: null,
    }
});
console.log("BullMQ Worker Started...");

