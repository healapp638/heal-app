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
exports.generateAffirmation = exports.scheduleCroneJOb = void 0;
const response_util_1 = require("../utils/response.util");
const responseMessages_1 = __importDefault(require("../constants/responseMessages"));
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const workflow_constant_1 = require("../constants/workflow.constant");
const langauge_translate_helper_1 = require("../helpers/langauge.translate.helper");
const user_affirmation_model_1 = __importDefault(require("../modules/UserAffirmation/user.affirmation.model"));
const openai_1 = __importDefault(require("openai"));
const app_constant_1 = require("../constants/app.constant");
const user_auth_model_1 = __importDefault(require("../modules/UserAuth/user.auth.model"));
const user_daily_challenges_model_1 = __importDefault(require("../modules/UserChallenges/user.daily.challenges.model"));
// import moment from "moment";
const common_helper_1 = require("./common.helper");
const openai_helper_1 = require("./openai.helper");
const user_weekly_challenges_model_1 = __importDefault(require("../modules/UserChallenges/user.weekly.challenges.model"));
const node_cron_1 = __importDefault(require("node-cron"));
const mongoose_config_1 = require("../configs/mongoose.config");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getOpenAI = () => new openai_1.default({
    apiKey: app_constant_1.APP.OPENAI_API_KEY,
});
const generateAffirmation = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let generatedQuote = "";
        let isDuplicate = true;
        let retryCount = 0;
        const maxRetry = 10;
        const categories = [
            "confidence",
            "self-love",
            "healing",
            "success",
            "peace",
            "gratitude",
            "growth",
            "happiness",
            "strength",
            "focus",
            "abundance",
            "calmness",
            "courage",
            "joy",
            "energy",
            "creativity",
            "mindfulness",
            "acceptance",
            "patience",
            "resilience",
            "hope",
            "belonging",
            "perspective",
            "change",
            "trust",
            "rest",
            "simplicity",
            "wisdom",
        ];
        const recentAffirmations = yield user_affirmation_model_1.default
            .find({
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        }, {
            "affirmation.en": 1,
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        const avoidList = recentAffirmations
            .map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.affirmation) === null || _a === void 0 ? void 0 : _a.en; })
            .filter(Boolean)
            .join("\n");
        while (isDuplicate && retryCount < maxRetry) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            // 80% reflective, 20% affirmation
            const quoteType = Math.random() < 0.8
                ? "reflective"
                : "affirmation";
            const response = yield getOpenAI().chat.completions.create({
                model: "gpt-4.1-mini",
                temperature: 1.1,
                response_format: {
                    type: "json_object",
                },
                messages: [
                    {
                        role: "system",
                        content: `
You are a premium quote writer creating content for a mindfulness and emotional wellness app.

Your goal is NOT to create motivational content.

Your goal is to create a calm, emotionally intelligent, reflective experience.

CONTENT PHILOSOPHY

Most quotes should feel like thoughtful observations about life.

Reflective quotes are preferred over affirmations.

QUOTE TYPE RULES

If quote type is "reflective":

- Never use "I", "I'm", "I've", "My", "Me", or any first-person language.
- Write an observation rather than advice.
- Write about life, perspective, emotions, patience, courage, uncertainty, belonging, rest, change, wisdom, gratitude, resilience, simplicity, trust, hope, acceptance, relationships, beginnings, endings, or human experience.
- Allow readers to see themselves in the quote.
- Prefer subtle insight over direct encouragement.
- The quote should feel timeless rather than tied to a specific moment.
- The quote should feel calm, gentle, and emotionally intelligent.
- Avoid sounding like a lesson, command, or life hack.
- Avoid telling the reader what to do.
- Avoid motivational language.
- Avoid self-help language.
- Avoid therapy language.
- Avoid obvious clichés.
- Prefer fresh observations that feel human and thoughtfully curated.
If quote type is "affirmation":
- Write as a personal first-person affirmation.
- Usually use "I", "I'm", or "I've", but natural first-person variations are acceptable.
- Keep it grounded, calm, and emotionally believable.
- Avoid sounding therapeutic, motivational, or overly positive.
- The affirmation should feel elegant and human-written.

STYLE

- Calm
- Soft
- Elegant
- Minimal
- Timeless
- Human-written
- Emotionally intelligent
- Premium

LENGTH

- Prefer 5 to 14 words
- Maximum 16 words

AVOID

- Manifestation language
- Universe-based messaging
- Spiritual promises
- Alpha mindset language
- Hustle culture language
- Therapy jargon
- Toxic positivity
- Fake-deep writing
- Overly dramatic language

NEVER USE

- The universe
- Manifest
- Vibrations
- Greatness
- Winning
- Dominate
- Abundance is coming
- Everything happens for a reason
- My higher self
- Limitless potential

VARIETY RULES

- Vary sentence openings
- Vary structure
- Vary rhythm
- Vary emotional tone
- Avoid repetitive themes
- Avoid common affirmation patterns

QUALITY TEST

The quote should feel like it belongs inside a premium mindfulness app, beautiful journal, or thoughtfully curated quote collection.

Return ONLY valid JSON:

{
  "affirmation": "quote text"
}
              `,
                    },
                    {
                        role: "user",
                        content: `
Category:
${randomCategory}

Quote Type:
${quoteType}

Recent quotes to avoid:

${avoidList}

Requirements:

1. Express a genuinely fresh idea.
2. Do not repeat wording from recent quotes.
3. Do not repeat the same underlying meaning.
4. Avoid near-duplicates.
5. Avoid clichés.
6. Avoid motivational slogans.
7. Avoid generic self-help language.
8. Make the quote feel calm, premium and reflective.

Examples of desired style:

"Not every answer arrives with certainty."

"A slower pace can still lead somewhere meaningful."

"Some things become lighter when they are no longer resisted."

"I trust myself to begin again when needed."

Return JSON only.
              `,
                    },
                ],
            });
            const content = ((_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "{}";
            const parsed = JSON.parse(content);
            generatedQuote =
                (_d = parsed === null || parsed === void 0 ? void 0 : parsed.affirmation) === null || _d === void 0 ? void 0 : _d.trim();
            if (!generatedQuote) {
                retryCount++;
                continue;
            }
            const existingQuote = yield user_affirmation_model_1.default.findOne({
                "affirmation.en": {
                    $regex: `^${generatedQuote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                    $options: "i",
                },
                status: {
                    $ne: workflow_constant_1.USER_STATUS.DELETED,
                },
            });
            if (!existingQuote) {
                isDuplicate = false;
            }
            retryCount++;
        }
        if (!generatedQuote || isDuplicate) {
            return (0, response_util_1.showResponse)(false, "Failed to generate unique quote", null, statusCodes_1.default.API_ERROR);
        }
        const obj = {
            affirmation: {},
        };
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const translatedQuote = yield (0, langauge_translate_helper_1.translatePlainText)(generatedQuote, lang);
            obj.affirmation[lang] =
                translatedQuote;
        })));
        const createQuote = yield user_affirmation_model_1.default.create({
            affirmation: obj.affirmation,
            type: "AI",
        });
        // console.log(createQuote, "createQuote")
        if (!createQuote) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, createQuote, statusCodes_1.default.SUCCESS);
    }
    catch (error) {
        logger_config_1.default.error("CREATE_QUOTE_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return (0, response_util_1.showResponse)(false, "Error generating quote", null, statusCodes_1.default.API_ERROR);
    }
});
exports.generateAffirmation = generateAffirmation;
// const generateChallenges = async () => {
//   try {
//     await connectDB()
//     //daily logic 
//     const startOfDay = moment().startOf('day').toDate();
//     const findUser = await userAuthModel.find({
//       isVerified: true,
//       $or: [
//         { lastDailyChallengeGeneratedDate: { $exists: false } },
//         { lastDailyChallengeGeneratedDate: { $lt: startOfDay } },
//         { lastDailyChallengeGeneratedDate: null }
//       ]
//     });
//     if (findUser.length > 0) {
//       await Promise.all(findUser.map(async (curelem: any) => {
//         //challenges logic start
//         const challengesDetails = await challengsFn(curelem);
//         const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
//         const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
//         const payload: any = challengesDetails?.payload;
//         if (isOnBoardingComplete && !isDailyChallengeExist) {
//           //
//           await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { isDailyChallengeInProgress: true } })
//           const res = await generateUserChallengesDaily(payload, curelem?._id.toString());
//           const languagess = Object.values(languages);
//           const formattedChallenges = await Promise.all(
//             res?.data?.map(async (challenge: any) => {
//               const titleObj: any = {};
//               await Promise.all(
//                 languagess.map(async (lang) => {
//                   titleObj[lang] = await translateText(
//                     challenge.title,
//                     lang
//                   );
//                 })
//               );
//               const exercises = await Promise.all(
//                 challenge.exercises.map(async (exercise: any) => {
//                   const exerciseTitleObj: any = {};
//                   await Promise.all(
//                     languagess.map(async (lang) => {
//                       exerciseTitleObj[lang] = await translateText(
//                         exercise.title,
//                         lang
//                       );
//                     })
//                   );
//                   return {
//                     title: exerciseTitleObj,
//                     step_number: exercise.step_number,
//                   };
//                 })
//               );
//               return {
//                 user_id: challenge.user_id,
//                 challenge_type: challenge.challenge_type,
//                 points: challenge.points,
//                 title: titleObj,
//                 exercises,
//               };
//             })
//           );
//           const result = await userDailyChallengesModel.insertMany(
//             formattedChallenges
//           );
//           if (result) {
//             await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date(), isDailyChallengeInProgress: false } })
//           }
//         }
//         //end
//       }))
//     }
//     //weerkly section
//     const startOfWeek = moment().startOf('week').toDate();
//     const findUserWeekly = await userAuthModel.find({
//       isVerified: true,
//       $or: [
//         { lastWeeklyChallengeGeneratedDate: { $exists: false } },
//         { lastWeeklyChallengeGeneratedDate: { $lt: startOfWeek } },
//         { lastWeeklyChallengeGeneratedDate: null }
//       ]
//     });
//     if (findUserWeekly.length > 0) {
//       await Promise.all(findUserWeekly.map(async (curelem: any) => {
//         //challenges logic start
//         const challengesDetails = await challengsFn(curelem);
//         const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
//         const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
//         const payload: any = challengesDetails?.payload;
//         if (isOnBoardingComplete && !isWeeklyChallengeExist) {
//           await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { isWeeklyChallengeInProgress: true } })
//           const res = await generateUserChallengesWeekly(payload, curelem?._id.toString())
//           const languagess = Object.values(languages);
//           const formattedChallenges = await Promise.all(
//             res?.data?.map(async (challenge: any) => {
//               const titleObj: any = {};
//               await Promise.all(
//                 languagess.map(async (lang) => {
//                   titleObj[lang] = await translateText(
//                     challenge.title,
//                     lang
//                   );
//                 })
//               );
//               // multilingual exercises
//               const exercises = await Promise.all(
//                 challenge.exercises.map(async (exercise: any) => {
//                   const exerciseTitleObj: any = {};
//                   await Promise.all(
//                     languagess.map(async (lang) => {
//                       exerciseTitleObj[lang] = await translateText(
//                         exercise.title,
//                         lang
//                       );
//                     })
//                   );
//                   return {
//                     title: exerciseTitleObj,
//                     step_number: exercise.step_number,
//                   };
//                 })
//               );
//               return {
//                 user_id: challenge.user_id,
//                 challenge_type: challenge.challenge_type,
//                 points: challenge.points,
//                 title: titleObj,
//                 exercises,
//               };
//             })
//           );
//           const result = await userWeeklyChallengesModel.insertMany(
//             formattedChallenges
//           );
//           if (result) {
//             await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date(), isWeeklyChallengeInProgress: false } })
//           }
//         }
//         //end
//       }))
//     }
//   } catch (err: any) {
//     logger.error("GENERATE_CHALLENGES_ERROR", {
//       type: "error",
//       message: err.message,
//       stack: err.stack,
//     });
//     return showResponse(false, err.message, null, statusCodes.API_ERROR)
//   }
// }
// -------------------------
// Helpers
// -------------------------
const DEFAULT_TZ = "Europe/Zurich";
const getUserStartOfDay = (timeZone) => {
    // console.log(timeZone,"timezone")
    return moment_timezone_1.default.tz(timeZone || DEFAULT_TZ).startOf("day").toDate();
};
const getUserStartOfWeek = (timeZone) => {
    // console.log(timeZone,"timezone")
    return moment_timezone_1.default.tz(timeZone || DEFAULT_TZ).startOf("week").toDate();
};
// -------------------------
// Process single user - DAILY
// -------------------------
const processDailyUser = (curelem) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const challengesDetails = yield (0, common_helper_1.challengsFn)(curelem);
    const isOnBoardingComplete = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isOnBoardingComplete;
    const isDailyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isDailyChallengeExist;
    const payload = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.payload;
    if (!isOnBoardingComplete || isDailyChallengeExist) {
        return;
    }
    const res = yield (0, openai_helper_1.generateUserChallengesDaily)(payload, curelem._id.toString());
    const languagess = Object.values(workflow_constant_1.languages);
    const formattedChallenges = yield Promise.all((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.map((challenge) => __awaiter(void 0, void 0, void 0, function* () {
        // Translate Challenge Title
        const titleObj = {};
        yield Promise.all(languagess.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            titleObj[lang] = yield (0, langauge_translate_helper_1.translateText)(challenge.title, lang);
        })));
        // Translate Exercises
        const exercises = yield Promise.all(challenge.exercises.map((exercise) => __awaiter(void 0, void 0, void 0, function* () {
            const exerciseTitleObj = {};
            yield Promise.all(languagess.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                exerciseTitleObj[lang] = yield (0, langauge_translate_helper_1.translateText)(exercise.title, lang);
            })));
            return { title: exerciseTitleObj, step_number: exercise.step_number };
        })));
        return {
            user_id: challenge.user_id,
            challenge_type: challenge.challenge_type,
            points: challenge.points,
            title: titleObj,
            exercises,
        };
    })));
    const result = yield user_daily_challenges_model_1.default.insertMany(formattedChallenges);
    if (result) {
        yield user_auth_model_1.default.updateOne({ _id: curelem._id }, { $set: { lastDailyChallengeGeneratedDate: new Date() } });
    }
});
// -------------------------
// Process single user - WEEKLY
// -------------------------
const processWeeklyUser = (curelem) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const challengesDetails = yield (0, common_helper_1.challengsFn)(curelem);
    const isOnBoardingComplete = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isOnBoardingComplete;
    const isWeeklyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isWeeklyChallengeExist;
    const payload = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.payload;
    if (!isOnBoardingComplete || isWeeklyChallengeExist) {
        return;
    }
    const res = yield (0, openai_helper_1.generateUserChallengesWeekly)(payload, curelem._id.toString());
    const languagess = Object.values(workflow_constant_1.languages);
    const formattedChallenges = yield Promise.all((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.map((challenge) => __awaiter(void 0, void 0, void 0, function* () {
        // Translate Challenge Title
        const titleObj = {};
        yield Promise.all(languagess.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            titleObj[lang] = yield (0, langauge_translate_helper_1.translateText)(challenge.title, lang);
        })));
        // Translate Exercises
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
        };
    })));
    const result = yield user_weekly_challenges_model_1.default.insertMany(formattedChallenges);
    if (result) {
        yield user_auth_model_1.default.updateOne({ _id: curelem._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date() } });
    }
});
// -------------------------
// Main orchestrator
// -------------------------
const generateChallenges = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_config_1.connection)();
        // -------------------------
        // DAILY (timezone-aware)
        // -------------------------
        const dailyCandidates = yield user_auth_model_1.default.find({
            isVerified: true,
            isDailyChallengeInProgress: false,
            $or: [
                { lastDailyChallengeGeneratedDate: { $exists: false } },
                { lastDailyChallengeGeneratedDate: null },
                { lastDailyChallengeGeneratedDate: { $lt: new Date() } }, // rough pre-filter
            ],
        });
        // console.log(dailyCandidates,"dailyCandidatesdailllllyyyy")
        for (const candidate of dailyCandidates) {
            const userStartOfDay = getUserStartOfDay(candidate.timeZone);
            const last = candidate.lastDailyChallengeGeneratedDate;
            const isEligible = !last || last < userStartOfDay;
            if (!isEligible)
                continue; // their local day hasn't rolled over yet
            const user = yield user_auth_model_1.default.findOneAndUpdate({ _id: candidate._id, isDailyChallengeInProgress: false }, { $set: { isDailyChallengeInProgress: true } }, { new: true });
            // console.log(candidate._id,"userdaillyyy")
            if (!user)
                continue; // already claimed/processed by another run
            try {
                yield processDailyUser(user);
                // console.log("processDailyUser ",user?._id)
            }
            catch (err) {
                logger_config_1.default.error("PROCESS_DAILY_USER_ERROR", err);
            }
            finally {
                yield user_auth_model_1.default.updateOne({ _id: user._id }, { $set: { isDailyChallengeInProgress: false } });
            }
        }
        // -------------------------
        // WEEKLY (timezone-aware)
        // -------------------------
        const weeklyCandidates = yield user_auth_model_1.default.find({
            isVerified: true,
            isWeeklyChallengeInProgress: false,
            $or: [
                { lastWeeklyChallengeGeneratedDate: { $exists: false } },
                { lastWeeklyChallengeGeneratedDate: null },
                { lastWeeklyChallengeGeneratedDate: { $lt: new Date() } }, // rough pre-filter
            ],
        });
        // console.log(weeklyCandidates,"weeklyCandidates")
        for (const candidate of weeklyCandidates) {
            const userStartOfWeek = getUserStartOfWeek(candidate.timeZone);
            const last = candidate.lastWeeklyChallengeGeneratedDate;
            const isEligible = !last || last < userStartOfWeek;
            if (!isEligible)
                continue; // their local week hasn't rolled over yet
            // console.log(candidate._id,"candidate._id",candidate.timeZone,"candidate.timeZone")
            const user = yield user_auth_model_1.default.findOneAndUpdate({ _id: candidate._id, isWeeklyChallengeInProgress: false }, { $set: { isWeeklyChallengeInProgress: true } }, { new: true });
            if (!user)
                continue;
            try {
                yield processWeeklyUser(user);
                // console.log("processWeeklyUser ",user?._id)
            }
            catch (err) {
                logger_config_1.default.error("PROCESS_WEEKLY_USER_ERROR", err);
            }
            finally {
                yield user_auth_model_1.default.updateOne({ _id: user._id }, { $set: { isWeeklyChallengeInProgress: false } });
            }
        }
    }
    catch (err) {
        logger_config_1.default.error("GENERATE_CHALLENGES_ERROR", {
            type: "error",
            message: err.message,
            stack: err.stack,
        });
    }
});
// export const scheduleCroneJOb = () => {
//   nodeCron.schedule("*/60 * * * * *", () => {
//     generateChallenges();
//   });
// };
const scheduleCroneJOb = () => {
    node_cron_1.default.schedule('*/5 * * * *', () => {
        // console.log("crrrroonnnn")
        generateChallenges();
    });
};
exports.scheduleCroneJOb = scheduleCroneJOb;
