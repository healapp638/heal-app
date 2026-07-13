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
const admin_contactus_validator_1 = require("./admin.contactus.validator");
const admin_contactus_handler_1 = __importDefault(require("../AdminContactus/admin.contactus.handler"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const response_util_1 = require("../../utils/response.util");
const config_util_1 = require("../../utils/config.util");
let AdminController = class AdminController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    /**
    * List events.
    */
    listContactDetails(sort_column, sort_direction, page, limit, search_key) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = { sort_column, sort_direction, page, limit, search_key };
            const validate = (0, admin_contactus_validator_1.validateListContactDetails)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_contactus_handler_1.default.listContactDetails);
            return wrappedFunc(request);
        });
    }
    /**
    * List events.
    */
    getContactDetail(contact_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = { contact_id };
            const validate = (0, admin_contactus_validator_1.validateGetContactDetail)(body);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_contactus_handler_1.default.getContactDetail);
            return wrappedFunc(body);
        });
    }
    /**
    * Delete Contact.
    */
    deleteContactUs(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_contactus_validator_1.validateDeleteContactUs)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_contactus_handler_1.default.deleteContactUs);
            return wrappedFunc(request);
        });
    }
    //ends
    /**
     * Reply TO Contact
     */
    replyContactus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_contactus_validator_1.validateReplyContactUs)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_contactus_handler_1.default.replyContactus);
            return wrappedFunc(request);
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listContactDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/details"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getContactDetail", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)("/delete"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteContactUs", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/reply"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "replyContactus", null);
AdminController = __decorate([
    (0, tsoa_1.Tags)('Admin ContactUs Routes'),
    (0, tsoa_1.Route)(`admin/contactus`),
    __metadata("design:paramtypes", [Object, Object])
], AdminController);
exports.default = AdminController;
