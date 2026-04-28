import { Translate } from '@google-cloud/translate';


const translate = new Translate({
    key: 'AIzaSyDo-P-1y_BlFP_amUtSxcFtksN_OTkxpi4' // Replace with your actual API key
});


const translateText = async (text: string, targetLanguage: string) => {
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

export default translateText
