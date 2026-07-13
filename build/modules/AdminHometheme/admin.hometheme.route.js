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
const admin_hometheme_controller_1 = __importDefault(require("./admin.hometheme.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.post('/createCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, imgUrl } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.createCategoryTheme({ title, imgUrl });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/updateCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, imgUrl, lang, themeCategoryId } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.updateCategoryTheme({ title, imgUrl, lang, themeCategoryId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/deleteCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeCategoryId, status } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.deleteCategoryTheme({ themeCategoryId, status });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/listCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.listCategoryTheme(page, limit, search, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/themeCategoryDetails', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeCategoryId, lang } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.themeCategoryDetails(themeCategoryId, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/createCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, imgUrl } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.createCategoryTheme({ title, imgUrl });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/updateCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, imgUrl, lang, themeCategoryId } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.updateCategoryTheme({ title, imgUrl, lang, themeCategoryId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/deleteCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeCategoryId, status } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.deleteCategoryTheme({ themeCategoryId, status });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/listCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.listCategoryTheme(page, limit, search, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/themeCategoryDetails', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeCategoryId, lang } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.themeCategoryDetails(themeCategoryId, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/createCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, imgUrl } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.createCategoryTheme({ title, imgUrl });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/updateCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, imgUrl, lang, themeCategoryId } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.updateCategoryTheme({ title, imgUrl, lang, themeCategoryId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/deleteCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeCategoryId, status } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.deleteCategoryTheme({ themeCategoryId, status });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/listCategoryTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.listCategoryTheme(page, limit, search, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/themeCategoryDetails', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeCategoryId, lang } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.themeCategoryDetails(themeCategoryId, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/createHomeTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryTheme_id, imgUrl, homeImgUrl } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.createHomeTheme({ categoryTheme_id, imgUrl, homeImgUrl });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/updateHomeTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hometheme_id, imgUrl, homeImgUrl } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.updateHomeTheme({ hometheme_id, imgUrl, homeImgUrl });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/deleteHomeTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hometheme_id, status } = req.body;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.deleteHomeTheme({ hometheme_id, status });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/listHomeTheme', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryTheme_id, page, limit } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.listHomeTheme(categoryTheme_id, page, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/homeThemeDetails', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hometheme_id } = req.query;
    const controller = new admin_hometheme_controller_1.default(req, res);
    const result = yield controller.homeThemeDetails(hometheme_id);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
