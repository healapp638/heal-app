import { Schema, model } from 'mongoose';
import { USER_STATUS } from '../../constants/workflow.constant';

const deeplinkmodel = new Schema({
    code: {
        type: String,
        default: ''
    },
    affirmation_id:{
        type:Schema.Types.ObjectId,
    },
    status: {
        type: Number,
        default: USER_STATUS.ACTIVE
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
        versionKey: false,
        timestamps: true
    }
);

export default model('deeplinkmodel', deeplinkmodel);