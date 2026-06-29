import mongoose from "mongoose";

const langSchema = {
    en: { type: String, default: '' },
    zh: { type: String, default: '' },
    hi: { type: String, default: '' },
    es: { type: String, default: '' },
    fr: { type: String, default: '' },
    de: { type: String, default: '' },
    ru: { type: String, default: '' },
    pt: { type: String, default: '' },
    it: { type: String, default: '' },
    ro: { type: String, default: '' },
};

const conversationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        title: langSchema,
        // total_messages: {
        //     type: Number,
        //     default: 0,
        // },
        starter_question: langSchema,
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