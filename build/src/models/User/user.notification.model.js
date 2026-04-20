"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'any'
    },
    from: {
        user_id: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: ''
        },
        // user_type: {
        //     type: Number,
        //     default: 1
        // }
    },
    to: {
        user_id: {
            type: mongoose_1.Schema.Types.ObjectId,
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
    status: {
        type: Number,
        default: 1
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    timestamps: true
});
exports.default = (0, mongoose_1.model)('notification', NotificationSchema);
