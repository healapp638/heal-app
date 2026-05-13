import { showResponse } from "../utils/response.util";
import responseMessage from "../constants/responseMessages";
import statusCodes from "../constants/statusCodes";
import { languages, USER_STATUS } from "../constants/workflow.constant";
import { translateText } from "../helpers/langauge.translate.helper";
import userAffirmationModel from "../modules/UserAffirmation/user.affirmation.model";
import OpenAI from "openai";
import { APP } from "../constants/app.constant";
import userAuthModel from "../modules/UserAuth/user.auth.model";
import userDailyChallengesModel from "../modules/UserChallenges/user.daily.challenges.model";
import moment from "moment";
import { challengsFn } from "./common.helper";
import { generateUserChallengesDaily, generateUserChallengesWeekly } from "./openai.helper";
import userWeeklyChallengesModel from "../modules/UserChallenges/user.weekly.challenges.model";


const openai = new OpenAI({
  apiKey: APP.OPENAI_API_KEY,
});


const generateAffirmation = async () => {
  try {
    let generatedQuote = "";
    let isDuplicate = true;
    let retryCount = 0;
    const maxRetry = 10;

    // Generate until unique quote found
    while (isDuplicate && retryCount < maxRetry) {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 1,
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: `
You are a powerful affirmation generator.

Rules:
- Generate SHORT positive affirmations
- Write in FIRST PERSON
- Every affirmation must feel DIFFERENT from previous ones
- Use varied themes:
confidence,
self-love,
healing,
success,
peace,
gratitude,
motivation,
growth,
happiness,
strength,
focus,
abundance,
calmness,
positivity,
courage

- Avoid repetitive sentence structures
- Avoid poetic quotes
- Do NOT include author names
- Make affirmations emotionally uplifting
- Keep them natural, modern, and human
- Maximum 15 words
- Prefer present tense
- Examples:
  "I attract peace into my life"
  "I am becoming stronger every day"
  "I deserve happiness and success"

- Return ONLY valid JSON
`,
          },
          {
            role: "user",
            content: `
Generate 1 completely unique affirmation.

Return JSON:
{
  "affirmation": "text"
}
`,
          },
        ],
      });

      const content: any = response.choices?.[0]?.message?.content || "{}";
      console.log(content, "content")

      const parsed = JSON.parse(content);

      generatedQuote = parsed?.affirmation?.trim();

      if (!generatedQuote) {
        retryCount++;
        continue;
      }

      // Duplicate check
      const existingQuote = await userAffirmationModel.findOne({
        "affirmation.en": {
          $regex: `^${generatedQuote}$`,
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
        statusCodes.API_ERROR,
      );
    }

    // Translate all languages
    const obj: any = {
      affirmation: {},
    };

    const langs = Object.values(languages);

    await Promise.all(
      langs.map(async (lang: string) => {
        const translatedQuote = await translateText(generatedQuote, lang);

        obj.affirmation[lang] = translatedQuote;
      }),
    );

    // Save
    const createQuote = await userAffirmationModel.create({
      affirmation: obj.affirmation,
      type: "AI",
    });

    if (!createQuote) {
      return showResponse(
        false,
        responseMessage.common.save_failed,
        null,
        statusCodes.API_ERROR,
      );
    }

    return showResponse(
      true,
      responseMessage.common.data_save,
      createQuote,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    console.log(error, "CREATE_QUOTE_ERROR");

    return showResponse(
      false,
      "Error generating quote",
      null,
      statusCodes.API_ERROR,
    );
  }
}
  ; // end

const generateChallenges = async () => {
  try {

    //daily logic 
    const startOfDay = moment().startOf('day').toDate();
    const findUser = await userAuthModel.find({ lastDailyChallengeGeneratedDate: { $lt: startOfDay }, isVerified: true })
    if (findUser.length > 0) {
      await Promise.all(findUser.map(async (curelem: any) => {
        //challenges logic start
        const challengesDetails = await challengsFn(curelem);
        const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
        const isDailyChallengeExist = challengesDetails?.isDailyChallengeExist;
        const payload: any = challengesDetails?.payload;
        if (isOnBoardingComplete && !isDailyChallengeExist) {
          const res = await generateUserChallengesDaily(payload, curelem?._id.toString());
          const result = await userDailyChallengesModel.insertMany(res.data)
          if (result) {
            await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { lastDailyChallengeGeneratedDate: new Date() } })
          }
        }
        //end
      }))
    }

    //weerkly section
    const startOfWeek = moment().startOf('week').toDate();
    const findUserWeekly = await userAuthModel.find({ lastWeeklyChallengeGeneratedDate: { $lt: startOfWeek }, isVerified: true })
    if (findUserWeekly.length > 0) {
      await Promise.all(findUserWeekly.map(async (curelem: any) => {
        //challenges logic start
        const challengesDetails = await challengsFn(curelem);
        const isOnBoardingComplete = challengesDetails?.isOnBoardingComplete;
        const isWeeklyChallengeExist = challengesDetails?.isWeeklyChallengeExist;
        const payload: any = challengesDetails?.payload;
        if (isOnBoardingComplete && !isWeeklyChallengeExist) {
          const res = await generateUserChallengesWeekly(payload, curelem?._id.toString())
          const result = await userWeeklyChallengesModel.insertMany(res.data)
          if (result) {
            await userAuthModel.findOneAndUpdate({ _id: curelem?._id }, { $set: { lastWeeklyChallengeGeneratedDate: new Date() } })
          }
        }
        //end
      }))
    }
  } catch (err: any) {
    console.log(err, "GENERATE_CHALLENGES_ERROR")
    return showResponse(false, err.message, null, statusCodes.API_ERROR)
  }
}


export {
  generateAffirmation,
  generateChallenges
};
