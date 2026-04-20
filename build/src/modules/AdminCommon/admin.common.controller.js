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
const admin_common_validator_1 = require("./admin.common.validator");
const admin_common_handler_1 = __importDefault(require("../AdminCommon/admin.common.handler"));
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const config_util_1 = require("../../utils/config.util");
let AdminCommonController = class AdminCommonController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    /**
* Add Question  endpoint
*/
    addQuestion(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_common_validator_1.validateAddQuestion)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_common_handler_1.default.addQuestion);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
* Update Question endpoint
*/
    updateQuestion(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_common_validator_1.validateUpdateQuestion)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_common_handler_1.default.updateQuestion);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
    * Delete Question endpoint
    */
    deleteQuestion(question_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_common_validator_1.validateDeleteQuestion)({ question_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_common_handler_1.default.deleteQuestion);
            return wrappedFunc({ question_id }); // Invoking the wrapped function 
        });
    }
    //ends
    /**
 * Update Common Content endpoint
 */
    updateCommonContent(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_common_validator_1.validateCommonContent)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_common_handler_1.default.updateCommonContent);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/question"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCommonController.prototype, "addQuestion", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Put)("/question"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCommonController.prototype, "updateQuestion", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)("/question"),
    __param(0, (0, tsoa_1.FormField)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCommonController.prototype, "deleteQuestion", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Put)("/common_content"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCommonController.prototype, "updateCommonContent", null);
AdminCommonController = __decorate([
    (0, tsoa_1.Tags)('Admin Common Routes'),
    (0, tsoa_1.Route)('/admin/common'),
    __metadata("design:paramtypes", [Object, Object])
], AdminCommonController);
exports.default = AdminCommonController;
