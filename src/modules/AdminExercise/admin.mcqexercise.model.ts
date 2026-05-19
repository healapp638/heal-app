import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';

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
const mcqOptionSchema = new mongoose.Schema(
    {
        option: langSchema,
    },
    {
        _id: true,
        versionKey: false,
    }
);

const mcqexerciseSchema = new mongoose.Schema(
    {
        title: langSchema,
        description: langSchema,
        phase_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', default: null },
        mcq: [mcqOptionSchema],
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model('mcqExercise', mcqexerciseSchema);

