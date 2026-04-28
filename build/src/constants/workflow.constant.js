"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_LANGUAGES = exports.languages = exports.EMAIL_SEND_TYPE = exports.DEACTIVATE_BY = exports.USER_STATUS = exports.ROLE = void 0;
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
