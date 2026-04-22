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
const admin_modules_handler_1 = __importDefault(require("./admin.modules.handler"));
const response_util_1 = require("../../utils/response.util");
const config_util_1 = require("../../utils/config.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const admin_modules_validator_1 = require("./admin.modules.validator");
let AdminModulesController = class AdminModulesController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    createModule(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_modules_validator_1.validateCreateModule)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_modules_handler_1.default.createModule);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    updateModule(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_modules_validator_1.validateUpdateModule)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_modules_handler_1.default.updateModule);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    deleteModule(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_modules_validator_1.validateDeleteModule)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_modules_handler_1.default.deleteModule);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    listModule(page, limit, search, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_modules_handler_1.default.listModule);
            return wrappedFunc(page, limit, search, lang); // Invoking the wrapped function 
        });
    }
    moduleDetails(moduleId, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_modules_validator_1.validateModuleDetails)({ moduleId, lang });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_modules_handler_1.default.moduleDetails);
            return wrappedFunc({ moduleId, lang }); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/create_module'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "createModule", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/update_module'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "updateModule", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)('/delete_theme'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "deleteModule", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/list_module'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "listModule", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/module_details'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminModulesController.prototype, "moduleDetails", null);
AdminModulesController = __decorate([
    (0, tsoa_1.Tags)('Admin Modules'),
    (0, tsoa_1.Route)('/admin/modules'),
    __metadata("design:paramtypes", [Object, Object])
], AdminModulesController);
exports.default = AdminModulesController;
