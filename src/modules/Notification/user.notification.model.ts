import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
    title: {
        type: String,
        default:''
    },
    message: {
        type: String,
        default:''
    },
    type: {
        type: String,
        default: 'any'
    },
    from: {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: ''
        },
        // user_type: {
        //     type: Number,
        //     default: 1
        // }
    },
    to: {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: ''
        },
        // user_type: {
        //     type: Number,
        //     default: 1
        // }
    },
    is_read: {
        type: Number,
        default: 2, //unread
        Comment: "1 for read 2 for unread"
    },
    status:{
        type:Number,
        default : 1
    }
},    {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    timestamps: true
});

export default model('notification', NotificationSchema)