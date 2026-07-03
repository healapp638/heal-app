import { Schema, model } from 'mongoose';

const langSchema = {
    en: { type: String, default: '' },
    // zh: { type: String, default: '' },
    // hi: { type: String, default: '' },
    es: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
    ru: { type: String, default: '' },
    pt: { type: String, default: '' },
    it: { type: String, default: '' },
    // ro: { type: String, default: '' },
};

const FAQ = new Schema(
    {
        question: langSchema,
        answer: langSchema,
        status: {
            type: Number,
            default: 1
        },
    },
    { timestamps: true, versionKey: false }
)
export default model('faq', FAQ)