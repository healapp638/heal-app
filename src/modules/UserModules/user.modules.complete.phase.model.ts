import mongoose from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';



const completed_phase_schema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        phase_id: { type: mongoose.Schema.Types.ObjectId, ref: 'phase' },
        sub_module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'submodule' },
        status: { type: Number, default: USER_STATUS.ACTIVE },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model('completed_phase', completed_phase_schema);

