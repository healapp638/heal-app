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
const user_subscription_controller_1 = __importDefault(require("./user.subscription.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenUser } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.post('/initial_purchased_ios_subscription', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { package_name, original_transaction_id, signedPayload } = req.body;
    const controller = new user_subscription_controller_1.default(req, res);
    console.log(' ✅ Request coming in route initial_purchased_ios_subscription');
    const result = yield controller.initialPurchasedIosSubscription({ package_name, original_transaction_id, signedPayload });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/initial_purchased_android_subscription', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plan_name, purchase_token } = req.body;
    const controller = new user_subscription_controller_1.default(req, res);
    const result = yield controller.initialPurchasedAndroidSubscription({ plan_name, purchase_token });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/ios_subscription_webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_subscription_controller_1.default(req, res);
    const result = yield controller.iosSubscriptionWebhook(req.body);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/addCredit', verifyTokenUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { package_name, transaction_id } = req.body;
    const controller = new user_subscription_controller_1.default(req, res);
    const result = yield controller.addCredit({ package_name, transaction_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
