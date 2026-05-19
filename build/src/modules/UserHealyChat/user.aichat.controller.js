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
const user_aichat_handler_1 = __importDefault(require("../UserHealyChat/user.aichat.handler"));
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const config_util_1 = require("../../utils/config.util");
const user_aichat_validator_1 = require("./user.aichat.validator");
let UserHealyChatController = class UserHealyChatController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    /**
     * send message
     */
    sendMessage(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_aichat_validator_1.validatesendMessage)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_aichat_handler_1.default.sendMessage);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
    /**
     * get random questions
     */
    getRandomQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_aichat_handler_1.default.getRandomQuestions);
            return wrappedFunc(this.userId); // Invoking the wrapped function 
        });
    }
    /**
     * get message List
     */
    getMessageList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_aichat_validator_1.validateGetMessageList)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_aichat_handler_1.default.getConversationMessages);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
    /**
     * ai support response
     */
    aiSupportResponse(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_aichat_validator_1.validateAiSupportResponse)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_aichat_handler_1.default.aiSupportResponse);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
    /**
     * get conversations list
     */
    getConversationList(page, limit, search, sort_column, sort_direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_aichat_validator_1.validateConversationListing)({ page, limit, search, sort_column, sort_direction });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_aichat_handler_1.default.getConversationListing);
            return wrappedFunc(page, limit, search, sort_column, sort_direction, this.userId); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("sendMessage"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserHealyChatController.prototype, "sendMessage", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("getRandomQuestions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserHealyChatController.prototype, "getRandomQuestions", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("getMessageList"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserHealyChatController.prototype, "getMessageList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("aiSupportResponse"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserHealyChatController.prototype, "aiSupportResponse", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("getConversationList"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], UserHealyChatController.prototype, "getConversationList", null);
UserHealyChatController = __decorate([
    (0, tsoa_1.Tags)('User Healy Chat Routes'),
    (0, tsoa_1.Route)('/user/healyChat'),
    __metadata("design:paramtypes", [Object, Object])
], UserHealyChatController);
exports.default = UserHealyChatController;
