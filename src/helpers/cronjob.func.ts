import { showResponse } from "../utils/response.util";
import responseMessage from "../constants/responseMessages";
import logger from "../configs/logger.config";
import statusCodes from "../constants/statusCodes";
import { languages, USER_STATUS } from "../constants/workflow.constant";
import { translatePlainText, translateText } from "../helpers/langauge.translate.helper";
import userAffirmationModel from "../modules/UserAffirmation/user.affirmation.model";
import OpenAI from "openai";
import { APP } from "../constants/app.constant";
import userAuthModel from "../modules/UserAuth/user.auth.model";
import userDailyChallengesModel from "../modules/UserChallenges/user.daily.challenges.model";
// import moment from "moment";
import { challengsFn } from "./common.helper";
import { generateUserChallengesDaily, generateUserChallengesWeekly } from "./openai.helper";
import userWeeklyChallengesModel from "../modules/UserChallenges/user.weekly.challenges.model";
import nodeCron from "node-cron";
import { connection as connectDB } from "../configs/mongoose.config";
import momentTz from "moment-timezone";
import moment from "moment-timezone";


const getOpenAI = () => new OpenAI({
  apiKey: APP.OPENAI_API_KEY,
});

const generateAffirmation = async () => {
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

    const recentAffirmations = await userAffirmationModel
      .find(
        {
          status: USER_STATUS.ACTIVE,
        },
        {
          "affirmation.en": 1,
        }
      )
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const avoidList = recentAffirmations
      .map((item: any) => item?.affirmation?.en)
      .filter(Boolean)
      .join("\n");

    while (isDuplicate && retryCount < maxRetry) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      // 80% reflective, 20% affirmation
      const quoteType =
        Math.random() < 0.8
          ? "reflective"
          : "affirmation";

      const response =
        await getOpenAI().chat.completions.create({
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

      const content =
        response.choices?.[0]?.message?.content || "{}";

      const parsed = JSON.parse(content);

      generatedQuote =
        parsed?.affirmation?.trim();

      if (!generatedQuote) {
        retryCount++;
        continue;
      }

      const existingQuote =
        await userAffirmationModel.findOne({
          "affirmation.en": {
            $regex: `^${generatedQuote.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,
            $options: "i",
          },
          status: {
            $ne: USER_STATUS.DELETED,
          },
        });

      if (!existingQuote) {
        isDuplicate = false;
      }

      retryCount++;
    }

    if (!generatedQuote || isDuplicate) {
      return showResponse(
        false,
        "Failed to generate unique quote",
        null,
        statusCodes.API_ERROR
      );
    }

    const obj: any = {
      affirmation: {},
    };

    const langs = Object.values(languages);

    await Promise.all(
      langs.map(async (lang: string) => {
        const translatedQuote =
          await translatePlainText(
            generatedQuote,
            lang
          );

        obj.affirmation[lang] =
          translatedQuote;
      })
    );

    const createQuote =
      await userAffirmationModel.create({
        affirmation: obj.affirmation,
        type: "AI",
      });
    // console.log(createQuote, "createQuote")

    if (!createQuote) {
      return showResponse(
        false,
        responseMessage.common.save_failed,
        null,
        statusCodes.API_ERROR
      );
    }

    return showResponse(
      true,
      responseMessage.common.data_save,
      createQuote,
      statusCodes.SUCCESS
    );
  } catch (error: any) {
    logger.error("CREATE_QUOTE_ERROR", {
      type: "error",
      message: error.message,
      stack: error.stack,
    });
    return showResponse(
      false,
      "Error generating quote",
      null,
      statusCodes.API_ERROR
    );
  }
};

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

const getUserStartOfDay = (timeZone?: string) => {
  // console.log(timeZone,"timezone")
  return momentTz.tz(timeZone || DEFAULT_TZ).startOf("day").toDate();
};

const getUserStartOfWeek = (timeZone?: string) => {
  // console.log(timeZone,"timezone")
  return momentTz.tz(timeZone || DEFAULT_TZ).startOf("week").toDate();
};

// -------------------------
// Process single user - DAILY
// -------------------------
const processDailyUser = async (curelem: any) => {
  const challengesDetails = await challengsFn(curelem);

  const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
  const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
  const payload: any = challengesDetails?.payload;

  if (!isOnBoardingComplete || isDailyChallengeExist) {
    return;
  }

  const res = await generateUserChallengesDaily(
    payload,
    curelem._id.toString()
  );

  const languagess = Object.values(languages);

  const formattedChallenges = await Promise.all(
    res?.data?.map(async (challenge: any) => {
      // Translate Challenge Title
      const titleObj: any = {};

      await Promise.all(
        languagess.map(async (lang) => {
          titleObj[lang] = await translateText(challenge.title, lang);
        })
      );

      // Translate Exercises
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

          return { title: exerciseTitleObj, step_number: exercise.step_number };
        })
      );
      const end_date_unix = moment().tz(curelem.timeZone).endOf("day").unix();

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

  const result = await userDailyChallengesModel.insertMany(formattedChallenges);

  if (result) {
    await userAuthModel.updateOne(
      { _id: curelem._id },
      { $set: { lastDailyChallengeGeneratedDate: new Date() } }
    );
  }
};

// -------------------------
// Process single user - WEEKLY
// -------------------------
const processWeeklyUser = async (curelem: any) => {
  const challengesDetails = await challengsFn(curelem);

  const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
  const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
  const payload: any = challengesDetails?.payload;

  if (!isOnBoardingComplete || isWeeklyChallengeExist) {
    return;
  }

  const res = await generateUserChallengesWeekly(
    payload,
    curelem._id.toString()
  );

  const languagess = Object.values(languages);

  const formattedChallenges = await Promise.all(
    res?.data?.map(async (challenge: any) => {
      // Translate Challenge Title
      const titleObj: any = {};

      await Promise.all(
        languagess.map(async (lang) => {
          titleObj[lang] = await translateText(challenge.title, lang);
        })
      );

      // Translate Exercises
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

      const end_date_unix = moment().tz(curelem.timeZone).endOf("week").unix();
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

  const result = await userWeeklyChallengesModel.insertMany(
    formattedChallenges
  );

  if (result) {
    await userAuthModel.updateOne(
      { _id: curelem._id },
      { $set: { lastWeeklyChallengeGeneratedDate: new Date() } }
    );
  }
};

// -------------------------
// Main orchestrator
// -------------------------
const generateChallenges = async () => {
  try {
    await connectDB();

    // -------------------------
    // DAILY (timezone-aware)
    // -------------------------
    const dailyCandidates = await userAuthModel.find({
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
      if (!isEligible) continue; // their local day hasn't rolled over yet

      const user = await userAuthModel.findOneAndUpdate(
        { _id: candidate._id, isDailyChallengeInProgress: false },
        { $set: { isDailyChallengeInProgress: true } },
        { new: true }
      );
      // console.log(candidate._id,"userdaillyyy")

      if (!user) continue; // already claimed/processed by another run

      try {
        await processDailyUser(user);
        // console.log("processDailyUser ",user?._id)
      } catch (err) {
        logger.error("PROCESS_DAILY_USER_ERROR", err);
      } finally {
        await userAuthModel.updateOne(
          { _id: user._id },
          { $set: { isDailyChallengeInProgress: false } }
        );
      }
    }

    // -------------------------
    // WEEKLY (timezone-aware)
    // -------------------------
    const weeklyCandidates = await userAuthModel.find({
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
      if (!isEligible) continue; // their local week hasn't rolled over yet
      // console.log(candidate._id,"candidate._id",candidate.timeZone,"candidate.timeZone")

      const user = await userAuthModel.findOneAndUpdate(
        { _id: candidate._id, isWeeklyChallengeInProgress: false },
        { $set: { isWeeklyChallengeInProgress: true } },
        { new: true }
      );

      if (!user) continue;

      try {
        await processWeeklyUser(user);
        // console.log("processWeeklyUser ",user?._id)
      } catch (err) {
        logger.error("PROCESS_WEEKLY_USER_ERROR", err);
      } finally {
        await userAuthModel.updateOne(
          { _id: user._id },
          { $set: { isWeeklyChallengeInProgress: false } }
        );
      }
    }
  } catch (err: any) {
    logger.error("GENERATE_CHALLENGES_ERROR", {
      type: "error",
      message: err.message,
      stack: err.stack,
    });
  }
};

// export const scheduleCroneJOb = () => {
//   nodeCron.schedule("*/60 * * * * *", () => {
//     generateChallenges();
//   });
// };

// export const scheduleCroneJOb = () => {
//   nodeCron.schedule('0 */5 * * * *', () => {
//     // console.log("crrrroonnnn")
//     generateChallenges()
//   }, {
//     noOverlap: true,
//   })
// }
export const scheduleCroneJOb = () => {
  if (process.env.NODE_APP_INSTANCE === '0') {
    nodeCron.schedule(
      '0 */5 * * * *',async () => {
        try {
          await generateChallenges();
        } catch (err:any) {
          logger.error("Challenge Cron Error", {
            type: "error",
            message: err.message,
            stack: err.stack,
          });
        }
      },
      {
        noOverlap: true,
      }
    );
  }
};


export {
  generateAffirmation,

};
