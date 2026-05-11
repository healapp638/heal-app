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
const user_auth_controller_1 = __importDefault(require("./user.auth.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const rate_limit_middleware_1 = require("../../middlewares/rate.limit.middleware");
const { verifyTokenUser } = middlewares_1.default.auth;
const { multer } = middlewares_1.default.fileUpload;
const router = express_1.default.Router();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf, fullName, country, email, dob, password, language } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.register({ hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf, fullName, country, email, dob, password, language });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/login', rate_limit_middleware_1.ratLimiting, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, language } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.login({ email, password, language });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/social_login', multer.addToMulter.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login_source, social_auth, email, name, os_type, language } = req.body;
    const userAuthController = new user_auth_controller_1.default(req, res);
    const result = yield userAuthController.socialLogin(login_source, social_auth, email, name, os_type, language);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/forgot_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.forgotPassword({ email });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/reset_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, new_password, otp } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.resetPassword({ email, new_password, otp });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/verify_otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.verifyOtp({ email, otp, password });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/resend_otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.resendOtp({ email });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/change_password', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { old_password, new_password } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.changePassword({ old_password, new_password });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/details', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.getUserDetails();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/profile', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, country, dob, profilePic, language } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.updateUserProfile({ fullName, country, dob, profilePic, language });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete_deactivate', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, reason } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.deleteOrDeactivateAccount({ status, reason });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/refresh_token', multer.addToMulter.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.body;
    const commonController = new user_auth_controller_1.default(req, res);
    const result = yield commonController.refreshToken(refresh_token);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuthController = new user_auth_controller_1.default(req, res);
    const result = yield userAuthController.logoutUser();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/upload_file', multer.addToMulter.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.uploadFile(req.file);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/details_user', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.getUserDetailsUser();
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.put('/complete_onboarding', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { language, hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf } = req.body;
    const controller = new user_auth_controller_1.default(req, res);
    const result = yield controller.completeOnboarding({ language, hearAboutUs, bringsYouHere, howFellingLately, likeToFellMore, timeYouCommit, startShowingOfYourSelf });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
