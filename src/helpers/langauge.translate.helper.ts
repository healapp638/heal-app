import { Translate } from '@google-cloud/translate';


const translate = new Translate({
    key: 'AIzaSyDo-P-1y_BlFP_amUtSxcFtksN_OTkxpi4' // Replace with your actual API key
});
// const translate = new Translate({
//     key: APP.GOOGLE_TRANSLATE_API_KEY // Replace with your actual API key
// });
// console.log(APP.GOOGLE_TRANSLATE_API_KEY, "APP.GOOGLE_TRANSLATE_API_KEY")



export const translateText = async (text: string, targetLanguage: string) => {
    try {
        if (targetLanguage == 'en') {
            return text
        }
        const [translation] = await translate.translate(text, {
            from: 'en', // Source language
            to: targetLanguage, // Target language
            format: 'html', // Format if necessary
        });
        return translation; // Return the translated text
    } catch (errors) {
        console.log(errors)
        return text
    }
};

export const translatePlainText = async (text: string, targetLanguage: string) => {
    try {
        if (targetLanguage == 'en') {
            return text
        }
        const [translation] = await translate.translate(text, {
            from: 'en', // Source language
            to: targetLanguage, // Target language
            format: 'text', // Format if necessary
        });
        return translation; // Return the translated text
    } catch (errors) {
        console.log(errors)
        return text
    }
};

export const UserTranslateText = async (text: string, targetLanguage: string, sourceLanguage: string = 'en') => {
    try {
        if (targetLanguage == sourceLanguage) {
            return text
        }
        const [translation] = await translate.translate(text, {
            from: sourceLanguage, // Source language
            to: targetLanguage, // Target language
            format: 'html', // Format if necessary
        });
        return translation; // Return the translated text
    } catch (errors) {
        console.log(errors)
        return text
    }
};

export const AutoTranslateText = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto') => {
    try {
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
        
    } catch (errors) {
        console.log(`Translation error for "${text}" to ${targetLanguage}:`, errors);
        return text;
    }
};


