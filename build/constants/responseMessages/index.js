"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_messages_1 = __importDefault(require("./admin.messages"));
const user_messages_1 = __importDefault(require("./user.messages"));
const common_messages_1 = __importDefault(require("./common.messages"));
const common_messages_2 = __importDefault(require("./common.messages"));
exports.default = {
    admin: admin_messages_1.default,
    users: user_messages_1.default,
    common: common_messages_1.default,
    middleware: Object.assign({}, common_messages_2.default.middleware),
};
