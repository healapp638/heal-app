"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = void 0;
const messages = {
    en: {
        USER_NOT_FOUND: "User not found",
        INVALID_CREDENTIALS: "Invalid email or password",
    },
    es: {
        USER_NOT_FOUND: "Usuario no encontrado",
        INVALID_CREDENTIALS: "Correo o contraseña inválidos",
    },
    fr: {
        USER_NOT_FOUND: "Utilisateur non trouvé",
        INVALID_CREDENTIALS: "Email ou mot de passe invalide",
    }
};
const getMessage = (lang, key) => {
    var _a;
    return ((_a = messages === null || messages === void 0 ? void 0 : messages[lang]) === null || _a === void 0 ? void 0 : _a[key]) || messages['en'][key];
};
exports.getMessage = getMessage;
