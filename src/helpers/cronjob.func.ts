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
import moment from "moment";
import { challengsFn } from "./common.helper";
import { generateUserChallengesDaily, generateUserChallengesWeekly } from "./openai.helper";
import userWeeklyChallengesModel from "../modules/UserChallenges/user.weekly.challenges.model";
import nodeCron from "node-cron";
import { connection as connectDB } from "../configs/mongoose.config";


const getOpenAI = () => new OpenAI({
  apiKey: APP.OPENAI_API_KEY,
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

const generateChallenges = async () => {
  try {
    await connectDB()
    //daily logic 
    const startOfDay = moment().startOf('day').toDate();
    const findUser = await userAuthModel.find({
      isVerified: true,
      $or: [
        { lastDailyChallengeGeneratedDate: { $exists: false } },
        { lastDailyChallengeGeneratedDate: { $lt: startOfDay } },
        { lastDailyChallengeGeneratedDate: null }
      ]
    });
    if (findUser.length > 0) {
      await Promise.all(findUser.map(async (curelem: any) => {
        //challenges logic start
        const challengesDetails = await challengsFn(curelem);
        const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
        const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
        const payload: any = challengesDetails?.payload;
        if (isOnBoardingComplete && !isDailyChallengeExist) {
          //
          await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { isDailyChallengeInProgress: true } })
          const res = await generateUserChallengesDaily(payload, curelem?._id.toString());
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
          if (result) {
            await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date(), isDailyChallengeInProgress: false } })
          }
        }
        //end
      }))
    }

    //weerkly section
    const startOfWeek = moment().startOf('week').toDate();
    const findUserWeekly = await userAuthModel.find({
      isVerified: true,
      $or: [
        { lastWeeklyChallengeGeneratedDate: { $exists: false } },
        { lastWeeklyChallengeGeneratedDate: { $lt: startOfWeek } },
        { lastWeeklyChallengeGeneratedDate: null }
      ]
    });

    if (findUserWeekly.length > 0) {
      await Promise.all(findUserWeekly.map(async (curelem: any) => {
        //challenges logic start
        const challengesDetails = await challengsFn(curelem);
        const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
        const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
        const payload: any = challengesDetails?.payload;
        if (isOnBoardingComplete && !isWeeklyChallengeExist) {
          await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { isWeeklyChallengeInProgress: true } })
          const res = await generateUserChallengesWeekly(payload, curelem?._id.toString())
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
            await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date(), isWeeklyChallengeInProgress: false } })
          }
        }
        //end
      }))
    }
  } catch (err: any) {
    logger.error("GENERATE_CHALLENGES_ERROR", {
      type: "error",
      message: err.message,
      stack: err.stack,
    });
    return showResponse(false, err.message, null, statusCodes.API_ERROR)
  }
}

export const scheduleCroneJOb = () => {
  nodeCron.schedule('*/30 * * * * *', () => {
    // console.log("crrrroonnnn")
    generateChallenges()
  })
}

export {
  generateAffirmation,

};
