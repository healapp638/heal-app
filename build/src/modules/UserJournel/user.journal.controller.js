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
const user_journal_handler_1 = __importDefault(require("../UserJournel/user.journal.handler"));
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const config_util_1 = require("../../utils/config.util");
const user_journel_validator_1 = require("./user.journel.validator");
let UserJournalController = class UserJournalController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    createJournal(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_journel_validator_1.validateAddJournal)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_journal_handler_1.default.createJournal);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
    journalList(cursor, limit, search_key) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_journal_handler_1.default.journalList);
            return wrappedFunc(cursor, limit, search_key, this.userId); // Invoking the wrapped function 
        });
    }
    updateJournal(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_journel_validator_1.validateUpdateJournal)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_journal_handler_1.default.updateJournal);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
    deleteJournal(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_journel_validator_1.validateDeleteJournal)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_journal_handler_1.default.deleteJournal);
            return wrappedFunc(request, this.userId); // Invoking the wrapped function 
        });
    }
    journalDetail(journal_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, user_journel_validator_1.validateJournalDetail)(journal_id);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(user_journal_handler_1.default.journalDetail);
            return wrappedFunc(journal_id, this.userId); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("create_journal"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserJournalController.prototype, "createJournal", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("journal_list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserJournalController.prototype, "journalList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Put)("update_journal"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserJournalController.prototype, "updateJournal", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Delete)("delete_journal"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserJournalController.prototype, "deleteJournal", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("journal_detail"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserJournalController.prototype, "journalDetail", null);
UserJournalController = __decorate([
    (0, tsoa_1.Tags)('User Journal Routes'),
    (0, tsoa_1.Route)('/user/journal'),
    __metadata("design:paramtypes", [Object, Object])
], UserJournalController);
exports.default = UserJournalController;
