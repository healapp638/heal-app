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

const affirmationSchema = new mongoose.Schema(
    {
        affirmation: langSchema,
        status: { type: Number, default: USER_STATUS.ACTIVE },
        type:{type : String,default:"Admin"},
        user_id:{type:Array,default:[]}
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model('affirmation', affirmationSchema);
