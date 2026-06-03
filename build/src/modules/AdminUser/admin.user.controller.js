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
const admin_user_validator_1 = require("./admin.user.validator");
const admin_user_handler_1 = __importDefault(require("../AdminUser/admin.user.handler"));
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const config_util_1 = require("../../utils/config.util");
let AdminUserController = class AdminUserController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    /**
* Get User List
*/
    getUsersList(sort_column, sort_direction, page, limit, search_key, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = { sort_column, sort_direction, page, limit, search_key, status };
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.getUsersList);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
* Get User Details
*/
    getUserDetails(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_user_validator_1.validateGetCustomerDetails)({ user_id });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.getUserDetails);
            return wrappedFunc(user_id); // Invoking the wrapped function 
        });
    }
    //ends
    /**
* Update User Status
* 1 for active 2 for delete 3 for deactivate
*/
    updateUserStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_user_validator_1.validateUpdateUserStatus)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.updateUserStatus);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
* Get Dashboard data
*/
    getDashboardData(past_day) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_user_validator_1.validateDashboard)({ past_day });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.getDashboardData);
            return wrappedFunc(past_day); // Invoking the wrapped function 
        });
    }
    //ends
    // --- MULTIPART UPLOAD ROUTES START---
    /**
     * 1. Initiate Multipart Upload
     */
    initiateMultipartUpload(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract values from the single body object
            const { fileName, fileType } = requestBody;
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.initiateMultipartUpload);
            return wrappedFunc(fileName, fileType);
        });
    }
    /**
     * 2. Sign Part
     */
    signMultipartPart(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, uploadId, partNumber } = requestBody;
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.signMultipartPart);
            return wrappedFunc(key, uploadId, partNumber);
        });
    }
    /**
     * 3. Complete Multipart
     */
    completeMultipartUpload(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, uploadId, parts } = requestBody;
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.completeMultipartUpload);
            return wrappedFunc(key, uploadId, parts);
        });
    }
    /**
     * Process File Admin
     */
    processFileAdmin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.s3_key) {
                return (0, response_util_1.showResponse)(false, "S3 Key is required", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.processFileAdmin);
            return wrappedFunc(request);
        });
    }
    // --- MULTIPART UPLOAD ROUTES END---
    //         /**
    // * Send multiple notifications through a queue. We use background processing—feel free to change it as per your requirements. This is just a sample structure
    // */
    //     @Security('Bearer')
    //     @Post("/send/multiple/notifications")
    //     public async sendMultipleNotifications(): Promise<ApiResponse> {
    //         // const validate = validateSendMultipleNotifications({  });
    //         // if (validate.error) {
    //         //     return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    //         // }
    //         const wrappedFunc = tryCatchWrapper(handler.sendMultipleNotifications);
    //         return wrappedFunc(); // Invoking the wrapped function 
    //     }
    //     //ends
    //         /**
    // * Fetch the user list using the cache to improve performance. This is a sample structure; you can change it as per your requirements
    // */
    //     @Security('Bearer')
    //     @Get("/list/through_cache")
    //     public async getUsersListThroughCache(@Query() sort_column?: string, @Query() sort_direction?: string, @Query() page?: number, @Query() limit?: number, @Query() search_key?: string, @Query() status?: number): Promise<ApiResponse> {
    //         const request = { sort_column, sort_direction, page, limit, search_key, status }
    //         const wrappedFunc = tryCatchWrapper(handler.getUsersListThroughCache);
    //         return wrappedFunc(request); // Invoking the wrapped function 
    //     }
    //     //ends
    overviewAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.overviewAnalytics);
            return wrappedFunc();
        });
    }
    mrrAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.mrrAnalytics);
            return wrappedFunc();
        });
    }
    churnAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.churnAnalytics);
            return wrappedFunc();
        });
    }
    customerSubscriptionDetails(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_user_handler_1.default.customerSubscriptionDetails);
            return wrappedFunc(user_id);
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
    __param(5, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getUsersList", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/details"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getUserDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Put)("/status"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "updateUserStatus", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/dashboard"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getDashboardData", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/upload/multipart/init"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "initiateMultipartUpload", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/upload/multipart/sign-part"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "signMultipartPart", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/upload/multipart/complete"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "completeMultipartUpload", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/upload/process_file_admin"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "processFileAdmin", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("/overviewAnalytics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "overviewAnalytics", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("/mrrAnalytics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "mrrAnalytics", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("/churnAnalytics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "churnAnalytics", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("/customerSubscriptionDetails"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "customerSubscriptionDetails", null);
AdminUserController = __decorate([
    (0, tsoa_1.Tags)('Admin User Routes'),
    (0, tsoa_1.Route)('/admin/user'),
    __metadata("design:paramtypes", [Object, Object])
], AdminUserController);
exports.default = AdminUserController;
