"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const excelContent = new mongoose_1.Schema({
    excelTheme: {
        type: String,
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)('excel_content', excelContent);
