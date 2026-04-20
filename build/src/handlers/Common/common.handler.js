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
const commonContent_model_1 = __importDefault(require("../../models/Admin/commonContent.model"));
const faq_model_1 = __importDefault(require("../../models/Admin/faq.model"));
const services_1 = __importDefault(require("../../services"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const CommonHandler = {
    getCommonContent: () => __awaiter(void 0, void 0, void 0, function* () {
        const getResponse = yield (0, db_helpers_1.findOne)(commonContent_model_1.default, {});
        if (!getResponse.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, getResponse.data, statusCodes_1.default.SUCCESS);
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
};
exports.default = CommonHandler;
