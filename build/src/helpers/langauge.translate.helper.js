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
exports.AutoTranslateText = exports.UserTranslateText = exports.translateHealyText = exports.detectLanguage = exports.translatePlainText = exports.translateText = void 0;
const translate_1 = require("@google-cloud/translate");
const app_constant_1 = require("../constants/app.constant");
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const he_1 = __importDefault(require("he"));
// import OpenAI from 'openai';
// const translate = new Translate({
//     key: APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
// });
// export const translateText = async (text: string, targetLanguage: string) => {
//     try {
//         console.log(APP.HL_GOOGLE_TRANSLATE_API_KEY,"APP.HL_GOOGLE_TRANSLATE_API_KEY")
//         if (targetLanguage == 'en') {
//             return text
//         }
//         const translate = new Translate({
//           key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
//         });
//         const [translation] = await translate.translate(text, {
//             from: 'en', // Source language
//             to: targetLanguage, // Target language
//             format: 'html', // Format if necessary
//         });
//         return translation; // Return the translated text
//     } catch (error: any) {
//         logger.error("GOOGLE_TRANSLATE_TEXT_ERROR", {
//             type: "error",
//             message: error.message,
//             stack: error.stack,
//         });
//          return text
//     }
// };
const translateText = (text, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (targetLanguage === 'en') {
            return he_1.default.decode(text);
        }
        const translate = new translate_1.Translate({
            key: yield app_constant_1.APP.HL_GOOGLE_TRANSLATE_API_KEY,
        });
        // Decode HTML entities first
        const decodedText = he_1.default.decode(text);
        const [translation] = yield translate.translate(decodedText, {
            from: 'en',
            to: targetLanguage,
            format: 'html',
        });
        // Decode again in case translation contains entities
        return he_1.default.decode(translation);
    }
    catch (error) {
        logger_config_1.default.error('GOOGLE_TRANSLATE_TEXT_ERROR', {
            type: 'error',
            message: error.message,
            stack: error.stack,
        });
        return he_1.default.decode(text);
    }
});
exports.translateText = translateText;
const translatePlainText = (text, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(APP.HL_GOOGLE_TRANSLATE_API_KEY,"APP.HL_GOOGLE_TRANSLATE_API_KEY")
        if (targetLanguage == 'en') {
            return text;
        }
        const translate = new translate_1.Translate({
            key: yield app_constant_1.APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [translation] = yield translate.translate(text, {
            from: 'en', // Source language
            to: targetLanguage, // Target language
            format: 'text', // Format if necessary
        });
        return translation; // Return the translated text
    }
    catch (error) {
        logger_config_1.default.error("GOOGLE_TRANSLATE_PLAIN_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text;
    }
});
exports.translatePlainText = translatePlainText;
const detectLanguage = (text) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const translate = new translate_1.Translate({
            key: yield app_constant_1.APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [detections] = yield translate.detect(text);
        return Array.isArray(detections)
            ? (_a = detections[0]) === null || _a === void 0 ? void 0 : _a.language
            : detections === null || detections === void 0 ? void 0 : detections.language;
    }
    catch (error) {
        logger_config_1.default.error("GOOGLE_DETECT_LANGUAGE_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return "en";
    }
});
exports.detectLanguage = detectLanguage;
const translateHealyText = (text, sourceLanguage, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (sourceLanguage === targetLanguage) {
            return text;
        }
        const translate = new translate_1.Translate({
            key: yield app_constant_1.APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [translation] = yield translate.translate(text, {
            from: sourceLanguage,
            to: targetLanguage,
            format: "text",
        });
        //console.log(translation,"translation----------------------")
        return translation;
    }
    catch (error) {
        //console.log(error,"error====================")
        logger_config_1.default.error("GOOGLE_TRANSLATE_HEALY_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text;
    }
});
exports.translateHealyText = translateHealyText;
const UserTranslateText = (text_1, targetLanguage_1, ...args_1) => __awaiter(void 0, [text_1, targetLanguage_1, ...args_1], void 0, function* (text, targetLanguage, sourceLanguage = 'en') {
    try {
        if (targetLanguage == sourceLanguage) {
            return text;
        }
        const translate = new translate_1.Translate({
            key: yield app_constant_1.APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [translation] = yield translate.translate(text, {
            from: sourceLanguage, // Source language
            to: targetLanguage, // Target language
            format: 'html', // Format if necessary
        });
        return translation; // Return the translated text
    }
    catch (error) {
        logger_config_1.default.error("GOOGLE_USER_TRANSLATE_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text;
    }
});
exports.UserTranslateText = UserTranslateText;
const AutoTranslateText = (text_1, targetLanguage_1, ...args_1) => __awaiter(void 0, [text_1, targetLanguage_1, ...args_1], void 0, function* (text, targetLanguage, sourceLanguage = 'auto') {
    try {
        const translate = new translate_1.Translate({
            key: yield app_constant_1.APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        // Skip if source and target are the same
        if (sourceLanguage !== 'auto' && targetLanguage === sourceLanguage) {
            return text;
        }
        // For auto-detection, don't specify source
        const options = {
            to: targetLanguage,
        };
        // Only add 'from' if source is not 'auto'
        if (sourceLanguage !== 'auto') {
            options.from = sourceLanguage;
        }
        // console.log(`Translating "${text}" to ${targetLanguage} with options:`, options);
        const [translation] = yield translate.translate(text, options);
        return translation;
    }
    catch (error) {
        logger_config_1.default.error("GOOGLE_AUTO_TRANSLATE_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text;
    }
});
exports.AutoTranslateText = AutoTranslateText;
// // =========================================
// // OPENAI TRANSLATION HELPER
// // =========================================
// export const translateWithOpenAI = async (
//     openai: OpenAI,
//     text: string,
//     sourceLang: string,
//     targetLangs: string[]
// ): Promise<Record<string, string>> => {
//     if (!text || !text.trim()) {
//         const empty: Record<string, string> = {};
//         targetLangs.forEach((l) => (empty[l] = ""));
//         return empty;
//     }
//     // No need to "translate" into the same language it's already in
//     const langsToTranslate = targetLangs.filter((l) => l !== sourceLang);
//     if (langsToTranslate.length === 0) {
//         const result: Record<string, string> = {};
//         targetLangs.forEach((l) => (result[l] = text));
//         return result;
//     }
//     let parsed: Record<string, string> = {};
//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-4.1-mini",
//             messages: [
//                 {
//                     role: "system",
//                     content: `You are a professional translator.
// You will be given a piece of text written in "${sourceLang}".
// Translate it into each of the following language codes: ${langsToTranslate.join(", ")}.
// Rules:
// - Preserve tone, meaning, and formatting (line breaks, punctuation, emojis).
// - Do NOT summarize, shorten, or add commentary.
// - Return ONLY valid JSON, no markdown fences, no extra text.
// - JSON shape: { "langCode1": "translation1", "langCode2": "translation2", ... }
// - Keys must be exactly the language codes provided, nothing else.`,
//                 },
//                 {
//                     role: "user",
//                     content: text,
//                 },
//             ],
//             temperature: 0.2,
//             max_tokens: 2000,
//             response_format: { type: "json_object" },
//         });
//         const raw = response?.choices?.[0]?.message?.content || "{}";
//         parsed = JSON.parse(raw);
//     } catch (err) {
//         console.log(err,"err")
//         // Fallback: if API call or parsing fails, use the original text everywhere
//         langsToTranslate.forEach((l) => (parsed[l] = text));
//     }
//     // Always include the source language as-is
//     parsed[sourceLang] = text;
//     // Safety net: ensure every requested lang has a value
//     targetLangs.forEach((l) => {
//         if (!parsed[l]) parsed[l] = text;
//     });
//     return parsed;
// }
