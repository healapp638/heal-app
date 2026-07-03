import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';

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

const themeSchema = new mongoose.Schema(
    {
        imgUrl: { type: String, default: '' },
        title: langSchema,
        description: langSchema,
        status: { type: Number, default: USER_STATUS.ACTIVE },
        // sequence: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false }
);

themeSchema.index({ "title.en": 1 }, { unique: true });

export default mongoose.model('Theme', themeSchema);
