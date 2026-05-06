"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startShowingOfYourSelf = exports.timeYouCommit = exports.likeToFellMore = exports.howFellingLatelyOptions = exports.bringsYouHereOptions = exports.SUPPORTED_LANGUAGES = exports.languages = exports.EMAIL_SEND_TYPE = exports.DEACTIVATE_BY = exports.USER_STATUS = exports.ROLE = void 0;
const interfaces_util_1 = require("../utils/interfaces.util");
const ROLE = {
    ADMIN: 1,
    SUB_ADMIN: 2,
    USER: 3,
};
exports.ROLE = ROLE;
const USER_STATUS = {
    ACTIVE: 1,
    DELETED: 2,
    DEACTIVATED: 3,
};
exports.USER_STATUS = USER_STATUS;
const DEACTIVATE_BY = {
    USER: 'user',
    ADMIN: 'admin',
};
exports.DEACTIVATE_BY = DEACTIVATE_BY;
const EMAIL_SEND_TYPE = interfaces_util_1.EmailSendType;
exports.EMAIL_SEND_TYPE = EMAIL_SEND_TYPE;
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
};
exports.languages = languages;
const SUPPORTED_LANGUAGES = ["en", "zh", "hi", "es", "fr", "de", "ru", "pt", "it", "ro"];
exports.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
const bringsYouHereOptions = ['romantic relationship', 'family', 'friendship', 'loneliness', 'self confident', 'just need to talk'];
exports.bringsYouHereOptions = bringsYouHereOptions;
const howFellingLatelyOptions = ['Overwhelmed', 'Emotionally drained', 'Overthinking everything', 'Feeling stuck', 'Lost or unsure about life', 'Just looking for more clarity'];
exports.howFellingLatelyOptions = howFellingLatelyOptions;
const likeToFellMore = ['Peace of mind', 'Confidence', 'Emotional strength', 'Clarity about my life', 'Balance', 'Motivation'];
exports.likeToFellMore = likeToFellMore;
const timeYouCommit = ['Just 2 minutes', 'Around 5 minutes', '10 minutes or more', 'Only when I need it'];
exports.timeYouCommit = timeYouCommit;
const startShowingOfYourSelf = ['I’m just exploring for now', 'I’m willing to try', 'Yes, I’m ready to start'];
exports.startShowingOfYourSelf = startShowingOfYourSelf;
