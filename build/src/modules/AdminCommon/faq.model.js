"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FAQ = new mongoose_1.Schema({
    question: {
        type: String,
        default: ''
    },
    answer: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 1
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)('faq', FAQ);
