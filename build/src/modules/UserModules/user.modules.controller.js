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
const user_modules_handler_1 = __importDefault(require("../UserModules/user.modules.handler"));
const config_util_1 = require("../../utils/config.util");
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_modules_validator_1 = require("./user.modules.validator");
let UserModulesController = class UserModulesController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    themeList(cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.themeList);
            return wrappedFunc({ cursor, limit }, this.userId); // Invoking the wrapped function 
        });
    }
    moduleList(theme_id, cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validateModuleList)({ theme_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.moduleList);
            return wrappedFunc({ theme_id, cursor, limit }, this.userId); // Invoking the wrapped function 
        });
    }
    phaseList(sub_module_id, cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validatePhaseList)({ sub_module_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.phaseList);
            return wrappedFunc({ sub_module_id, cursor, limit }, this.userId); // Invoking the wrapped function 
        });
    }
    exerciseDetailList(phase_id, cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validateExerciseDetailList)({ phase_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.exerciseDetailList);
            return wrappedFunc({ phase_id, cursor, limit }, this.userId); // Invoking the wrapped function 
        });
    }
    exerciseList(exercise_detail_id, cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validateExerciseList)({ exercise_detail_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.exerciseList);
            return wrappedFunc({ exercise_detail_id, cursor, limit }, this.userId); // Invoking the wrapped function 
        });
    }
    completeLesson(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validateCompleteLesson)(body);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.completeLesson);
            return wrappedFunc(body, this.userId); // Invoking the wrapped function 
        });
    }
    startLesson(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validateStartLesson)(body);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.startLesson);
            return wrappedFunc(body.phase_id, this.userId); // Invoking the wrapped function 
        });
    }
    startSubModuleList(cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validateStartSubModuleList)({ cursor, limit });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.startSubModuleList);
            return wrappedFunc({ cursor, limit }, this.userId); // Invoking the wrapped function 
        });
    }
    endSubModuleList(cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_modules_validator_1.validateStartSubModuleList)({ cursor, limit });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.API_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_modules_handler_1.default.endSubModuleList);
            return wrappedFunc({ cursor, limit }, this.userId); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/theme_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "themeList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/module_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "moduleList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/phase_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "phaseList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/exercise_detail_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "exerciseDetailList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/exercise_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "exerciseList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/complete_lesson"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "completeLesson", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/start_lesson"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "startLesson", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/start_sub_module_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "startSubModuleList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/end_sub_module_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UserModulesController.prototype, "endSubModuleList", null);
UserModulesController = __decorate([
    (0, tsoa_1.Tags)('User Modules Routes'),
    (0, tsoa_1.Route)('/user/modules'),
    __metadata("design:paramtypes", [Object, Object])
], UserModulesController);
exports.default = UserModulesController;
