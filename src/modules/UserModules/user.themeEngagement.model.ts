import mongoose, { Schema } from "mongoose";
import { USER_STATUS } from "../../constants/workflow.constant";

const themeEngagementSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    theme_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'themes',
    },
    theme_name: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: USER_STATUS.ACTIVE,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('themeEngagement', themeEngagementSchema);