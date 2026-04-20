"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showOutput = exports.showResponse = void 0;
const showResponse = (status, message, data = null, code = null) => {
    const response = {
        status: status,
        message: message,
        code: 400
    };
    if (code !== null) {
        response.code = code;
    }
    if (data !== null) {
        response.data = data;
    }
    return response;
};
exports.showResponse = showResponse;
const showOutput = (res, showResponse, code) => {
    var _a;
    // delete response.code;
    const res_msg = {
        message: showResponse.message,
        data: (_a = showResponse.data) !== null && _a !== void 0 ? _a : {}
    };
    res.status(code).json(res_msg);
};
exports.showOutput = showOutput;
