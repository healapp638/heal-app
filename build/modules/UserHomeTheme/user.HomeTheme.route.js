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
const user_HomeTheme_controller_1 = __importDefault(require("./user.HomeTheme.controller"));
const response_util_1 = require("../../utils/response.util");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/addUserTheme', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { homeTheme_id } = req.body;
    const controller = new user_HomeTheme_controller_1.default(req, res);
    const result = yield controller.addUserTheme({ homeTheme_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/getHomeThemeCategory', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_HomeTheme_controller_1.default(req, res);
    const result = yield controller.getHomeThemeCategory();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/getHomeThemeListing', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter, categoryTheme_id, page, limit } = req.query;
    const controller = new user_HomeTheme_controller_1.default(req, res);
    const result = yield controller.getHomeThemeListing(filter, categoryTheme_id, page, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/getMyTheme', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_HomeTheme_controller_1.default(req, res);
    const result = yield controller.getMyTheme();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
