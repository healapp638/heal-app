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
const admin_auth_controller_1 = __importDefault(require("./admin.auth.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const { multer } = middlewares_1.default.fileUpload;
const router = express_1.default.Router();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.login({ email, password });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/forgot_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.forgotPassword({ email });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/reset_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, new_password, otp } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.resetPassword({ email, new_password, otp });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/verify_otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.verifyOtp({ email, otp });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/resend_otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.resendOtp({ email });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/change_password', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { old_password, new_password } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.changePassword({ old_password, new_password });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.getAdminDetails();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.put('/profile', multer.addToMulter.single('profile_pic'), verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, phone_number, country_code, greet_msg } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.updateAdminProfile(first_name, last_name, phone_number, country_code, greet_msg, req.file);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/refresh_token', multer.addToMulter.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.body;
    const controller = new admin_auth_controller_1.default(req, res);
    const result = yield controller.refreshToken(refresh_token);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuthController = new admin_auth_controller_1.default(req, res);
    const result = yield userAuthController.logoutUser();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
