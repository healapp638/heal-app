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
exports.challengesWorker = exports.ChallengesQueue = void 0;
const bullmq_1 = require("bullmq");
const common_helper_1 = require("./common.helper");
const openai_helper_1 = require("./openai.helper");
const user_daily_challenges_model_1 = __importDefault(require("../modules/UserChallenges/user.daily.challenges.model"));
const user_auth_model_1 = __importDefault(require("../modules/UserAuth/user.auth.model"));
const user_weekly_challenges_model_1 = __importDefault(require("../modules/UserChallenges/user.weekly.challenges.model"));
exports.ChallengesQueue = new bullmq_1.Queue('challenges', {
    connection: {
        port: 6379,
        host: '127.0.0.1',
        maxRetriesPerRequest: null,
    }
});
exports.challengesWorker = new bullmq_1.Worker("challenges", (job) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("BullMQ Worker Started...");
        const { userData } = job.data;
        const challengesDetails = yield (0, common_helper_1.challengsFn)(userData);
        const isOnBoardingComplete = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isOnBoardingComplete;
        const isWeeklyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isWeeklyChallengeExist;
        const isDailyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isDailyChallengeExist;
        const payload = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.payload;
        if (isOnBoardingComplete && !isDailyChallengeExist) {
            const res = yield (0, openai_helper_1.generateUserChallengesDaily)(payload, userData === null || userData === void 0 ? void 0 : userData._id);
            const result = yield user_daily_challenges_model_1.default.insertMany(res.data);
            if (result) {
                yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { lastDailyChallengeGeneratedDate: new Date() } });
            }
        }
        if (isOnBoardingComplete && !isWeeklyChallengeExist) {
            const res = yield (0, openai_helper_1.generateUserChallengesWeekly)(payload, userData === null || userData === void 0 ? void 0 : userData._id);
            const result = yield user_weekly_challenges_model_1.default.insertMany(res.data);
            if (result) {
                yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date() } });
            }
        }
    }
    catch (error) {
        console.log(error, "error");
    }
}), {
    connection: {
        port: 6379,
        host: '127.0.0.1',
        maxRetriesPerRequest: null,
    }
});
console.log("BullMQ Worker Started...");
