import { showResponse } from "../utils/response.util";
import responseMessage from "../constants/responseMessages";
import statusCodes from "../constants/statusCodes";
import { languages, USER_STATUS } from "../constants/workflow.constant";
import { translateText } from "../helpers/langauge.translate.helper";
import userAffirmationModel from "../modules/UserAffirmation/user.affirmation.model";
import OpenAI from "openai";
import { APP } from "../constants/app.constant";


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
          console.log(content,"content")
  
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


export {
  generateAffirmation
};
