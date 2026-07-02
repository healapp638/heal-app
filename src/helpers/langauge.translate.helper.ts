import { Translate } from '@google-cloud/translate';
import { APP } from '../constants/app.constant';
import logger from '../configs/logger.config';
import he from 'he';
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

export const translateText = async (
    text: string,
    targetLanguage: string
) => {
    try {
        if (targetLanguage === 'en') {
            return he.decode(text);
        }
        const translate = new Translate({
            key: await APP.HL_GOOGLE_TRANSLATE_API_KEY,
        });

        // Decode HTML entities first
        const decodedText = he.decode(text);
        const [translation] = await translate.translate(decodedText, {
            from: 'en',
            to: targetLanguage,
            format: 'html',
        });

        // Decode again in case translation contains entities
        return he.decode(translation);
    } catch (error: any) {
        logger.error('GOOGLE_TRANSLATE_TEXT_ERROR', {
            type: 'error',
            message: error.message,
            stack: error.stack,
        });
        return he.decode(text);
    }
};



export const translatePlainText = async (text: string, targetLanguage: string) => {
    try {
        // console.log(APP.HL_GOOGLE_TRANSLATE_API_KEY,"APP.HL_GOOGLE_TRANSLATE_API_KEY")
        if (targetLanguage == 'en') {
            return text
        }
        const translate = new Translate({
            key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [translation] = await translate.translate(text, {
            from: 'en', // Source language
            to: targetLanguage, // Target language
            format: 'text', // Format if necessary
        });
        return translation; // Return the translated text
    } catch (error: any) {
        logger.error("GOOGLE_TRANSLATE_PLAIN_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text
    }
};

export const detectLanguage = async (text: string) => {
    try {
        const translate = new Translate({
            key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [detections]: any = await translate.detect(text);
        return Array.isArray(detections)
            ? detections[0]?.language
            : detections?.language;
    } catch (error: any) {
        logger.error("GOOGLE_DETECT_LANGUAGE_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return "en";
    }
};

export const translateHealyText = async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
) => {
    try {
        if (sourceLanguage === targetLanguage) {
            return text;
        }

        const translate = new Translate({
            key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [translation] = await translate.translate(text, {
            from: sourceLanguage,
            to: targetLanguage,
            format: "text",
        });
        //console.log(translation,"translation----------------------")

        return translation;

    } catch (error: any) {
        //console.log(error,"error====================")
        logger.error("GOOGLE_TRANSLATE_HEALY_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text;
    }
};

export const UserTranslateText = async (text: string, targetLanguage: string, sourceLanguage: string = 'en') => {
    try {
        if (targetLanguage == sourceLanguage) {
            return text
        }
        const translate = new Translate({
            key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        const [translation] = await translate.translate(text, {
            from: sourceLanguage, // Source language
            to: targetLanguage, // Target language
            format: 'html', // Format if necessary
        });
        return translation; // Return the translated text
    } catch (error: any) {
        logger.error("GOOGLE_USER_TRANSLATE_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text;
    }
};

export const AutoTranslateText = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto') => {
    try {
        const translate = new Translate({
            key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
        });
        // Skip if source and target are the same
        if (sourceLanguage !== 'auto' && targetLanguage === sourceLanguage) {
            return text;
        }

        // For auto-detection, don't specify source
        const options: any = {
            to: targetLanguage,
        };

        // Only add 'from' if source is not 'auto'
        if (sourceLanguage !== 'auto') {
            options.from = sourceLanguage;
        }

        // console.log(`Translating "${text}" to ${targetLanguage} with options:`, options);

        const [translation] = await translate.translate(text, options);
        return translation;

    } catch (error: any) {
        logger.error("GOOGLE_AUTO_TRANSLATE_TEXT_ERROR", {
            type: "error",
            message: error.message,
            stack: error.stack,
        });
        return text;
    }
};


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