import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';

const recentHomeThemeSchema = new mongoose.Schema(
    {
        homeTheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'homeThemeschemas', default: null },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    { timestamps: true, versionKey: false }
);


export default mongoose.model('recentHomeTheme', recentHomeThemeSchema);
