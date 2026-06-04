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
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const workflow_constant_1 = require("../constants/workflow.constant");
const langauge_translate_helper_1 = require("../helpers/langauge.translate.helper");
const user_affirmation_model_1 = __importDefault(require("../modules/UserAffirmation/user.affirmation.model"));
const openai_1 = __importDefault(require("openai"));
const app_constant_1 = require("../constants/app.constant");
const user_auth_model_1 = __importDefault(require("../modules/UserAuth/user.auth.model"));
const user_daily_challenges_model_1 = __importDefault(require("../modules/UserChallenges/user.daily.challenges.model"));
const moment_1 = __importDefault(require("moment"));
const common_helper_1 = require("./common.helper");
const openai_helper_1 = require("./openai.helper");
const user_weekly_challenges_model_1 = __importDefault(require("../modules/UserChallenges/user.weekly.challenges.model"));
const node_cron_1 = __importDefault(require("node-cron"));
const mongoose_config_1 = require("../configs/mongoose.config");
const openai = new openai_1.default({
    apiKey: app_constant_1.APP.OPENAI_API_KEY,
});
// const generateAffirmation = async () => {
//   try {
//     let generatedQuote = "";
//     let isDuplicate = true;
//     let retryCount = 0;
//     const maxRetry = 10;
//     // ==================================================
//     // RANDOM CATEGORY
//     // ==================================================
//     const categories = [
//       "confidence",
//       "self-love",
//       "healing",
//       "success",
//       "peace",
//       "gratitude",
//       "motivation",
//       "growth",
//       "happiness",
//       "strength",
//       "focus",
//       "abundance",
//       "calmness",
//       "courage",
//       "discipline",
//       "joy",
//       "energy",
//       "creativity",
//       "mindfulness",
//     ];
//     // ==================================================
//     // RECENT AFFIRMATIONS
//     // ==================================================
//     const recentAffirmations =
//       await userAffirmationModel
//         .find(
//           {
//             status: USER_STATUS.ACTIVE,
//           },
//           {
//             "affirmation.en": 1,
//           }
//         )
//         .sort({ createdAt: -1 })
//         .limit(20)
//         .lean();
//     const avoidList =
//       recentAffirmations
//         .map(
//           (item: any) =>
//             item?.affirmation?.en
//         )
//         .filter(Boolean)
//         .join("\n");
//     // Generate until unique quote found
//     while (isDuplicate && retryCount < maxRetry) {
//       const randomCategory =
//         categories[
//         Math.floor(
//           Math.random() *
//           categories.length
//         )
//         ];
//       const response = await openai.chat.completions.create({
//         model: "gpt-4.1-mini",
//         temperature: 1.4,
//         response_format: {
//           type: "json_object",
//         },
//         messages: [
//           {
//             role: "system",
//             content: `
// You are an affirmation generator.
// Your job is to create highly diverse affirmations.
// STRICT RULES:
// - Every affirmation must feel completely different
// - Avoid repeating sentence structures
// - Avoid repeating verbs
// - Avoid repeating emotional patterns
// - Never repeatedly start with:
//   "I embrace"
//   "I am"
//   "I deserve"
// - Use varied tones:
//   calm,
//   energetic,
//   empowering,
//   peaceful,
//   joyful,
//   grounded,
//   ambitious,
//   healing
// - Use modern natural language
// - Keep under 15 words
// - First person only
// - No poetry
// - No author names
// - No explanations
// - No hashtags
// - No emojis
// - Return ONLY JSON
// `,
//           },
//           {
//             role: "user",
//             content: `
// Generate 1 completely unique affirmation about "${randomCategory}".
// DO NOT generate anything similar to these affirmations:
// ${avoidList}
// Rules:
// - Different wording
// - Different emotional direction
// - Different structure
// - Different verbs
// - Different emotional energy
// Return JSON:
// {
//   "affirmation": "text"
// }
// `,
//           },
//         ],
//       });
//       const content: any = response.choices?.[0]?.message?.content || "{}";
//       const parsed = JSON.parse(content);
//       generatedQuote = parsed?.affirmation?.trim();
//       if (!generatedQuote) {
//         retryCount++;
//         continue;
//       }
//       // Duplicate check
//       const existingQuote = await userAffirmationModel.findOne({
//         "affirmation.en": {
//           $regex: `^${generatedQuote}$`,
//           $options: "i",
//         },
//         status: {
//           $ne: USER_STATUS.DELETED,
//         },
//       });
//       if (!existingQuote) {
//         isDuplicate = false;
//       }
//       retryCount++;
//     }
//     if (!generatedQuote || isDuplicate) {
//       return showResponse(
//         false,
//         "Failed to generate unique quote",
//         null,
//         statusCodes.API_ERROR,
//       );
//     }
//     // Translate all languages
//     const obj: any = {
//       affirmation: {},
//     };
//     const langs = Object.values(languages);
//     await Promise.all(
//       langs.map(async (lang: string) => {
//         const translatedQuote = await translatePlainText(generatedQuote, lang);
//         obj.affirmation[lang] = translatedQuote;
//       }),
//     );
//     // Save
//     const createQuote = await userAffirmationModel.create({
//       affirmation: obj.affirmation,
//       type: "AI",
//     });
//     if (!createQuote) {
//       return showResponse(
//         false,
//         responseMessage.common.save_failed,
//         null,
//         statusCodes.API_ERROR,
//       );
//     }
//     return showResponse(
//       true,
//       responseMessage.common.data_save,
//       createQuote,
//       statusCodes.SUCCESS,
//     );
//   } catch (error) {
//     console.log(error, "CREATE_QUOTE_ERROR");
//     return showResponse(
//       false,
//       "Error generating quote",
//       null,
//       statusCodes.API_ERROR,
//     );
//   }
// }; // end
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
            const response = yield openai.chat.completions.create({
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
        console.log(error, "CREATE_QUOTE_ERROR");
        return (0, response_util_1.showResponse)(false, "Error generating quote", null, statusCodes_1.default.API_ERROR);
    }
});
exports.generateAffirmation = generateAffirmation;
const generateChallenges = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('start');
        yield (0, mongoose_config_1.connection)();
        //daily logic 
        const startOfDay = (0, moment_1.default)().startOf('day').toDate();
        const findUser = yield user_auth_model_1.default.find({ lastDailyChallengeGeneratedDate: { $lt: startOfDay }, isVerified: true });
        if (findUser.length > 0) {
            yield Promise.all(findUser.map((curelem) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                //challenges logic start
                const challengesDetails = yield (0, common_helper_1.challengsFn)(curelem);
                const isOnBoardingComplete = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isOnBoardingComplete;
                const isDailyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isDailyChallengeExist;
                const payload = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.payload;
                if (isOnBoardingComplete && !isDailyChallengeExist) {
                    //
                    yield user_auth_model_1.default.findOneAndUpdate({ _id: curelem === null || curelem === void 0 ? void 0 : curelem._id }, { $set: { isDailyChallengeInProgress: true } });
                    const res = yield (0, openai_helper_1.generateUserChallengesDaily)(payload, curelem === null || curelem === void 0 ? void 0 : curelem._id.toString());
                    const languagess = Object.values(workflow_constant_1.languages);
                    const formattedChallenges = yield Promise.all((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.map((challenge) => __awaiter(void 0, void 0, void 0, function* () {
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
                        };
                    })));
                    const result = yield user_daily_challenges_model_1.default.insertMany(formattedChallenges);
                    if (result) {
                        yield user_auth_model_1.default.findOneAndUpdate({ _id: curelem === null || curelem === void 0 ? void 0 : curelem._id }, { $set: { lastDailyChallengeGeneratedDate: new Date(), isDailyChallengeInProgress: false } });
                    }
                }
                //end
            })));
        }
        //weerkly section
        const startOfWeek = (0, moment_1.default)().startOf('week').toDate();
        const findUserWeekly = yield user_auth_model_1.default.find({ lastWeeklyChallengeGeneratedDate: { $lt: startOfWeek }, isVerified: true });
        if (findUserWeekly.length > 0) {
            yield Promise.all(findUserWeekly.map((curelem) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                //challenges logic start
                const challengesDetails = yield (0, common_helper_1.challengsFn)(curelem);
                const isOnBoardingComplete = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isOnBoardingComplete;
                const isWeeklyChallengeExist = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.isWeeklyChallengeExist;
                const payload = challengesDetails === null || challengesDetails === void 0 ? void 0 : challengesDetails.payload;
                if (isOnBoardingComplete && !isWeeklyChallengeExist) {
                    yield user_auth_model_1.default.findOneAndUpdate({ _id: curelem === null || curelem === void 0 ? void 0 : curelem._id }, { $set: { isWeeklyChallengeInProgress: true } });
                    const res = yield (0, openai_helper_1.generateUserChallengesWeekly)(payload, curelem === null || curelem === void 0 ? void 0 : curelem._id.toString());
                    const languagess = Object.values(workflow_constant_1.languages);
                    const formattedChallenges = yield Promise.all((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.map((challenge) => __awaiter(void 0, void 0, void 0, function* () {
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
                        };
                    })));
                    const result = yield user_weekly_challenges_model_1.default.insertMany(formattedChallenges);
                    if (result) {
                        yield user_auth_model_1.default.findOneAndUpdate({ _id: curelem === null || curelem === void 0 ? void 0 : curelem._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date(), isWeeklyChallengeInProgress: false } });
                    }
                }
                //end
            })));
        }
    }
    catch (err) {
        console.log(err, "GENERATE_CHALLENGES_ERROR");
        return (0, response_util_1.showResponse)(false, err.message, null, statusCodes_1.default.API_ERROR);
    }
});
const scheduleCroneJOb = () => {
    node_cron_1.default.schedule('*/5 * * * *', () => {
        generateChallenges();
    });
};
exports.scheduleCroneJOb = scheduleCroneJOb;
