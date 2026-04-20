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
const admin_contactus_model_1 = __importDefault(require("../../models/Admin/admin.contactus.model"));
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const common_helper_1 = require("../../helpers/common.helper");
const services_1 = __importDefault(require("../../services"));
const responseMessages_2 = __importDefault(require("../../constants/responseMessages"));
const AdminContactUsHandler = {
    listContactDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sort_column = 'createdAt', sort_direction = 'desc', page, limit, search_key = '' } = data;
            const queryObject = {
                status: { $ne: workflow_constant_1.USER_STATUS.DELETED },
                name: { $regex: search_key, $options: 'i' }
            };
            const aggregate = [
                {
                    $match: Object.assign({}, queryObject)
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        message: 1,
                        createdAt: 1
                    }
                },
                { $sort: { [sort_column]: sort_direction === 'asc' ? 1 : -1 } },
            ];
            const { totalCount, aggregation } = yield (0, common_helper_1.getCountAndPagination)(admin_contactus_model_1.default, aggregate, page, limit);
            const result = yield admin_contactus_model_1.default.aggregate(aggregation);
            return (0, response_util_1.showResponse)(true, responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common.data_retreive_sucess, { result, totalCount }, statusCodes_1.default.SUCCESS);
        });
    },
    getContactDetail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { contact_id } = data;
            const response = yield (0, db_helpers_1.findOne)(admin_contactus_model_1.default, { _id: contact_id, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } }, {});
            if (!response.status) {
                return (0, response_util_1.showResponse)(false, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.contactUs_not_found, null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, (_b = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _b === void 0 ? void 0 : _b.contactUs_detail, response.data, statusCodes_1.default.SUCCESS);
        });
    },
    deleteContactUs(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { contact_id } = data;
            const response = yield (0, db_helpers_1.findOneAndDelete)(admin_contactus_model_1.default, { _id: contact_id });
            if (!response.status) {
                return (0, response_util_1.showResponse)(false, responseMessages_2.default.common.delete_failed, null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, (_a = responseMessages_1.default === null || responseMessages_1.default === void 0 ? void 0 : responseMessages_1.default.common) === null || _a === void 0 ? void 0 : _a.contactUs_deleted, null, statusCodes_1.default.SUCCESS);
        });
    },
    replyContactus: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { contact_id, html } = data;
        const exists = yield (0, db_helpers_1.findOne)(admin_contactus_model_1.default, { _id: contact_id, status: { $ne: workflow_constant_1.USER_STATUS.DELETED } });
        if (!exists.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.API_ERROR);
        }
        const userData = exists === null || exists === void 0 ? void 0 : exists.data;
        const to = userData === null || userData === void 0 ? void 0 : userData.email;
        const user_name = `${userData === null || userData === void 0 ? void 0 : userData.first_name} ${userData === null || userData === void 0 ? void 0 : userData.last_name}`;
        const payload = { user_name, html };
        const emailSend = yield services_1.default.emailService.sendEmailViaNodemail(workflow_constant_1.EMAIL_SEND_TYPE.REPLY_CONTACTUS_EMAIL, to, payload);
        if (!emailSend.status) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.email_sent_error, null, statusCodes_1.default.API_ERROR);
        }
        yield (0, db_helpers_1.findByIdAndUpdate)(admin_contactus_model_1.default, userData === null || userData === void 0 ? void 0 : userData._id, { is_reply: true });
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.email_sent_success, null, statusCodes_1.default.SUCCESS);
    }),
};
exports.default = AdminContactUsHandler;
