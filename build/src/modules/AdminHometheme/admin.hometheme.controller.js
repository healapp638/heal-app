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
const admin_hometheme_handler_1 = __importDefault(require("./admin.hometheme.handler"));
const response_util_1 = require("../../utils/response.util");
const config_util_1 = require("../../utils/config.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const admin_hometheme_validator_1 = require("./admin.hometheme.validator");
let AdminThemeController = class AdminThemeController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    createCategoryTheme(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateCreateTheme)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.createCategoryTheme);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    updateCategoryTheme(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateUpdateTheme)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.updateCategoryTheme);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    deleteCategoryTheme(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateDeleteTheme)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.deleteCategoryTheme);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    listCategoryTheme(page, limit, search, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.listCategoryTheme);
            return wrappedFunc(page, limit, search, lang); // Invoking the wrapped function 
        });
    }
    themeCategoryDetails(themeCategoryId, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateThemeDetails)({ themeCategoryId, lang });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.themeCategoryDetails);
            return wrappedFunc({ themeCategoryId, lang }); // Invoking the wrapped function 
        });
    }
    createHomeTheme(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateCreateHomeTheme)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.createHomeTheme);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    updateHomeTheme(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateUpdateHometheme)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.updateHomeTheme);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    deleteHomeTheme(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateDeleteHomeTheme)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.deleteHomeTheme);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    listHomeTheme(categoryTheme_id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.listHomeTheme);
            return wrappedFunc(categoryTheme_id, page, limit); // Invoking the wrapped function 
        });
    }
    homeThemeDetails(hometheme_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_hometheme_validator_1.validateHomeThemeDetails)({ hometheme_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_hometheme_handler_1.default.homeThemeDetails);
            return wrappedFunc({ hometheme_id, }); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/createCategoryTheme'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "createCategoryTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/updateCategoryTheme'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "updateCategoryTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)('/deleteCategoryTheme'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "deleteCategoryTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/listCategoryTheme'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "listCategoryTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/themeCategoryDetails'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "themeCategoryDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/createHomeTheme'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "createHomeTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/updateHomeTheme'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "updateHomeTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)('/deleteHomeTheme'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "deleteHomeTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/listHomeTheme'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "listHomeTheme", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/homeThemeDetails'),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminThemeController.prototype, "homeThemeDetails", null);
AdminThemeController = __decorate([
    (0, tsoa_1.Tags)('Admin Home Theme'),
    (0, tsoa_1.Route)('/admin/homeTheme'),
    __metadata("design:paramtypes", [Object, Object])
], AdminThemeController);
exports.default = AdminThemeController;
