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
exports.generateAffirmation = void 0;
const response_util_1 = require("../utils/response.util");
const responseMessages_1 = __importDefault(require("../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const workflow_constant_1 = require("../constants/workflow.constant");
const langauge_translate_helper_1 = require("../helpers/langauge.translate.helper");
const user_affirmation_model_1 = __importDefault(require("../modules/UserAffirmation/user.affirmation.model"));
const openai_1 = __importDefault(require("openai"));
const app_constant_1 = require("../constants/app.constant");
const openai = new openai_1.default({
    apiKey: app_constant_1.APP.OPENAI_API_KEY,
});
const generateAffirmation = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let generatedQuote = "";
        let isDuplicate = true;
        let retryCount = 0;
        const maxRetry = 10;
        // Generate until unique quote found
        while (isDuplicate && retryCount < maxRetry) {
            const response = yield openai.chat.completions.create({
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
            const content = ((_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "{}";
            console.log(content, "content");
            const parsed = JSON.parse(content);
            generatedQuote = (_d = parsed === null || parsed === void 0 ? void 0 : parsed.affirmation) === null || _d === void 0 ? void 0 : _d.trim();
            if (!generatedQuote) {
                retryCount++;
                continue;
            }
            // Duplicate check
            const existingQuote = yield user_affirmation_model_1.default.findOne({
                "affirmation.en": {
                    $regex: `^${generatedQuote}$`,
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
        // Translate all languages
        const obj = {
            affirmation: {},
        };
        const langs = Object.values(workflow_constant_1.languages);
        yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
            const translatedQuote = yield (0, langauge_translate_helper_1.translateText)(generatedQuote, lang);
            obj.affirmation[lang] = translatedQuote;
        })));
        // Save
        const createQuote = yield user_affirmation_model_1.default.create({
            affirmation: obj.affirmation,
            type: "AI",
        });
        if (!createQuote) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, createQuote, statusCodes_1.default.SUCCESS);
    }
    catch (error) {
        console.log(error, "CREATE_QUOTE_ERROR");
        return (0, response_util_1.showResponse)(false, "Error generating quote", null, statusCodes_1.default.API_ERROR);
    }
}); // end
exports.generateAffirmation = generateAffirmation;
