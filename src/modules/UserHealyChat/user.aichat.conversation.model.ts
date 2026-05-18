import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("user_conversations", conversationSchema);