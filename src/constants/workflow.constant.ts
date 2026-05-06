import { EmailSendType, RoleType } from "../utils/interfaces.util";


const ROLE: RoleType = {
    ADMIN: 1,
    SUB_ADMIN: 2,
    USER: 3,
};

const USER_STATUS = {
    ACTIVE: 1,
    DELETED: 2,
    DEACTIVATED: 3,
};


const DEACTIVATE_BY = {
    USER: 'user',
    ADMIN: 'admin',
};

const EMAIL_SEND_TYPE = EmailSendType

const languages = {
    ENGLISH: "en",
    CHINESE: "zh",
    SPANISH: "es",
    FRENCH: "fr",
    HINDI: "hi",
    GERMAN: "de",
    RUSSIAN: "ru",
    PORTUGUESE: "pt",
    ITALIAN: "it",
    ROMANIAN: "ro"
}

const SUPPORTED_LANGUAGES = ["en", "zh", "hi", "es", "fr", "de", "ru", "pt", "it", "ro"];

const bringsYouHereOptions = ['romantic relationship', 'family', 'friendship', 'loneliness', 'self confident', 'just need to talk'];
const howFellingLatelyOptions = ['Overwhelmed', 'Emotionally drained', 'Overthinking everything', 'Feeling stuck', 'Lost or unsure about life', 'Just looking for more clarity'];
const likeToFellMore = ['Peace of mind', 'Confidence', 'Emotional strength', 'Clarity about my life', 'Balance', 'Motivation'];
const timeYouCommit = ['Just 2 minutes', 'Around 5 minutes', '10 minutes or more', 'Only when I need it'];
const startShowingOfYourSelf = ['I’m just exploring for now', 'I’m willing to try', 'Yes, I’m ready to start'];

export {
    ROLE,
    USER_STATUS,
    DEACTIVATE_BY,
    EMAIL_SEND_TYPE,
    languages,
    SUPPORTED_LANGUAGES,
    bringsYouHereOptions,
    howFellingLatelyOptions,
    likeToFellMore,
    timeYouCommit,
    startShowingOfYourSelf
};

