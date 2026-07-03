// import { Translate } from '@google-cloud/translate';
// import { APP } from '../constants/app.constant';
// import logger from '../configs/logger.config';
// import he from 'he';
// // import OpenAI from 'openai';


// // const translate = new Translate({
// //     key: APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
// // });


// // export const translateText = async (text: string, targetLanguage: string) => {
// //     try {

// //         console.log(APP.HL_GOOGLE_TRANSLATE_API_KEY,"APP.HL_GOOGLE_TRANSLATE_API_KEY")
// //         if (targetLanguage == 'en') {
// //             return text
// //         }
// //         const translate = new Translate({
// //           key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
// //         });

// //         const [translation] = await translate.translate(text, {
// //             from: 'en', // Source language
// //             to: targetLanguage, // Target language
// //             format: 'html', // Format if necessary
// //         });
// //         return translation; // Return the translated text
// //     } catch (error: any) {
// //         logger.error("GOOGLE_TRANSLATE_TEXT_ERROR", {
// //             type: "error",
// //             message: error.message,
// //             stack: error.stack,
// //         });
// //          return text

// //     }
// // };

// export const translateText = async (
//     text: string,
//     targetLanguage: string
// ) => {
//     try {
//         if (targetLanguage === 'en') {
//             return he.decode(text);
//         }
//         const translate = new Translate({
//             key: await APP.HL_GOOGLE_TRANSLATE_API_KEY,
//         });

//         // Decode HTML entities first
//         const decodedText = he.decode(text);
//         const [translation] = await translate.translate(decodedText, {
//             from: 'en',
//             to: targetLanguage,
//             format: 'html',
//         });

//         // Decode again in case translation contains entities
//         return he.decode(translation);
//     } catch (error: any) {
//         logger.error('GOOGLE_TRANSLATE_TEXT_ERROR', {
//             type: 'error',
//             message: error.message,
//             stack: error.stack,
//         });
//         return he.decode(text);
//     }
// };



// export const translatePlainText = async (text: string, targetLanguage: string) => {
//     try {
//         // console.log(APP.HL_GOOGLE_TRANSLATE_API_KEY,"APP.HL_GOOGLE_TRANSLATE_API_KEY")
//         if (targetLanguage == 'en') {
//             return text
//         }
//         const translate = new Translate({
//             key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
//         });
//         const [translation] = await translate.translate(text, {
//             from: 'en', // Source language
//             to: targetLanguage, // Target language
//             format: 'text', // Format if necessary
//         });
//         return translation; // Return the translated text
//     } catch (error: any) {
//         logger.error("GOOGLE_TRANSLATE_PLAIN_TEXT_ERROR", {
//             type: "error",
//             message: error.message,
//             stack: error.stack,
//         });
//         return text
//     }
// };

// export const detectLanguage = async (text: string) => {
//     try {
//         const translate = new Translate({
//             key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
//         });
//         const [detections]: any = await translate.detect(text);
//         return Array.isArray(detections)
//             ? detections[0]?.language
//             : detections?.language;
//     } catch (error: any) {
//         logger.error("GOOGLE_DETECT_LANGUAGE_ERROR", {
//             type: "error",
//             message: error.message,
//             stack: error.stack,
//         });
//         return "en";
//     }
// };

// export const translateHealyText = async (
//     text: string,
//     sourceLanguage: string,
//     targetLanguage: string
// ) => {
//     try {
//         if (sourceLanguage === targetLanguage) {
//             return text;
//         }

//         const translate = new Translate({
//             key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
//         });
//         const [translation] = await translate.translate(text, {
//             from: sourceLanguage,
//             to: targetLanguage,
//             format: "text",
//         });
//         //console.log(translation,"translation----------------------")

//         return translation;

//     } catch (error: any) {
//         //console.log(error,"error====================")
//         logger.error("GOOGLE_TRANSLATE_HEALY_TEXT_ERROR", {
//             type: "error",
//             message: error.message,
//             stack: error.stack,
//         });
//         return text;
//     }
// };

// export const UserTranslateText = async (text: string, targetLanguage: string, sourceLanguage: string = 'en') => {
//     try {
//         if (targetLanguage == sourceLanguage) {
//             return text
//         }
//         const translate = new Translate({
//             key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
//         });
//         const [translation] = await translate.translate(text, {
//             from: sourceLanguage, // Source language
//             to: targetLanguage, // Target language
//             format: 'html', // Format if necessary
//         });
//         return translation; // Return the translated text
//     } catch (error: any) {
//         logger.error("GOOGLE_USER_TRANSLATE_TEXT_ERROR", {
//             type: "error",
//             message: error.message,
//             stack: error.stack,
//         });
//         return text;
//     }
// };

// export const AutoTranslateText = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto') => {
//     try {
//         const translate = new Translate({
//             key: await APP.HL_GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
//         });
//         // Skip if source and target are the same
//         if (sourceLanguage !== 'auto' && targetLanguage === sourceLanguage) {
//             return text;
//         }

//         // For auto-detection, don't specify source
//         const options: any = {
//             to: targetLanguage,
//         };

//         // Only add 'from' if source is not 'auto'
//         if (sourceLanguage !== 'auto') {
//             options.from = sourceLanguage;
//         }

//         // console.log(`Translating "${text}" to ${targetLanguage} with options:`, options);

//         const [translation] = await translate.translate(text, options);
//         return translation;

//     } catch (error: any) {
//         logger.error("GOOGLE_AUTO_TRANSLATE_TEXT_ERROR", {
//             type: "error",
//             message: error.message,
//             stack: error.stack,
//         });
//         return text;
//     }
// };


import OpenAI from 'openai';
import { APP } from '../constants/app.constant';
import logger from '../configs/logger.config';
import he from 'he';
import { SUPPORTED_LANGUAGES } from '../constants/workflow.constant';

/**
 * ============================================================================
 *  TRANSLATION HELPER  (OpenAI-backed)
 * ============================================================================
 *  Migrated from Google Cloud Translation to OpenAI (ChatGPT).
 *
 *  IMPORTANT: The exported function names, signatures and return types are
 *  intentionally UNCHANGED so that every existing call-site keeps working
 *  exactly as before (they still call e.g. `translateText(text, lang)` once
 *  per language). Only the underlying translation engine changed.
 *
 *  Efficiency: call-sites translate the SAME English `text` into each of the
 *  9 non-English languages via `Promise.all(langs.map(l => translateText(text,l)))`.
 *  To avoid 9 separate OpenAI calls per text, the English->all-languages path is
 *  BATCHED and CACHED: the first call for a given text fires ONE OpenAI request
 *  that returns every language; the other concurrent calls reuse that in-flight
 *  result. This makes the OpenAI path cheaper than the previous per-language
 *  Google path, and also fixes the "identical strings re-translated" issue.
 * ============================================================================
 */

const MODEL = 'gpt-4.1-mini';

const getOpenAI = () => new OpenAI({ apiKey: APP.OPENAI_API_KEY });

// Human-readable names purely to make the prompt unambiguous for the model.
const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    // zh: 'Chinese (Simplified)',
    // hi: 'Hindi',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ru: 'Russian',
    pt: 'Portuguese',
    it: 'Italian',
    // ro: 'Romanian',
};

const langName = (code: string) => LANGUAGE_NAMES[code] || code;

// All target languages we translate English content into (everything except English).
const TARGET_LANGS = SUPPORTED_LANGUAGES.filter((l) => l !== 'en');

// ---------------------------------------------------------------------------
//  Small bounded in-memory cache (per process) with TTL.
//  Keyed by `${mode}::${text}` and stores the in-flight/resolved PROMISE so
//  concurrent callers for the same text share a single OpenAI request.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_MAX_ENTRIES = 1000;
const batchCache = new Map<string, { ts: number; promise: Promise<Record<string, string>> }>();

const cacheGet = (key: string): Promise<Record<string, string>> | null => {
    const hit = batchCache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.ts > CACHE_TTL_MS) {
        batchCache.delete(key);
        return null;
    }
    return hit.promise;
};

const cacheSet = (key: string, promise: Promise<Record<string, string>>) => {
    // Simple FIFO eviction to bound memory.
    if (batchCache.size >= CACHE_MAX_ENTRIES) {
        const oldest = batchCache.keys().next().value;
        if (oldest !== undefined) batchCache.delete(oldest);
    }
    batchCache.set(key, { ts: Date.now(), promise });
};

// ---------------------------------------------------------------------------
//  Core: translate ONE English text into ALL target languages in a single call.
//  `mode` = 'html' preserves markup/entities; 'plain' is plain text.
//  Always resolves (never throws) to a full { lang: string } map; on failure it
//  falls back to the original text for every language (matching the previous
//  "return original text on error" behaviour).
// ---------------------------------------------------------------------------
const doBatchTranslate = async (text: string, mode: 'html' | 'plain'): Promise<Record<string, string>> => {
    const decoded = mode === 'html' ? he.decode(text) : text;

    const formatRule =
        mode === 'html'
            ? 'The text may contain HTML tags and entities. Preserve all HTML tags, attributes and structure exactly; only translate the human-readable text between tags.'
            : 'The text is plain text. Do not add any HTML or markdown.';

    const system = `You are a professional translator for a mental-health & wellness mobile app.
You will be given a single piece of text written in English.
Translate it into EACH of these languages and return the result as JSON.
Target languages (use these exact JSON keys):
${TARGET_LANGS.map((c) => `- "${c}" = ${langName(c)}`).join('\n')}

Rules:
- Preserve the original meaning, tone and emotional nuance. Do NOT summarize, shorten, expand or add commentary.
- Preserve line breaks, punctuation, numbers, emojis and placeholders (e.g. {name}, %s, :emoji:) exactly.
- ${formatRule}
- Return ONLY a valid JSON object, no markdown fences, no extra text.
- JSON shape: { ${TARGET_LANGS.map((c) => `"${c}": "..."`).join(', ')} }
- Keys must be exactly the language codes listed above and nothing else.`;

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: decoded },
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
    });

    const raw = response?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw) as Record<string, string>;

    // Build a complete, safe result: source English + every target language.
    const result: Record<string, string> = { en: decoded };
    for (const code of TARGET_LANGS) {
        const value = parsed?.[code];
        result[code] = typeof value === 'string' && value.trim().length > 0 ? value : decoded;
    }
    return result;
};

const getBatch = (text: string, mode: 'html' | 'plain'): Promise<Record<string, string>> => {
    const key = `${mode}::${text}`;
    const cached = cacheGet(key);
    if (cached) return cached;

    const promise = doBatchTranslate(text, mode).catch((error: any) => {
        // On failure: drop from cache so a later call can retry, and fall back
        // to the original text for every language (preserves previous behaviour).
        batchCache.delete(key);
        logger.error('OPENAI_BATCH_TRANSLATE_ERROR', {
            type: 'error',
            message: error?.message,
            stack: error?.stack,
        });
        const fallbackText = mode === 'html' ? he.decode(text) : text;
        const fallback: Record<string, string> = { en: fallbackText };
        TARGET_LANGS.forEach((c) => (fallback[c] = fallbackText));
        return fallback;
    });

    cacheSet(key, promise);
    return promise;
};

// ---------------------------------------------------------------------------
//  Single-pair translation (arbitrary source -> single target). Used for the
//  real-time Healy chat / user-facing paths. Always resolves; never throws.
// ---------------------------------------------------------------------------
const translateOne = async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    mode: 'html' | 'plain',
): Promise<string> => {
    const decoded = mode === 'html' ? he.decode(text) : text;
    const sourceDesc = sourceLanguage === 'auto' ? 'an auto-detected language' : `${langName(sourceLanguage)} (${sourceLanguage})`;

    const formatRule =
        mode === 'html'
            ? 'The text may contain HTML tags/entities; preserve all HTML exactly and only translate the human-readable text.'
            : 'The text is plain text; do not add HTML or markdown.';

    const system = `You are a professional translator for a mental-health & wellness mobile app.
Translate the given text from ${sourceDesc} into ${langName(targetLanguage)} (${targetLanguage}).

Rules:
- Preserve meaning, tone and emotional nuance. Do NOT summarize, shorten, expand or add commentary.
- Preserve line breaks, punctuation, numbers, emojis and placeholders exactly.
- ${formatRule}
- Return ONLY valid JSON: { "translation": "..." } with no extra text.`;

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: decoded },
        ],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
    });

    const raw = response?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw) as { translation?: string };
    const value = parsed?.translation;
    return typeof value === 'string' && value.trim().length > 0 ? value : decoded;
};

// ===========================================================================
//  PUBLIC API  (unchanged signatures & behaviour)
// ===========================================================================

/**
 * Translate an English `text` into `targetLanguage` (HTML-safe).
 * Returns the original (decoded) text for English or on any failure.
 */
export const translateText = async (text: string, targetLanguage: string) => {
    try {
        if (!text || !text.trim()) {
            return he.decode(text || '');
        }
        if (targetLanguage === 'en') {
            return he.decode(text);
        }
        const batch = await getBatch(text, 'html');
        return he.decode(batch[targetLanguage] ?? text);
    } catch (error: any) {
        logger.error('OPENAI_TRANSLATE_TEXT_ERROR', {
            type: 'error',
            message: error?.message,
            stack: error?.stack,
        });
        return he.decode(text);
    }
};

/**
 * Translate an English `text` into `targetLanguage` (plain text).
 * Returns the original text for English or on any failure.
 */
export const translatePlainText = async (text: string, targetLanguage: string) => {
    try {
        if (!text || !text.trim()) {
            return text;
        }
        if (targetLanguage === 'en') {
            return text;
        }
        const batch = await getBatch(text, 'plain');
        return batch[targetLanguage] ?? text;
    } catch (error: any) {
        logger.error('OPENAI_TRANSLATE_PLAIN_TEXT_ERROR', {
            type: 'error',
            message: error?.message,
            stack: error?.stack,
        });
        return text;
    }
};

/**
 * Detect the ISO-639-1 language code of `text`. Returns 'en' on failure.
 */
export const detectLanguage = async (text: string) => {
    try {
        if (!text || !text.trim()) {
            return 'en';
        }
        const openai = getOpenAI();
        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        'Detect the language of the user text. Return ONLY valid JSON of the form { "language": "xx" } where "xx" is the ISO 639-1 two-letter language code (lowercase). No other text.',
                },
                { role: 'user', content: text },
            ],
            temperature: 0,
            max_tokens: 20,
            response_format: { type: 'json_object' },
        });
        const raw = response?.choices?.[0]?.message?.content || '{}';
        const parsed = JSON.parse(raw) as { language?: string };
        const code = (parsed?.language || '').toString().trim().toLowerCase();
        return code || 'en';
    } catch (error: any) {
        logger.error('OPENAI_DETECT_LANGUAGE_ERROR', {
            type: 'error',
            message: error?.message,
            stack: error?.stack,
        });
        return 'en';
    }
};

/**
 * Translate `text` from `sourceLanguage` to `targetLanguage` (plain text).
 * Used by the real-time Healy chat. Returns original text on same-language or failure.
 */
export const translateHealyText = async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
) => {
    try {
        if (sourceLanguage === targetLanguage) {
            return text;
        }
        if (!text || !text.trim()) {
            return text;
        }
        return await translateOne(text, sourceLanguage, targetLanguage, 'plain');
    } catch (error: any) {
        logger.error('OPENAI_TRANSLATE_HEALY_TEXT_ERROR', {
            type: 'error',
            message: error?.message,
            stack: error?.stack,
        });
        return text;
    }
};

/**
 * Translate `text` into `targetLanguage` from `sourceLanguage` (default 'en', HTML-safe).
 * Returns original text on same-language or failure.
 */
export const UserTranslateText = async (
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en',
) => {
    try {
        if (targetLanguage === sourceLanguage) {
            return text;
        }
        if (!text || !text.trim()) {
            return text;
        }
        return await translateOne(text, sourceLanguage, targetLanguage, 'html');
    } catch (error: any) {
        logger.error('OPENAI_USER_TRANSLATE_TEXT_ERROR', {
            type: 'error',
            message: error?.message,
            stack: error?.stack,
        });
        return text;
    }
};

/**
 * Translate `text` into `targetLanguage`, auto-detecting the source when
 * `sourceLanguage` is 'auto' (default). Returns original text on same-language or failure.
 */
export const AutoTranslateText = async (
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto',
) => {
    try {
        if (sourceLanguage !== 'auto' && targetLanguage === sourceLanguage) {
            return text;
        }
        if (!text || !text.trim()) {
            return text;
        }
        return await translateOne(text, sourceLanguage, targetLanguage, 'plain');
    } catch (error: any) {
        logger.error('OPENAI_AUTO_TRANSLATE_TEXT_ERROR', {
            type: 'error',
            message: error?.message,
            stack: error?.stack,
        });
        return text;
    }
};
