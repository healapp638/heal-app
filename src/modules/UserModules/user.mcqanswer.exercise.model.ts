import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';


const mcqAnswerSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },

        mcq_exercise_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mcqExercise',
            required: true,
        },

        mcq_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('mcqAnswerExercise', mcqAnswerSchema);