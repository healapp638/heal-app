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
const user_journal_controller_1 = __importDefault(require("./user.journal.controller"));
const response_util_1 = require("../../utils/response.util");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/create_journal', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { feeling, title, description } = req.body;
    const controller = new user_journal_controller_1.default(req, res);
    const result = yield controller.createJournal({ feeling, title, description });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/journal_list', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search_key } = req.query;
    const controller = new user_journal_controller_1.default(req, res);
    const result = yield controller.journalList(page, limit, search_key);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.put('/update_journal', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { journal_id, feeling, title, description } = req.body;
    const controller = new user_journal_controller_1.default(req, res);
    const result = yield controller.updateJournal({ journal_id, feeling, title, description });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete_journal', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { journal_id } = req.body;
    const controller = new user_journal_controller_1.default(req, res);
    const result = yield controller.deleteJournal({ journal_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/journal_detail', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { journal_id } = req.query;
    const controller = new user_journal_controller_1.default(req, res);
    const result = yield controller.journalDetail(journal_id);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/journal_list_by_date', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    const controller = new user_journal_controller_1.default(req, res);
    const result = yield controller.journalListByDate(date);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/journal_map_list', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_journal_controller_1.default(req, res);
    const result = yield controller.journalMapList();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
