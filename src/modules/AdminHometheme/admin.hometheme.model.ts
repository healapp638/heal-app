import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';

const homeThemeSchema = new mongoose.Schema(
    {
        imgUrl: { type: String, default: '' },
        categoryTheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'homeThemeCategory', default: null },
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    { timestamps: true, versionKey: false }
);


export default mongoose.model('homeThemeSchema', homeThemeSchema);
