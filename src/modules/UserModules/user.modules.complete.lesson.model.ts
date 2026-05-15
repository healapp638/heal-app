import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';

const completed_lesson_schema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'mcqExercise' },
        // exercise_details_id: { type: mongoose.Schema.Types.ObjectId, ref: 'exercise_detail' },
        phase_id: { type: mongoose.Schema.Types.ObjectId, ref: 'phase' },
        status: { type: Number, default: USER_STATUS.ACTIVE },
        reflection: { type: String, default: "" }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model('completed_lesson', completed_lesson_schema);

