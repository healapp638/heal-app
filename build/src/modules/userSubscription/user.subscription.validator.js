"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInitialPurchasedAndroidSubscription = exports.validateInitialPurchasedIosSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
const validateInitialPurchasedIosSubscription = (items) => {
    return joi_1.default.object({
        package_name: joi_1.default.string().trim().required().label('Package Name'),
        original_transaction_id: joi_1.default.string().trim().required().label('Original transaction id'),
        signedPayload: joi_1.default.string().trim().required().label('Signed Payload')
    }).validate(items);
};
exports.validateInitialPurchasedIosSubscription = validateInitialPurchasedIosSubscription;
const validateInitialPurchasedAndroidSubscription = (items) => {
    return joi_1.default.object({
        plan_name: joi_1.default.string().trim().required().label('Plan name'),
        purchase_token: joi_1.default.string().trim().required().label('Purchase token')
    }).validate(items);
};
exports.validateInitialPurchasedAndroidSubscription = validateInitialPurchasedAndroidSubscription;
