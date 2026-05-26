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
exports.AutoTranslateText = exports.UserTranslateText = exports.translateHealyText = exports.detectLanguage = exports.translatePlainText = exports.translateText = void 0;
const translate_1 = require("@google-cloud/translate");
const translate = new translate_1.Translate({
    key: 'AIzaSyDo-P-1y_BlFP_amUtSxcFtksN_OTkxpi4' // Replace with your actual API key
});
// const translate = new Translate({
//     key: APP.GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
// });
// console.log(APP.GOOGLE_TRANSLATE_API_KEY, "APP.GOOGLE_TRANSLATE_API_KEY")
const translateText = (text, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (targetLanguage == 'en') {
            return text;
        }
        const [translation] = yield translate.translate(text, {
            from: 'en', // Source language
            to: targetLanguage, // Target language
            format: 'html', // Format if necessary
        });
        return translation; // Return the translated text
    }
    catch (errors) {
        console.log(errors);
        return text;
    }
});
exports.translateText = translateText;
const translatePlainText = (text, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (targetLanguage == 'en') {
            return text;
        }
        const [translation] = yield translate.translate(text, {
            from: 'en', // Source language
            to: targetLanguage, // Target language
            format: 'text', // Format if necessary
        });
        return translation; // Return the translated text
    }
    catch (errors) {
        console.log(errors);
        return text;
    }
});
exports.translatePlainText = translatePlainText;
const detectLanguage = (text) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [detections] = yield translate.detect(text);
        return Array.isArray(detections)
            ? (_a = detections[0]) === null || _a === void 0 ? void 0 : _a.language
            : detections === null || detections === void 0 ? void 0 : detections.language;
    }
    catch (error) {
        console.log(error);
        return "en";
    }
});
exports.detectLanguage = detectLanguage;
const translateHealyText = (text, sourceLanguage, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (sourceLanguage === targetLanguage) {
            return text;
        }
        const [translation] = yield translate.translate(text, {
            from: sourceLanguage,
            to: targetLanguage,
            format: "text",
        });
        return translation;
    }
    catch (error) {
        console.log(error);
        return text;
    }
});
exports.translateHealyText = translateHealyText;
const UserTranslateText = (text_1, targetLanguage_1, ...args_1) => __awaiter(void 0, [text_1, targetLanguage_1, ...args_1], void 0, function* (text, targetLanguage, sourceLanguage = 'en') {
    try {
        if (targetLanguage == sourceLanguage) {
            return text;
        }
        const [translation] = yield translate.translate(text, {
            from: sourceLanguage, // Source language
            to: targetLanguage, // Target language
            format: 'html', // Format if necessary
        });
        return translation; // Return the translated text
    }
    catch (errors) {
        console.log(errors);
        return text;
    }
});
exports.UserTranslateText = UserTranslateText;
const AutoTranslateText = (text_1, targetLanguage_1, ...args_1) => __awaiter(void 0, [text_1, targetLanguage_1, ...args_1], void 0, function* (text, targetLanguage, sourceLanguage = 'auto') {
    try {
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
    catch (errors) {
        console.log(`Translation error for "${text}" to ${targetLanguage}:`, errors);
        return text;
    }
});
exports.AutoTranslateText = AutoTranslateText;
