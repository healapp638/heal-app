const messages: any = {
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

export const getMessage = (lang: string, key: string): string => {
    return messages?.[lang]?.[key] || messages['en'][key];
};