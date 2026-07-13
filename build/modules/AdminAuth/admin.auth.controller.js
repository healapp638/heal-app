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
const admin_auth_validator_1 = require("./admin.auth.validator");
const admin_auth_handler_1 = __importDefault(require("../AdminAuth/admin.auth.handler"));
const response_util_1 = require("../../utils/response.util");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const config_util_1 = require("../../utils/config.util");
const user_auth_validator_1 = require("../UserAuth/user.auth.validator");
let AdminAuthController = class AdminAuthController extends tsoa_1.Controller {
    constructor(req, res) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
    }
    /**
     * Get Admin login
     */
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_auth_validator_1.validateAdminLogin)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.login);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
    * Forgot password api endpoint
    */
    forgotPassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_auth_validator_1.validateForgotPassword)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.forgotPassword);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
* Reset password api endpoint
*/
    resetPassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_auth_validator_1.validateResetPassword)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.resetPassword);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
    * Verify Otp Route  api endpoint
    */
    verifyOtp(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_auth_validator_1.validateVerifyOtp)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.verifyOtp);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
  * Resend Otp Route  api endpoint
  */
    resendOtp(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validate = (0, admin_auth_validator_1.validateResendOtp)(request);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.resendOtp);
            return wrappedFunc(request); // Invoking the wrapped function 
        });
    }
    //ends
    /**
    * Change Password endpoint
    */
    changePassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password } = request;
            const validate = (0, admin_auth_validator_1.validateChangePassword)({ old_password, new_password });
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.changePassword);
            return wrappedFunc({ old_password, new_password }, this.userId); // Invoking the wrapped function 
        });
    }
    //ends
    /**
   * Get Admin info
   */
    getAdminDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.getAdminDetails);
            return wrappedFunc(this.userId); // Invoking the wrapped function 
        });
    }
    //ends
    /**
* Update Admin Profile
*/
    updateAdminProfile(first_name, last_name, phone_number, country_code, greet_msg, profile_pic) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = { first_name, last_name, phone_number, country_code, greet_msg };
            const validate = (0, admin_auth_validator_1.validateUpdateProfile)(body);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.updateAdminProfile);
            return wrappedFunc(body, this.userId, profile_pic); // Invoking the wrapped function 
        });
    }
    //ends
    /**
    *  Refresh token api
    * provide refresh token in this api and get new access token
    */
    refreshToken(refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = { refresh_token };
            const validate = (0, user_auth_validator_1.validateRefreshToken)(body);
            if (validate.error) {
                return (0, response_util_1.showResponse)(false, validate.error.message, null, statusCodes_1.default.VALIDATION_ERROR);
            }
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.refreshToken);
            return wrappedFunc(body); // Invoking the wrapped function 
        });
    }
    /**
* Logout User
*/
    logoutUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const wrappedFunc = (0, config_util_1.tryCatchWrapper)(admin_auth_handler_1.default.logoutUser);
            return wrappedFunc(); // Invoking the wrapped function 
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/login"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)("/forgot_password"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "forgotPassword", null);
__decorate([
    (0, tsoa_1.Post)("/reset_password"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "resetPassword", null);
__decorate([
    (0, tsoa_1.Post)("/verify_otp"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "verifyOtp", null);
__decorate([
    (0, tsoa_1.Post)("/resend_otp"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "resendOtp", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Post)("/change_password"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "changePassword", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Get)("/details"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "getAdminDetails", null);
__decorate([
    (0, tsoa_1.Security)('Bearer'),
    (0, tsoa_1.Put)("/profile"),
    __param(0, (0, tsoa_1.FormField)()),
    __param(1, (0, tsoa_1.FormField)()),
    __param(2, (0, tsoa_1.FormField)()),
    __param(3, (0, tsoa_1.FormField)()),
    __param(4, (0, tsoa_1.FormField)()),
    __param(5, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "updateAdminProfile", null);
__decorate([
    (0, tsoa_1.Post)("/refresh_token"),
    __param(0, (0, tsoa_1.FormField)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "refreshToken", null);
__decorate([
    (0, tsoa_1.Post)("/logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "logoutUser", null);
AdminAuthController = __decorate([
    (0, tsoa_1.Tags)('Admin Auth Routes'),
    (0, tsoa_1.Route)('/admin/auth'),
    __metadata("design:paramtypes", [Object, Object])
], AdminAuthController);
exports.default = AdminAuthController;
