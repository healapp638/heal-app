import mongoose, { Schema, model } from 'mongoose';

const likeAffirmationSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        affirmation_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"affirmation"
        },
        status: {
            type: Number,
            default: 1
        },
    },
    { timestamps: true, versionKey: false }
)
export default model('likeAffirmation', likeAffirmationSchema)