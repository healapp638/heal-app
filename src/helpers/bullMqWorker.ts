import { Worker, Queue } from "bullmq";
import { challengsFn } from "./common.helper";
import { generateUserChallengesDaily, generateUserChallengesWeekly } from "./openai.helper";
import userDailyChallengesModel from "../modules/UserChallenges/user.daily.challenges.model";
import userAuthModel from "../modules/UserAuth/user.auth.model";
import userWeeklyChallengesModel from "../modules/UserChallenges/user.weekly.challenges.model";
import { connection as connectDB } from "../configs/mongoose.config";

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
            const res = await generateUserChallengesDaily(payload, userData?._id);
            const result = await userDailyChallengesModel.insertMany(res.data)
            if (result) {
                await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date() } })
            }

        }
        if (isOnBoardingComplete && !isWeeklyChallengeExist) {
            const res = await generateUserChallengesWeekly(payload, userData?._id)
            const result = await userWeeklyChallengesModel.insertMany(res.data)
            if (result) {
                await userAuthModel.findOneAndUpdate({ _id: userData?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date() } })
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

