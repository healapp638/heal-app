import { Worker, Queue } from "bullmq";
import { challengsFn } from "./common.helper";
import { generateUserChallengesDaily, generateUserChallengesWeekly } from "./openai.helper";
import userDailyChallengesModel from "../modules/UserChallenges/user.daily.challenges.model";
import userAuthModel from "../modules/UserAuth/user.auth.model";
import userWeeklyChallengesModel from "../modules/UserChallenges/user.weekly.challenges.model";
import { connection as connectDB } from "../configs/mongoose.config";
import { translateText } from "./langauge.translate.helper";
import { languages } from "../constants/workflow.constant";
import { REDIS_CREDENTIAL } from "../constants/app.constant";
import logger from "../configs/logger.config";
import moment from "moment-timezone";

export const ChallengesQueue = new Queue('challenges', {
    connection: {
        port: REDIS_CREDENTIAL.PORT || 6379,
        host: REDIS_CREDENTIAL.REDIS_HOST || 'redis',
        maxRetriesPerRequest: null,
    }
})

export const challengesWorker = new Worker("challenges", async (job: any) => {
    try {
        await connectDB()
        const { userData } = job.data;
        console.log(userData, 'userData')
        const challengesDetails = await challengsFn(userData);
        const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
        const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
        const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
        const payload: any = challengesDetails?.payload;
        if (isOnBoardingComplete && !isDailyChallengeExist) {
            await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { isDailyChallengeInProgress: true } })
            const res = await generateUserChallengesDaily(payload, userData?._id);
            const languagess = Object.values(languages);
            console.log(userData?.timeZone,"userData?.timeZone")
            const end_date_unix = moment().tz(userData?.timeZone||"Europe/Zurich").endOf("day").unix();
            console.log("end_date_unix", end_date_unix)
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
                        end_date_unix
                    };
                })
            );
            const result = await userDailyChallengesModel.insertMany(
                formattedChallenges
            );
            if (result) {
                await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date(), isDailyChallengeInProgress: false } })
            }

        }
        if (isOnBoardingComplete && !isWeeklyChallengeExist) {
            await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { isWeeklyChallengeInProgress: true } })
            const res = await generateUserChallengesWeekly(payload, userData?._id)
            const languagess = Object.values(languages);
            const end_date_unixx = moment().tz(userData?.timeZone||"Europe/Zurich").endOf("week").unix();
            console.log("end_date_unixx",end_date_unixx)
            console.log("end_date_unix", end_date_unixx,userData?.timeZone);
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
                        end_date_unix:end_date_unixx
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
    } catch (error: any) {
        logger.error("BULLMQ_CHALLENGE_WORKER_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        throw error;
    }
}, {
    connection: {
        port: REDIS_CREDENTIAL.PORT,
        host: REDIS_CREDENTIAL.REDIS_HOST,
        maxRetriesPerRequest: null,
    }
});


