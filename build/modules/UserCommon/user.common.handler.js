"use strict";
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
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const admin_contactus_model_1 = __importDefault(require("../../modules/AdminContactus/admin.contactus.model"));
const UserCommonHandler = {
    contactUs: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const contactUsRef = new admin_contactus_model_1.default(data);
        const response = yield (0, db_helpers_1.createOne)(contactUsRef);
        if (!response.status) {
            return (0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.contactUs_error, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _b === void 0 ? void 0 : _b.contactUs_success, null, statusCodes_1.default.SUCCESS);
    }),
};
exports.default = UserCommonHandler;
