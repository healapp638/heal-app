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

const phaseSchema = new mongoose.Schema(
    {
        subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', default: null },
        title: langSchema,
        points: { type: Number, default: 0 },
        reflection: langSchema,
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    { timestamps: true, versionKey: false }
);

phaseSchema.index(
  { subModuleId: 1, "title.en": 1 },
  { unique: true }
);

export default mongoose.model('Phase', phaseSchema);
