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

const exerciseDetailsSchema = new mongoose.Schema(
    {
        reading_title: langSchema,
        reading_description: langSchema,
        concept_title: langSchema,
        concept_description: langSchema,
        reflection: langSchema,
        phase_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', default: null },
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model('ExerciseDetails', exerciseDetailsSchema);
