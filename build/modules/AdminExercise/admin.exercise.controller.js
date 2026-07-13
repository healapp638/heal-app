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
const admin_exercise_handler_1 = __importDefault(require("./admin.exercise.handler"));
const response_util_1 = require("../../utils/response.util");
const config_util_1 = require("../../utils/config.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const admin_exercise_validator_1 = require("./admin.exercise.validator");
let AdminExerciseController = class AdminExerciseController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    createExerciseDetails(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateCreateExerciseDetails)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.createExerciseDetails);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    updateExerciseDetails(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateUpdateExerciseDetails)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.updateExerciseDetails);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    deleteExerciseDetails(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateDeleteExerciseDetails)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.deleteExerciseDetails);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    listExerciseDetails(page, limit, search, lang, phase_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateListExerciseDetails)({ page, limit, search, lang, phase_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.listExerciseDetails);
            return wrappedFunc(page, limit, search, lang, phase_id); // Invoking the wrapped function 
        });
    }
    exerciseDetails(exercise_details_id, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateExerciseDetails)({ exercise_details_id, lang });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.exerciseDetails);
            return wrappedFunc({ exercise_details_id, lang }); // Invoking the wrapped function 
        });
    }
    createExercise(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateCreateExercise)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.createExercise);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    updateExercise(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateUpdateExercise)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.updateExercise);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    deleteExercise(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateDeleteExercise)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.deleteExercise);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    listExercise(page, limit, search, lang, exercise_details_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateListExercise)({ page, limit, search, lang, exercise_details_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.listExercise);
            return wrappedFunc(page, limit, search, lang, exercise_details_id); // Invoking the wrapped function 
        });
    }
    singleExercise(exercise_id, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateSingleExercise)({ exercise_id, lang });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.singleExercise);
            return wrappedFunc({ exercise_id, lang }); // Invoking the wrapped function 
        });
    }
    createMcqExercise(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateCreateMcqExercise)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.createmcqExercise);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    updateMcqExercise(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateUpdateMcqExercise)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.updateMcqExercise);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    deleteMcqExercise(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateDeleteMcqExercise)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.deleteMcqExercise);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    listMcqExercise(page, limit, search, lang, phase_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateListMcqExercise)({ page, limit, search, lang, phase_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.listMcqExercise);
            return wrappedFunc(page, limit, search, lang, phase_id); // Invoking the wrapped function 
        });
    }
    singleMcqExercise(mcqexercise_id, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_exercise_validator_1.validateSingleMcqExercise)({ mcqexercise_id, lang });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_exercise_handler_1.default.singleMcqExercise);
            return wrappedFunc({ mcqexercise_id, lang }); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/create_exercise_details'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "createExerciseDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/update_exercise_details'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "updateExerciseDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)('/delete_exercise_details'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "deleteExerciseDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/list_exercise_details'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "listExerciseDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/exercise_details'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "exerciseDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/create_exercise'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "createExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/update_exercise'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "updateExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)('/delete_exercise'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "deleteExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/list_exercise'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "listExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/single_exercise'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "singleExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/create_mcq_exercise'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "createMcqExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)('/update_mcq_exercise'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "updateMcqExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)('/delete_mcq_exercise'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "deleteMcqExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/list_mcq_exercise'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "listMcqExercise", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)('/single_mcq_exercise'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminExerciseController.prototype, "singleMcqExercise", null);
AdminExerciseController = __decorate([
    (0, tsoa_1.Tags)('Admin Exercise'),
    (0, tsoa_1.Route)('/admin/exercise'),
    __metadata("design:paramtypes", [Object, Object])
], AdminExerciseController);
exports.default = AdminExerciseController;
