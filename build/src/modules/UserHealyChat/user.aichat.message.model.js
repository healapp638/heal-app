"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
const messageSchema = new mongoose_1.default.Schema({
    conversation_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "conversations",
        required: true,
        index: true,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true,
    },
    message: langSchema,
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
}, {
    timestamps: true,
});
messageSchema.index({ conversation_id: 1, sequence: 1 });
exports.default = mongoose_1.default.model("user_messages", messageSchema);
