import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversations",
            required: true,
            index: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ["user", "ai"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        unix: {
            type: String,
            required: true
        },
        sequence: {
            type: Number,
            required: true,
        },
        status: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ conversation_id: 1, sequence: 1 });

export default mongoose.model("user_messages", messageSchema);