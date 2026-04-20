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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGUAGES = exports.translateText = exports.translateKeys = void 0;
//***************It Can Be Use to Translate Response Messages and As well as database stored information as well ********************/
// eslint-disable-next-line @typescript-eslint/no-require-imports
const translatte = require('translatte');
const LANGUAGES = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh': 'Chinese (Simplified)',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'he': 'Hebrew',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};
exports.LANGUAGES = LANGUAGES;
//for simple translation 
const translateText = (text, targetLanguage) => {
    return new Promise((resolve) => {
        translatte(text, { to: targetLanguage })
            .then((res) => {
            resolve(res.text); // Return translated text
        })
            .catch((err) => {
            console.log(err, "translate_err");
            resolve(err); // Return error if translation fails
        });
    });
};
exports.translateText = translateText;
//Example 
//*****************for array of objects ******************************
// Translate content and test fields in result array
//   const translatedResults = await Promise.all(result.map(async (data: any) => {
//     return commonHelper.translateKeys(data, ['content', 'test'], lang);  //content amd test are feild name to be translate
// }));
//************for simple objects**********************
// const translatedResource = await commonHelper.translateKeys(resource.data, ['name'], lang); //name is feild name to be translate 
//*******Ends Example 
const translateKeys = (data, keys, lang) => __awaiter(void 0, void 0, void 0, function* () {
    const translatedData = Object.assign({}, data);
    // Helper function to translate and update a key within an object
    const translateAndUpdate = (obj, key, lang) => __awaiter(void 0, void 0, void 0, function* () {
        if (obj[key]) {
            try {
                const translationResult = yield translateText(obj[key], lang);
                if (translationResult) {
                    obj[key] = translationResult;
                }
                else {
                    console.error(`Translation failed for key: ${key}`);
                }
            }
            catch (err) {
                console.error(`Error translating key: ${key}`, err);
            }
        }
    });
    for (const key of keys) {
        if (data[key]) {
            // Translate top-level keys
            yield translateAndUpdate(translatedData, key, lang);
        }
        else {
            // Check for nested keys
            for (const subKey of Object.keys(data)) {
                if (typeof data[subKey] === 'object' && data[subKey] !== null) {
                    if (data[subKey][key]) {
                        yield translateAndUpdate(data[subKey], key, lang);
                    }
                }
            }
        }
    }
    return translatedData;
}); //ends
exports.translateKeys = translateKeys;
