"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommonContent = new mongoose_1.Schema({
    about: {
        type: String,
        default: ''
    },
    privacy_policy: {
        type: String,
        default: ''
    },
    terms_conditions: {
        type: String,
        default: ''
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)('common_content', CommonContent);
