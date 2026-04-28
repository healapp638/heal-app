import { Schema, model } from 'mongoose';

const langSchema = {
    en: { type: String, default: '' },
    zh: { type: String, default: '' },
    hi: { type: String, default: '' },
    es: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
    ru: { type: String, default: '' },
    pt: { type: String, default: '' },
    it: { type: String, default: '' },
    ro: { type: String, default: '' },
};

const CommonContent = new Schema(
    {
        about: langSchema,
        privacy_policy: langSchema,
        terms_conditions: langSchema,

    },
    { timestamps: true, versionKey: false }
)
export default model('common_content', CommonContent)