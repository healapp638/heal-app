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
router.get('/theme_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cursor, limit } = req.query;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.themeList(cursor, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/module_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { theme_id, cursor, limit } = req.query;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.moduleList(theme_id, cursor, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/phase_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sub_module_id, cursor, limit } = req.query;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.phaseList(sub_module_id, cursor, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/exercise_detail_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phase_id, cursor, limit } = req.query;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.exerciseDetailList(phase_id, cursor, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/exercise_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { exercise_detail_id, cursor, limit } = req.query;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.exerciseList(exercise_detail_id, cursor, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/complete_lesson', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { exercise_id, exercise_details_id, phase_id, reflection } = req.body;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.completeLesson({ exercise_id, exercise_details_id, phase_id, reflection });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/start_lesson', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phase_id } = req.body;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.startLesson({ phase_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/start_sub_module_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cursor, limit } = req.query;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.startSubModuleList(cursor, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/end_sub_module_list', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cursor, limit } = req.query;
    const controller = new user_modules_controller_1.default(req, res);
    const result = yield controller.endSubModuleList(cursor, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
