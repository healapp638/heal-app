"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const tsoa_1 = require("tsoa");
const user_subscription_handler_1 = __importDefault(require("./user.subscription.handler"));
const user_subscription_validator_1 = require("./user.subscription.validator");
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const config_util_1 = require("../../utils/config.util");
let UserSubscriptionController = class UserSubscriptionController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    /**
        * Ios webhook url
        */
    iosSubscriptionWebhook(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_subscription_handler_1.default.iosSubscriptionWebhook);
            return wrappedFunc(request); // Pass the request object directly to the function
        });
    }
    //ends
    /**
    * initialPurchasedSubscription for iOS
    */
    initialPurchasedIosSubscription(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { package_name, original_transaction_id, signedPayload } = request;
                console.log(' ✅ Request coming in controller initial_purchased_ios_subscription');
                // Validate the request
                const validate = (0, user_subscription_validator_1.validateInitialPurchasedIosSubscription)(request);
                if (validate.error) {
                    return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
                }
                console.log(' ✅ Request coming in controller initial_purchased_ios_subscription 111');
                // Wrap the function call in try-catch for error handling
                const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_subscription_handler_1.default.initialPurchasedIosSubscription);
                return yield wrappedFunc({ package_name, original_transaction_id, signedPayload }, this.userId); // Pass the request object directly to the function
            }
            catch (error) {
                // Handle any unexpected errors that happen during the process
                console.log('❌ Error in initialPurchasedIosSubscription controller:', error);
                return (0, response_util_1.showResponse)(false, 'An unexpected error occurred. Please try again later.', null, statusCodes_1.default.API_ERROR);
            }
        });
    }
    //ends
    /**
    * initialPurchased Android Subscription
    */
    initialPurchasedAndroidSubscription(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { plan_name, purchase_token } = request;
            const validate = (0, user_subscription_validator_1.validateInitialPurchasedAndroidSubscription)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_subscription_handler_1.default.initialPurchasedAndroidSubscription);
            return wrappedFunc({ plan_name, purchase_token }, this.userId); // Pass the request object directly to the function
        });
    }
    //ends
    /**
     * Create Credit
     */
    addCredit(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { package_name, transaction_id } = request;
            if (!package_name || !transaction_id) {
                return (0, response_util_1.showResponse)(false, "package_name and transaction_id required", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_subscription_handler_1.default.addCredit);
            return wrappedFunc({ package_name, transaction_id }, this.userId);
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/ios_subscription_webhook"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "iosSubscriptionWebhook", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/initial_purchased_ios_subscription"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "initialPurchasedIosSubscription", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/initial_purchased_android_subscription"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "initialPurchasedAndroidSubscription", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/addCredit"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "addCredit", null);
UserSubscriptionController = __decorate([
    (0, tsoa_1.Tags)('User Subscription Routes'),
    (0, tsoa_1.Route)('/user/subscription'),
    __metadata("design:paramtypes", [Object, Object])
], UserSubscriptionController);
exports.default = UserSubscriptionController;
