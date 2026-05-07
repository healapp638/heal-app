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
const user_affirmation_controller_1 = __importDefault(require("./user.affirmation.controller"));
const response_util_1 = require("../../utils/response.util");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// router.post('/create', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const controller = new ModuleController(req, res)
//     const result: ApiResponse = await controller.createAffirmation();
//     return showOutput(res, result, result.code)
// });
// router.delete('/delete_theme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
//     const { themeId, status } = req.body
//     const controller = new ModuleController(req, res)
//     const result: ApiResponse = await controller.deleteTheme({ themeId, status });
//     return showOutput(res, result, result.code)
// });
router.get('/getAIAffirmation', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_affirmation_controller_1.default(req, res);
    const result = yield controller.getAIAffirmation();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/addView', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { affirmation_id } = req.body;
    const controller = new user_affirmation_controller_1.default(req, res);
    const result = yield controller.addView({ affirmation_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/getAffirmationListing', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort_column, sort_direction, page, limit } = req.query;
    const controller = new user_affirmation_controller_1.default(req, res);
    const result = yield controller.getAffirmationListing(sort_column, sort_direction, page, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/likeUnlikeAffirmation', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { affirmation_id } = req.body;
    const controller = new user_affirmation_controller_1.default(req, res);
    const result = yield controller.likeUnlikeAffirmation({ affirmation_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/likedAffirmationList', auth_middleware_1.verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort_column, sort_direction, page, limit } = req.query;
    const controller = new user_affirmation_controller_1.default(req, res);
    const result = yield controller.likedAffirmationList(sort_column, sort_direction, page, limit);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
