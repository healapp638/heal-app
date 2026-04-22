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
const admin_theme_controller_1 = __importDefault(require("./admin.theme.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.post('/create_theme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, imgUrl } = req.body;
    const controller = new admin_theme_controller_1.default(req, res);
    const result = yield controller.createTheme({ title, description, imgUrl });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/update_theme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, imgUrl, lang, themeId } = req.body;
    const controller = new admin_theme_controller_1.default(req, res);
    const result = yield controller.updateTheme({ title, description, imgUrl, lang, themeId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete_theme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeId } = req.body;
    const controller = new admin_theme_controller_1.default(req, res);
    const result = yield controller.deleteTheme({ themeId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/list_theme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang } = req.query;
    const controller = new admin_theme_controller_1.default(req, res);
    const result = yield controller.listTheme(page, limit, search, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/theme_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeId, lang } = req.query;
    const controller = new admin_theme_controller_1.default(req, res);
    const result = yield controller.themeDetails(themeId, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
