import mongoose from "mongoose";
import { USER_STATUS } from "../../constants/workflow.constant";

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

const userJournalSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
    },
    feeling: {
        type: langSchema
    },
    title: {
        type: langSchema
    },
    description: {
        type: langSchema,
    },
    status: {
        type: Number,
        default: USER_STATUS.ACTIVE
    }
}, { timestamps: true });

const userJournalModel = mongoose.model('journel', userJournalSchema);

export default userJournalModel;