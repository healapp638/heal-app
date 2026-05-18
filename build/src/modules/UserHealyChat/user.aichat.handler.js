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
const responseMessages_1 = __importDefault(require("../../constants/responseMessages"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const user_aichat_conversation_model_1 = __importDefault(require("./user.aichat.conversation.model"));
const common_helper_1 = require("../../helpers/common.helper");
const user_aichat_message_model_1 = __importDefault(require("./user.aichat.message.model"));
const user_aichat_conversation_model_2 = __importDefault(require("./user.aichat.conversation.model"));
const commonHelper = __importStar(require("../../helpers/common.helper"));
const UserCommonHandler = {
    sendMessage: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { conversation_id, message, role } = data;
            let finalConversationId = conversation_id;
            // =========================================
            // CREATE CONVERSATION IF NOT EXISTS
            // =========================================
            if (!conversation_id) {
                // title from first message
                const title = message.trim().length > 40 ? `${message.trim().slice(0, 40)}...` : message.trim();
                const createConversation = yield user_aichat_conversation_model_1.default.create({ user_id: (0, common_helper_1.convertToObjectId)(user_id), title });
                finalConversationId = createConversation._id;
                console.log(createConversation, "createConversation---------------------------");
            }
            // =========================================
            // FIND LAST SEQUENCE
            // =========================================
            const lastMessage = yield user_aichat_message_model_1.default.findOne({ conversation_id: (0, common_helper_1.convertToObjectId)(finalConversationId) }).sort({ sequence: -1 });
            const nextSequence = (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.sequence) ? lastMessage.sequence + 1 : 1;
            // =========================================
            // SAVE MESSAGE
            // =========================================
            const createMessage = yield user_aichat_message_model_1.default.create({
                conversation_id: (0, common_helper_1.convertToObjectId)(finalConversationId),
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                role,
                message: message.trim(),
                unix: `${Date.now()}`,
                sequence: nextSequence,
            });
            console.log(createMessage, "createMessage---------------------------");
            if (!createMessage) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.save_failed, null, statusCodes_1.default.API_ERROR);
            }
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, {
                conversation_id: finalConversationId, message: createMessage
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "SEND_MESSAGE_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    getRandomQuestions: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const questions = [
                "How have you been feeling lately?",
                "What’s been on your mind?",
                "What’s hurting you right now?",
                "What makes you feel safe?",
                "What are you avoiding?",
                "What do you miss most?",
                "When do you feel alone?",
                "What drains your energy?",
                "What brings you peace?",
                "What scares you lately?",
                "What are you holding in?",
                "What do you need most?",
                "Who understands you best?",
                "What keeps you going?",
                "What are you overthinking?",
                "What makes you feel loved?",
                "What are you afraid to lose?",
                "What do you want to change?",
                "What are you struggling with?",
                "What makes you feel seen?",
                "What do you regret most?",
                "What motivates you lately?",
                "What are you grateful for?",
                "What feels heavy today?",
                "What do you hide from others?",
                "What helps you heal?",
                "What are you searching for?",
                "What do you fear most?",
                "What makes you feel alive?",
                "What does your heart need?"
            ];
            // shuffle
            const shuffled = questions.sort(() => 0.5 - Math.random());
            // pick random 5
            const randomQuestions = shuffled.slice(0, 5);
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, randomQuestions, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "GET_RANDOM_QUESTIONS_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    getConversationMessages: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { conversation_id, page = 1, limit = 20 } = data;
            // =========================================
            // CHECK CONVERSATION
            // =========================================
            const conversation = yield user_aichat_conversation_model_2.default.findOne({
                _id: (0, common_helper_1.convertToObjectId)(conversation_id),
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                status: 1,
            });
            if (!conversation) {
                return (0, response_util_1.showResponse)(false, "Conversation not found", null, statusCodes_1.default.NOT_FOUND);
            }
            // =========================================
            // AGGREGATE
            // =========================================
            const aggregate = [
                {
                    $match: {
                        conversation_id: (0, common_helper_1.convertToObjectId)(conversation_id),
                        status: 1,
                    },
                },
                {
                    $sort: { sequence: 1, },
                },
                {
                    $project: {
                        _id: 1,
                        conversation_id: 1,
                        role: 1,
                        message: 1,
                        unix: 1,
                        sequence: 1,
                        createdAt: 1,
                    },
                },
            ];
            // =========================================
            // PAGINATION
            // =========================================
            const { totalCount, aggregation } = yield commonHelper.getCountAndPagination(user_aichat_message_model_1.default, aggregate, page, limit);
            const result = yield user_aichat_message_model_1.default.aggregate(aggregation);
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, {
                result,
                totalCount,
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "GET_CONVERSATION_MESSAGES_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
};
exports.default = UserCommonHandler;
