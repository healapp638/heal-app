"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workflow_constant_1 = require("../../constants/workflow.constant");
const deeplinkmodel = new mongoose_1.Schema({
    code: {
        type: String,
        default: ''
    },
    affirmation_id: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    status: {
        type: Number,
        default: workflow_constant_1.USER_STATUS.ACTIVE
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
    timestamps: true
});
exports.default = (0, mongoose_1.model)('deeplinkmodel', deeplinkmodel);
