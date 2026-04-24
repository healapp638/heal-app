import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';



const start_lesson_schema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'exercise' },
        exercise_details_id: { type: mongoose.Schema.Types.ObjectId, ref: 'exercise_detail' },
        phase_id: { type: mongoose.Schema.Types.ObjectId, ref: 'phase' },
        sub_module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'sub_module' },
        lesson_status: { type: String, default: 'start' },
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model('start_lesson', start_lesson_schema);

