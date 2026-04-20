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
const commonContent_model_1 = __importDefault(require("../../modules/AdminCommon/commonContent.model"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const faq_model_1 = __importDefault(require("../../modules/AdminCommon/faq.model"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const AdminCommonHandler = {
    addQuestion: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { question, answer } = data;
        const exists = yield (0, db_helpers_1.findOne)(faq_model_1.default, { question });
        if (exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.already_existed, null, statusCodes_1.default.API_ERROR);
        }
        const newObj = { question, answer };
        const quesRef = new faq_model_1.default(newObj);
        const response = yield (0, db_helpers_1.createOne)(quesRef);
        if (response.status) {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.admin.question_added, null, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.admin.failed_question_add, response, statusCodes_1.default.API_ERROR);
    }),
    updateQuestion: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { answer, question, question_id } = data;
        const updateObj = Object.assign(Object.assign({}, (answer && { answer })), (question && { question }));
        const response = yield (0, db_helpers_1.findByIdAndUpdate)(faq_model_1.default, question_id, updateObj);
        if (response.status) {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.update_sucess, null, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, null, statusCodes_1.default.API_ERROR);
    }),
    deleteQuestion: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { question_id } = data;
        const exists = yield (0, db_helpers_1.findOne)(faq_model_1.default, { _id: question_id });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.API_ERROR);
        }
        const response = yield (0, db_helpers_1.findByIdAndRemove)(faq_model_1.default, question_id);
        if (response.status) {
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.delete_sucess, null, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.delete_failed, response, statusCodes_1.default.API_ERROR);
    }),
    updateCommonContent: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { about, privacy_policy, terms_conditions } = data;
        const updateObj = Object.assign(Object.assign(Object.assign({}, (about && { about })), (privacy_policy && { privacy_policy })), (terms_conditions && { terms_conditions }));
        let message = '';
        if (about) {
            message = responseMessages_1.default.admin.about_updated;
        }
        if (privacy_policy) {
            message = responseMessages_1.default.admin.privacy_policy_updated;
        }
        if (terms_conditions) {
            message = responseMessages_1.default.admin.terms_conditions_updated;
        }
        const response = yield (0, db_helpers_1.findOneAndUpdate)(commonContent_model_1.default, {}, updateObj);
        if (response.status) {
            return (0, response_util_1.showResponse)(true, message, response === null || response === void 0 ? void 0 : response.data, statusCodes_1.default.SUCCESS);
        }
        return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.update_failed, {}, statusCodes_1.default.API_ERROR);
    }),
};
exports.default = AdminCommonHandler;
