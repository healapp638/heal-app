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
const admin_common_controller_1 = __importDefault(require("./admin.common.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const { addToMulter } = middlewares_1.default.fileUpload.multer;
const router = express_1.default.Router();
router.post('/question', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, answer } = req.body;
    const controller = new admin_common_controller_1.default(req, res);
    const result = yield controller.addQuestion({ question, answer });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.put('/question', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { answer, question, question_id } = req.body;
    const controller = new admin_common_controller_1.default(req, res);
    const result = yield controller.updateQuestion({ answer, question, question_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/question', addToMulter.none(), verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question_id } = req.body;
    const controller = new admin_common_controller_1.default(req, res);
    const result = yield controller.deleteQuestion(question_id);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.put('/common_content', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { about, privacy_policy, terms_conditions } = req.body;
    const controller = new admin_common_controller_1.default(req, res);
    const result = yield controller.updateCommonContent({ about, privacy_policy, terms_conditions });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
