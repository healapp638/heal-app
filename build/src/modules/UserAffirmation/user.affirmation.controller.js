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
const config_util_1 = require("../../utils/config.util");
const user_affirmation_handler_1 = __importDefault(require("./user.affirmation.handler"));
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const admin_common_validator_1 = require("../AdminCommon/admin.common.validator");
// import { validateCreateTheme, validateDeleteTheme, validateThemeDetails, validateUpdateTheme } from './admin.theme.validator';
let AdminAffirmationController = class AdminAffirmationController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    // @Security('Bearer')
    // @Post('/create')
    // public async createAffirmation(): Promise<ApiResponse> {
    //     const wrappedFunc = tryCatchWrapper(handler.createAffirmation);
    //     return wrappedFunc(); // Invoking the wrapped function 
    // }
    // @Security('Bearer')
    // @Post('/update_theme')
    // public async updateTheme(@Body() request: { title: string, description: string, imgUrl: string, lang: string, themeId: string }): Promise<ApiResponse> {
    //     const validate = validateUpdateTheme(request);
    //     if (validate.error) {
    //         return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    //     }
    //     const wrappedFunc = tryCatchWrapper(handler.updateTheme);
    //     return wrappedFunc(request); // Invoking the wrapped function 
    // }
    // @Security('Bearer')
    // @Delete('/delete_theme')
    // public async deleteTheme(@Body() request: { themeId: string, status: string }): Promise<ApiResponse> {
    //     const validate = validateDeleteTheme(request);
    //     if (validate.error) {
    //         return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    //     }
    //     const wrappedFunc = tryCatchWrapper(handler.deleteTheme);
    //     return wrappedFunc(request); // Invoking the wrapped function 
    // }
    getAIAffirmation() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_affirmation_handler_1.default.getAIAffirmation);
            return wrappedFunc(this.userId); // Invoking the wrapped function 
        });
    }
    addView(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_common_validator_1.validateAffirmation)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_affirmation_handler_1.default.addView);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
    getAffirmationListing(sort_column, sort_direction, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = { sort_column, sort_direction, page, limit };
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_affirmation_handler_1.default.getAffirmationListing);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/getAIAffirmation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAffirmationController.prototype, "getAIAffirmation", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/addView'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAffirmationController.prototype, "addView", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/getAffirmationListing"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminAffirmationController.prototype, "getAffirmationListing", null);
AdminAffirmationController = __decorate([
    (0, tsoa_1.Tags)('User Affirmation'),
    (0, tsoa_1.Route)('/user/affirmation'),
    __metadata("design:paramtypes", [Object, Object])
], AdminAffirmationController);
exports.default = AdminAffirmationController;
