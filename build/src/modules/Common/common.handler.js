"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const response_util_1 = require("../../utils/response.util");
const db_helpers_1 = require("../../helpers/db.helpers");
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const commonContent_model_1 = __importDefault(require("../../modules/AdminCommon/commonContent.model"));
const faq_model_1 = __importDefault(require("../../modules/AdminCommon/faq.model"));
const services_1 = __importDefault(require("../../services"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const commonHelper = __importStar(require("../../helpers/common.helper"));
const CommonHandler = {
    getCommonContent: (type, language) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const doc = yield commonContent_model_1.default.findOne().lean();
        const content = (_b = (_a = doc === null || doc === void 0 ? void 0 : doc[type]) === null || _a === void 0 ? void 0 : _a[language]) !== null && _b !== void 0 ? _b : "";
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, { type, language, content }, statusCodes_1.default.SUCCESS);
    }),
    getQuestions: () => __awaiter(void 0, void 0, void 0, function* () {
        const getResponse = yield (0, db_helpers_1.findAll)(faq_model_1.default, {});
        if (getResponse.status) {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.here_is_question, getResponse === null || getResponse === void 0 ? void 0 : getResponse.data, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
    }),
    storeParameterToAws: (name, value) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield services_1.default.awsService.postParameterToAWS({
            name: name,
            value: value
        });
        if (response) {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.parameter_store_post_success, null, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.parameter_store_post_error, null, statusCodes_1.default.API_ERROR);
    }),
    deleteAccount(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = data;
            const finduser = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, { email, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } });
            if (!finduser.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.not_registered, null, statusCodes_1.default.API_ERROR);
            }
            const isValid = yield commonHelper.verifyBycryptHash(password, (_a = finduser === null || finduser === void 0 ? void 0 : finduser.data) === null || _a === void 0 ? void 0 : _a.password);
            if (!isValid) {
                return (0, response_util_1.showResponse)(false, "Incorrect password", null, statusCodes_1.default.API_ERROR);
            }
            const status = 2;
            const result = yield (0, db_helpers_1.findOneAndUpdate)(user_auth_model_1.default, { email, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } }, { status });
            if (!result.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.users.user_account_update_error, null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, `${responseMessages_1.default.users.user_account_has_been} deleted Successfully`, null, statusCodes_1.default.SUCCESS);
        });
    }, //ends
};
exports.default = CommonHandler;
