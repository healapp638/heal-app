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
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const workflow_constant_1 = require("../../constants/workflow.constant");
// import { translateText } from "../../helpers/langauge.translate.helper";
const user_affirmation_model_1 = __importDefault(require("./user.affirmation.model"));
// import OpenAI from "openai";
// import { APP } from "../../constants/app.constant";
const db_helpers_1 = require("../../helpers/db.helpers");
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const common_helper_1 = require("../../helpers/common.helper");
const affirmationHandler = {
    getAIAffirmation: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const userdata = yield (0, db_helpers_1.findOne)(user_auth_model_1.default, {
            _id: (0, common_helper_1.convertToObjectId)(user_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE
        });
        if (!userdata) {
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.data_not_found, null, statusCodes_1.default.NOT_FOUND);
        }
        // user selected language
        const language = ((_a = userdata === null || userdata === void 0 ? void 0 : userdata.data) === null || _a === void 0 ? void 0 : _a.language) || "en";
        // latest AI affirmation
        const aiAffirmation = yield user_affirmation_model_1.default
            .findOne({
            type: "AI",
            status: workflow_constant_1.USER_STATUS.ACTIVE
        })
            .sort({ createdAt: -1 });
        if (!aiAffirmation) {
            return (0, response_util_1.showResponse)(false, "No AI affirmation found", null, statusCodes_1.default.NOT_FOUND);
        }
        // return only user's language
        const responseData = {
            _id: aiAffirmation._id,
            affirmation: ((_b = aiAffirmation === null || aiAffirmation === void 0 ? void 0 : aiAffirmation.affirmation) === null || _b === void 0 ? void 0 : _b[language]) ||
                ((_c = aiAffirmation === null || aiAffirmation === void 0 ? void 0 : aiAffirmation.affirmation) === null || _c === void 0 ? void 0 : _c.en),
            type: aiAffirmation.type,
            createdAt: aiAffirmation.createdAt
        };
        return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, responseData, statusCodes_1.default.SUCCESS);
    }),
    addView: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        const { affirmation_id } = data;
        const updateAffirmation = yield user_affirmation_model_1.default.findOneAndUpdate({
            _id: (0, common_helper_1.convertToObjectId)(affirmation_id),
            status: workflow_constant_1.USER_STATUS.ACTIVE,
        }, {
            // add user_id only if not already exists
            $addToSet: {
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
            },
        }, {
            new: true,
        });
        if (!updateAffirmation) {
            return (0, response_util_1.showResponse)(false, "Affirmation not found", null, statusCodes_1.default.API_ERROR);
        }
        return (0, response_util_1.showResponse)(true, "User added successfully", updateAffirmation, statusCodes_1.default.SUCCESS);
    }),
};
exports.default = affirmationHandler;
