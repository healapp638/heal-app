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
const mongoose_config_1 = require("../configs/mongoose.config");
const langauge_translate_helper_1 = require("./langauge.translate.helper");
const workflow_constant_1 = require("../constants/workflow.constant");
const app_constant_1 = require("../constants/app.constant");
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.ChallengesQueue = new bullmq_1.Queue('challenges', {
    connection: {
        port: app_constant_1.REDIS_CREDENTIAL.PORT || 6379,
        host: app_constant_1.REDIS_CREDENTIAL.REDIS_HOST || 'redis',
        maxRetriesPerRequest: null,
    }
});
exports.challengesWorker = new bullmq_1.Worker("challenges", (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        yield (0, mongoose_config_1.connection)();
        const { userData } = job.data;
        const challengesDetails = yield (0, common_helper_1.challengsFn)(userData);
        const isOnBoardingComplete = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isOnBoardingComplete;
        const isWeeklyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isWeeklyChallengeExist;
        const isDailyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isDailyChallengeExist;
        const payload = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.payload;
        if (isOnBoardingComplete && !isDailyChallengeExist) {
            yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { isDailyChallengeInProgress: true } });
            const res = yield (0, openai_helper_1.generateUserChallengesDaily)(payload, userData === null || userData === void 0 ? void 0 : userData._id);
            const languagess = Object.values(workflow_constant_1.languages);
            const end_date_unix = (0, moment_timezone_1.default)().tz((_a = userData === null || userData === void 0 ? void 0 : userData.data) === null || _a === void 0 ? void 0 : _a.timeZone).endOf("day").unix();
            const formattedChallenges = yield Promise.all((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.map((challenge) => __awaiter(void 0, void 0, void 0, function* () {
                const titleObj = {};
                yield Promise.all(languagess.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                    titleObj[lang] = yield (0, langauge_translate_helper_1.translateText)(challenge.title, lang);
                })));
                const exercises = yield Promise.all(challenge.exercises.map((exercise) => __awaiter(void 0, void 0, void 0, function* () {
                    const exerciseTitleObj = {};
                    yield Promise.all(languagess.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                        exerciseTitleObj[lang] = yield (0, langauge_translate_helper_1.translateText)(exercise.title, lang);
                    })));
                    return {
                        title: exerciseTitleObj,
                        step_number: exercise.step_number,
                    };
                })));
                return {
                    user_id: challenge.user_id,
                    challenge_type: challenge.challenge_type,
                    points: challenge.points,
                    title: titleObj,
                    exercises,
                    end_date_unix
                };
            })));
            const result = yield user_daily_challenges_model_1.default.insertMany(formattedChallenges);
            if (result) {
                yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { lastDailyChallengeGeneratedDate: new Date(), isDailyChallengeInProgress: false } });
            }
        }
        if (isOnBoardingComplete && !isWeeklyChallengeExist) {
            yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { isWeeklyChallengeInProgress: true } });
            const res = yield (0, openai_helper_1.generateUserChallengesWeekly)(payload, userData === null || userData === void 0 ? void 0 : userData._id);
            const languagess = Object.values(workflow_constant_1.languages);
            const end_date_unix = (0, moment_timezone_1.default)().tz((_c = userData === null || userData === void 0 ? void 0 : userData.data) === null || _c === void 0 ? void 0 : _c.timeZone).endOf("week").unix();
            const formattedChallenges = yield Promise.all((_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.map((challenge) => __awaiter(void 0, void 0, void 0, function* () {
                const titleObj = {};
                yield Promise.all(languagess.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                    titleObj[lang] = yield (0, langauge_translate_helper_1.translateText)(challenge.title, lang);
                })));
                // multilingual exercises
                const exercises = yield Promise.all(challenge.exercises.map((exercise) => __awaiter(void 0, void 0, void 0, function* () {
                    const exerciseTitleObj = {};
                    yield Promise.all(languagess.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                        exerciseTitleObj[lang] = yield (0, langauge_translate_helper_1.translateText)(exercise.title, lang);
                    })));
                    return {
                        title: exerciseTitleObj,
                        step_number: exercise.step_number,
                    };
                })));
                return {
                    user_id: challenge.user_id,
                    challenge_type: challenge.challenge_type,
                    points: challenge.points,
                    title: titleObj,
                    exercises,
                    end_date_unix
                };
            })));
            const result = yield user_weekly_challenges_model_1.default.insertMany(formattedChallenges);
            if (result) {
                yield user_auth_model_1.default.findOneAndUpdate({ _id: userData === null || userData === void 0 ? void 0 : userData._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date(), isWeeklyChallengeInProgress: false } });
            }
        }
    }
    catch (error) {
        logger_config_1.default.error("BULLMQ_CHALLENGE_WORKER_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        throw error;
    }
}), {
    connection: {
        port: app_constant_1.REDIS_CREDENTIAL.PORT,
        host: app_constant_1.REDIS_CREDENTIAL.REDIS_HOST,
        maxRetriesPerRequest: null,
    }
});
