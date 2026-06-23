import { Translate } from '@google-cloud/translate';
import { APP } from '../constants/app.constant';
import logger from '../configs/logger.config';
import he from 'he';


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


