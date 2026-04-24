"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_modules_controller_1 = __importDefault(require("./user.modules.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenUser } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.post('/theme_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cursor, limit } = req.body;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.themeList({ cursor, limit });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
