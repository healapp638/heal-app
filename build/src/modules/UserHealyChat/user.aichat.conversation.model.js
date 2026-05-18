"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
    },
    title: {
        type: String,
        default: "New Chat",
        trim: true,
    },
    // total_messages: {
    //     type: Number,
    //     default: 0,
    // },
    status: {
        type: Number,
        default: 1, // 1 active, 2 deleted
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("user_conversations", conversationSchema);
