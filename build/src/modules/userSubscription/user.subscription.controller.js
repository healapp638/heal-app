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
const user_revenuecat_subscription_handler_1 = __importDefault(require("./user.revenuecat.subscription.handler"));
const config_util_1 = require("../../utils/config.util");
let UserSubscriptionController = class UserSubscriptionController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    /**
     * RevenueCat Webhook
     */
    revenueCatWebhook(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("📨 Webhook Headers received:", this.req.headers);
            const signature = this.req.headers['x-revenuecat-signature'] || '';
            const authorization = this.req.headers['authorization'] || '';
            // Pass both signature and authorization to the handler for flexibility
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_revenuecat_subscription_handler_1.default.revenueCatWebhook);
            return yield wrappedFunc(request, signature, authorization);
        });
    }
    /**
     * Check Subscription Status
     */
    checkSubscriptionStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_revenuecat_subscription_handler_1.default.checkRevenueCatSubscriptionStatus);
            return yield wrappedFunc(this.userId);
        });
    }
    /**
     * Sync After Purchase
     */
    syncAfterPurchase() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_revenuecat_subscription_handler_1.default.syncAfterPurchase);
            return yield wrappedFunc(this.userId);
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/revenuecat_webhook"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "revenueCatWebhook", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/subscription_status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "checkSubscriptionStatus", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/sync_purchase"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "syncAfterPurchase", null);
UserSubscriptionController = __decorate([
    (0, tsoa_1.Tags)('User Subscription Routes'),
    (0, tsoa_1.Route)('/user/subscription'),
    __metadata("design:paramtypes", [Object, Object])
], UserSubscriptionController);
exports.default = UserSubscriptionController;
