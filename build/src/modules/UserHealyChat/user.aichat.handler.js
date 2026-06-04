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
const user_auth_model_1 = __importDefault(require("../UserAuth/user.auth.model"));
const workflow_constant_1 = require("../../constants/workflow.constant");
const langauge_translate_helper_1 = require("../../helpers/langauge.translate.helper");
const openai_1 = __importDefault(require("openai"));
const app_constant_1 = require("../../constants/app.constant");
const UserCommonHandler = {
    // sendMessage: async (data: any,user_id: string): Promise<ApiResponse> => {
    //     try {
    //         const {conversation_id,message,role} = data;
    //         if (!message?.trim()) {
    //             return showResponse(false,"Message is required",null,statusCodes.VALIDATION_ERROR);
    //         }
    //         let finalConversationId = conversation_id;
    //         // =========================================
    //         // USER LANGUAGE
    //         // =========================================
    //         const user = await userAuthModel.findOne({_id: convertToObjectId(user_id),status: USER_STATUS.ACTIVE});
    //         const userLanguage =
    //             user?.language || "en";
    //         // =========================================
    //         // TRANSLATE MESSAGE
    //         // =========================================
    //         const translatedMessage: any = {};
    //         const langs:any = Object.values(languages);
    //         await Promise.all(
    //             langs.map(async (lang: string) => {
    //                 translatedMessage[lang] =await translateText(message,lang);
    //             })
    //         );
    //         // =========================================
    //         // CREATE CONVERSATION
    //         // =========================================
    //         if (!conversation_id) {
    //             // const shortTitle = message.trim().length > 40 ? `${message.trim().slice(0, 40)}...` : message.trim();
    //             let shortTitle = "New Chat";
    //             try {
    //         const openai = new OpenAI({
    //             apiKey: APP.OPENAI_API_KEY,
    //         });
    //                 const titleResponse =
    //                     await openai.chat.completions.create({
    //                         model: "gpt-4.1-mini",
    //                         messages: [
    //                             {
    //                                 role: "system",
    //                                 content: `
    //                             Generate a very short conversation title.
    //                             Rules:
    //                             - Maximum 4 words
    //                             - Human readable
    //                             - No quotes
    //                             - No emojis
    //                             - Summarize the user's message
    //                             - Keep it emotionally meaningful
    //                             `,
    //                         },
    //                         {
    //                             role: "user",
    //                             content: message,
    //                         },
    //                     ],
    //                     max_tokens: 12,
    //                     temperature: 0.7,
    //                 });
    //                 shortTitle =
    //                     titleResponse.choices?.[0]?.message?.content
    //                         ?.trim()
    //                         ?.replace(/["']/g, "") || "New Chat";
    //             } catch (err) {
    //                 console.log(err, "TITLE_GENERATION_ERROR");
    //             }
    //             const translatedTitle: any = {};
    //             await Promise.all(
    //                 langs.map(async (lang: string) => {
    //                     translatedTitle[lang] =await translateText(shortTitle,lang);
    //                 })
    //             );
    //             const createConversation = await userAichatConversation.create({user_id:convertToObjectId(user_id),title: translatedTitle,});
    //             finalConversationId =createConversation._id;
    //             console.log(createConversation,"createConversation---------------------------");
    //         }
    //         // =========================================
    //         // FIND LAST SEQUENCE
    //         // =========================================
    //         const lastMessage =await messageModel.findOne({conversation_id:convertToObjectId(finalConversationId),}).sort({sequence: -1,});
    //         const nextSequence =lastMessage?.sequence ? lastMessage.sequence + 1 : 1;
    //         // =========================================
    //         // SAVE MESSAGE
    //         // =========================================
    //         const createMessage:any = await messageModel.create({
    //                 conversation_id:convertToObjectId(finalConversationId),
    //                 user_id:convertToObjectId(user_id),
    //                 role,
    //                 message: translatedMessage,
    //                 unix: `${Date.now()}`,
    //                 sequence: nextSequence,
    //             });
    //         console.log(createMessage,"createMessage---------------------------");
    //         if (!createMessage) {
    //             return showResponse(false,responseMessage.common.save_failed,null,statusCodes.API_ERROR);
    //         }
    //         // =========================================
    //         // RESPONSE MESSAGE
    //         // =========================================
    //         const responseData = {
    //             _id: createMessage._id,
    //             conversation_id:createMessage.conversation_id,
    //             role: createMessage.role,
    //             message:createMessage?.message?.[userLanguage] || createMessage?.message?.en,
    //             unix: createMessage.unix,
    //             sequence:createMessage.sequence,
    //             createdAt:createMessage.createdAt,
    //         };
    //         return showResponse(true,responseMessage.common.data_save,{conversation_id:finalConversationId,message: responseData},statusCodes.SUCCESS);
    //     } catch (error) {
    //         console.log(error,"SEND_MESSAGE_ERROR");
    //         return showResponse(false,responseMessage.common.server_error,null,statusCodes.API_ERROR);
    //     }
    // },
    sendMessage: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            const { conversation_id, message, role } = data;
            if (!(message === null || message === void 0 ? void 0 : message.trim())) {
                return (0, response_util_1.showResponse)(false, "Message is required", null, statusCodes_1.default.VALIDATION_ERROR);
            }
            let finalConversationId = conversation_id;
            // =========================================
            // USER LANGUAGE
            // =========================================
            const user = yield user_auth_model_1.default.findOne({
                _id: (0, common_helper_1.convertToObjectId)(user_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE,
            });
            const userLanguage = (user === null || user === void 0 ? void 0 : user.language) || "en";
            // =========================================
            // OPENAI CONFIG
            // =========================================
            const openai = new openai_1.default({
                apiKey: app_constant_1.APP.OPENAI_API_KEY,
            });
            // =========================================
            // TRANSLATE USER MESSAGE
            // =========================================
            const translatedMessage = {};
            const langs = Object.values(workflow_constant_1.languages);
            let detectedMessageLanguage = yield (0, langauge_translate_helper_1.detectLanguage)(message);
            if (!langs.includes(detectedMessageLanguage)) {
                detectedMessageLanguage = "en";
            }
            yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                translatedMessage[lang] = yield (0, langauge_translate_helper_1.translateHealyText)(message, detectedMessageLanguage, lang);
            })));
            // =========================================
            // CREATE CONVERSATION
            // =========================================
            if (!conversation_id || !conversation_id.trim() || conversation_id == null) {
                let shortTitle = "New Chat";
                try {
                    const titleResponse = yield openai.chat.completions.create({
                        model: "gpt-4.1-mini",
                        messages: [
                            {
                                role: "system",
                                content: `
                                Generate a very short conversation title.
                                Rules:
                                - Maximum 4 words
                                - Human readable
                                - No quotes
                                - No emojis
                                - Summarize the user's message
                                `,
                            },
                            {
                                role: "user",
                                content: message,
                            },
                        ],
                        max_tokens: 12,
                        temperature: 0.7,
                    });
                    shortTitle = ((_e = (_d = (_c = (_b = (_a = titleResponse.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim()) === null || _e === void 0 ? void 0 : _e.replace(/["']/g, "")) || "New Chat";
                }
                catch (err) {
                    console.log(err, "TITLE_GENERATION_ERROR");
                }
                const translatedTitle = {};
                let detectedTitleLanguage = yield (0, langauge_translate_helper_1.detectLanguage)(shortTitle);
                if (!langs.includes(detectedTitleLanguage)) {
                    detectedTitleLanguage = "en";
                }
                yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                    translatedTitle[lang] = yield (0, langauge_translate_helper_1.translateHealyText)(shortTitle, detectedTitleLanguage, lang);
                })));
                const createConversation = yield user_aichat_conversation_model_1.default.create({ user_id: (0, common_helper_1.convertToObjectId)(user_id), title: translatedTitle, });
                finalConversationId = createConversation._id;
            }
            // =========================================
            // FIND LAST SEQUENCE
            // =========================================
            const lastMessage = yield user_aichat_message_model_1.default.findOne({ conversation_id: (0, common_helper_1.convertToObjectId)(finalConversationId) }).sort({ sequence: -1, });
            const nextSequence = (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.sequence) ? lastMessage.sequence + 1 : 1;
            // =========================================
            // SAVE USER MESSAGE
            // =========================================
            const createUserMessage = yield user_aichat_message_model_1.default.create({
                conversation_id: (0, common_helper_1.convertToObjectId)(finalConversationId),
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                role: role || "user",
                message: translatedMessage,
                unix: `${Date.now()}`,
                sequence: nextSequence,
            });
            // =========================================
            // SYSTEM PROMPT
            // =========================================
            const systemPrompt = `
           You are Healy, an emotionally intelligent AI companion.

Your purpose is not to give generic advice.

Your purpose is to help people feel understood, supported, and less alone.

CORE PRINCIPLES

1. Understand before advising.
2. Reflect the user's emotional experience.
3. Respond like a thoughtful human, not a therapist.
4. Avoid generic self-help responses.
5. Avoid sounding scripted.
6. Avoid repeating common wellness clichés.
7. Match the emotional tone of the user.
8. Be warm, natural, and conversational.

RESPONSE STYLE

When appropriate:

* Acknowledge what the user is experiencing.
* Reflect emotions you notice.
* Show curiosity.
* Ask thoughtful follow-up questions.
* Help users explore their thoughts.
* Offer perspective rather than instructions.

DO NOT:

* Immediately jump to solutions.

* Overuse phrases like:

  * "Be kind to yourself"
  * "Everything happens for a reason"
  * "Take a deep breath"
  * "Focus on the positive"
  * "Trust the process"

* Sound like a therapist writing clinical notes.

* Sound robotic.

* Sound overly cheerful.

* Use motivational speaker language.

GOOD RESPONSE FLOW

1. Notice what the user is feeling.
2. Respond to that feeling.
3. Add thoughtful reflection.
4. Optionally ask one meaningful question.

EXAMPLE

User:
"I feel like I'm falling behind everyone else."

Weak:
"Everyone moves at their own pace. Stay positive."

Better:
"Feeling behind can be exhausting, especially when it seems like everyone else is moving forward while you're standing still. Sometimes the hardest part isn't where we are—it's the comparison happening in the background. What's been making that feeling stronger lately?"

LENGTH

* Usually 2-6 sentences.
* Be concise but meaningful.
* Prioritize quality over quantity.

        `;
            // =========================================
            // AI RESPONSE
            // =========================================
            const aiResponse = yield openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
            const aiMessage = ((_h = (_g = (_f = aiResponse === null || aiResponse === void 0 ? void 0 : aiResponse.choices) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.content) || "";
            // =========================================
            // TRANSLATE AI MESSAGE
            // =========================================
            const translatedAiMessage = {};
            let detectedAiMessageLanguage = yield (0, langauge_translate_helper_1.detectLanguage)(aiMessage);
            if (!langs.includes(detectedAiMessageLanguage)) {
                detectedAiMessageLanguage = "en";
            }
            yield Promise.all(langs.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                translatedAiMessage[lang] = yield (0, langauge_translate_helper_1.translateHealyText)(aiMessage, detectedAiMessageLanguage, lang);
            })));
            // =========================================
            // SAVE AI MESSAGE
            // =========================================
            const createAiMessage = yield user_aichat_message_model_1.default.create({
                conversation_id: (0, common_helper_1.convertToObjectId)(finalConversationId),
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                role: "ai",
                message: translatedAiMessage,
                unix: `${Date.now()}`,
                sequence: nextSequence + 1,
            });
            // =========================================
            // UPDATE CONVERSATION
            // =========================================
            yield user_aichat_conversation_model_1.default.updateOne({
                _id: (0, common_helper_1.convertToObjectId)(finalConversationId),
            }, {
                $set: {
                    updatedAt: new Date(),
                },
                $inc: {
                    total_messages: 2,
                },
            });
            // =========================================
            // RESPONSE
            // =========================================
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_save, {
                conversation_id: finalConversationId,
                user_message: {
                    _id: createUserMessage._id,
                    role: createUserMessage.role,
                    message: ((_j = createUserMessage === null || createUserMessage === void 0 ? void 0 : createUserMessage.message) === null || _j === void 0 ? void 0 : _j[userLanguage]) || ((_k = createUserMessage === null || createUserMessage === void 0 ? void 0 : createUserMessage.message) === null || _k === void 0 ? void 0 : _k.en),
                    sequence: createUserMessage.sequence,
                },
                ai_message: {
                    _id: createAiMessage._id,
                    role: createAiMessage.role,
                    message: ((_l = createAiMessage === null || createAiMessage === void 0 ? void 0 : createAiMessage.message) === null || _l === void 0 ? void 0 : _l[userLanguage]) || ((_m = createAiMessage === null || createAiMessage === void 0 ? void 0 : createAiMessage.message) === null || _m === void 0 ? void 0 : _m.en),
                    sequence: createAiMessage.sequence,
                },
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "SEND_MESSAGE_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    // getRandomQuestions: async (user_id: string): Promise<ApiResponse> => {
    //     try {
    //         // =========================================
    //         // USER LANGUAGE
    //         // =========================================
    //         const user =await userAuthModel.findOne({_id: convertToObjectId(user_id),status: USER_STATUS.ACTIVE});
    //         const userLanguage = user?.language || "en";
    //         // =========================================
    //         // QUESTIONS
    //         // =========================================
    //         // const questions = workflowConstant.questions;
    //         const finalQuestion = questions;
    //         // =========================================
    //         // RANDOM 5
    //         // =========================================
    //         const shuffled =finalQuestion.sort(() => 0.5 - Math.random());
    //         const randomQuestions =shuffled.slice(0, 5);
    //         // =========================================
    //         // LANGUAGE RESPONSE
    //         // =========================================
    //         const finalQuestions = randomQuestions.map((item: any) =>item[userLanguage] || item.en);
    //         return showResponse(true,responseMessage.common.data_retreive_sucess,finalQuestions,statusCodes.SUCCESS);
    //     } catch (error) {
    //         console.log(error,"GET_RANDOM_QUESTIONS_ERROR");
    //         return showResponse(false,responseMessage.common.server_error,null,statusCodes.API_ERROR);
    //     }
    // },
    getRandomQuestions: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            // =========================================
            // USER
            // =========================================
            const user = yield user_auth_model_1.default.findOne({
                _id: (0, common_helper_1.convertToObjectId)(user_id),
                status: workflow_constant_1.USER_STATUS.ACTIVE
            });
            if (!user) {
                return (0, response_util_1.showResponse)(false, "User not found", null, statusCodes_1.default.NOT_FOUND);
            }
            const userLanguage = (user === null || user === void 0 ? void 0 : user.language) || "en";
            // =========================================
            // RANDOM REFERENCE QUESTION
            // =========================================
            const randomQuestion = workflow_constant_1.questions[Math.floor(Math.random() * workflow_constant_1.questions.length)];
            const referenceQuestion = randomQuestion[userLanguage] || randomQuestion.en;
            // =========================================
            // OPENAI
            // =========================================
            const openai = new openai_1.default({
                apiKey: app_constant_1.APP.OPENAI_API_KEY,
            });
            // =========================================
            // LANGUAGE MAP
            // =========================================
            const languageMap = {
                en: "English",
                zh: "Chinese",
                hi: "Hindi",
                es: "Spanish",
                fr: "French",
                de: "German",
                ru: "Russian",
                pt: "Portuguese",
                it: "Italian",
                ro: "Romanian",
            };
            const languageName = languageMap[userLanguage] || "English";
            // =========================================
            // AI QUESTION GENERATION
            // =========================================
            const prompt = `
Generate ONE short emotional wellness reflection question.

Rules:
- Inspired by this question:
"${referenceQuestion}"

- Generate a NEW unique question.
- Keep same emotional and healing tone.
- Max 15 words.
- Human sounding.
- Do not copy the reference question.
- Return ONLY the question.
- Language must be ${languageName}.
`;
            const completion = yield openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: "You generate emotional wellness reflection questions."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.9,
                max_tokens: 60,
            });
            // =========================================
            // FINAL QUESTION
            // =========================================
            const generatedQuestion = (_d = (_c = (_b = (_a = completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim();
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, {
                question: generatedQuestion
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "GET_RANDOM_QUESTIONS_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    getConversationMessages: (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { conversation_id, page, limit } = data;
            // =========================================
            // CHECK CONVERSATION
            // =========================================
            console.log(conversation_id, "conversation_id");
            if (conversation_id == " " || conversation_id == null || conversation_id == undefined) {
                return (0, response_util_1.showResponse)(true, responseMessages_1.default.common.data_retreive_sucess, [], statusCodes_1.default.SUCCESS);
            }
            const conversation = yield user_aichat_conversation_model_2.default.findOne({
                _id: (0, common_helper_1.convertToObjectId)(conversation_id),
                user_id: (0, common_helper_1.convertToObjectId)(user_id),
                status: 1,
            });
            if (!conversation) {
                return (0, response_util_1.showResponse)(false, "Conversation not found", null, statusCodes_1.default.NOT_FOUND);
            }
            const user = yield user_auth_model_1.default.findOne({ _id: (0, common_helper_1.convertToObjectId)(user_id), status: workflow_constant_1.USER_STATUS.ACTIVE });
            const userLanguage = (user === null || user === void 0 ? void 0 : user.language) || "en";
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
                        message: {
                            $ifNull: [
                                `$message.${userLanguage}`,
                                "$message.en"
                            ]
                        },
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
    aiSupportResponse: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const { message } = data;
            // =========================
            // OPENAI CONFIG
            // =========================
            const openai = new openai_1.default({
                apiKey: app_constant_1.APP.OPENAI_API_KEY,
            });
            // =========================
            // SYSTEM PROMPT
            // =========================
            const systemPrompt = `
You are an emotionally supportive AI assistant inside a personal growth and emotional wellness app.

About the app:
- The app helps users improve emotional well-being and personal growth
- Users work through guided self-development modules
- Users journal their thoughts and emotions
- Users complete daily and weekly challenges
- Users receive affirmations and reflective guidance
- Your role is to support, encourage, and help users reflect safely

Your tone:
- Calm
- Supportive
- Empathetic
- Non-judgmental
- Human and conversational
- Encouraging but not overly dramatic

Rules:
- Keep responses concise and meaningful
- Encourage reflection and emotional awareness
- Never shame or criticize users
- Avoid toxic positivity
- Avoid medical diagnosis
- Do not claim to be a therapist
- Help users feel heard and supported
`;
            // =========================
            // OPENAI RESPONSE
            // =========================
            const response = yield openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
                temperature: 0.7,
                max_tokens: 300,
            });
            const aiMessage = ((_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "";
            // =========================
            // RETURN
            // =========================
            return (0, response_util_1.showResponse)(true, "AI response generated successfully", {
                response: aiMessage,
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "AI_SUPPORT_RESPONSE_ERROR");
            return (0, response_util_1.showResponse)(false, (error === null || error === void 0 ? void 0 : error.message) ||
                "Failed to generate AI response", null, statusCodes_1.default.API_ERROR);
        }
    }),
    deleteConversation: (conversation_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // =========================
            // USER
            // =========================
            const userData = yield user_auth_model_1.default.findOne({ _id: (0, common_helper_1.convertToObjectId)(user_id), status: workflow_constant_1.USER_STATUS.ACTIVE });
            if (!userData) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.NOT_FOUND);
            }
            // =========================
            // CONVERSATION
            // =========================
            const conversationData = yield user_aichat_conversation_model_1.default.findOne({ _id: (0, common_helper_1.convertToObjectId)(conversation_id), user_id: (0, common_helper_1.convertToObjectId)(user_id), status: workflow_constant_1.USER_STATUS.ACTIVE });
            if (!conversationData) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.NOT_FOUND);
            }
            // =========================
            // DELETE CONVERSATION
            // =========================
            conversationData.status = 2;
            yield conversationData.save();
            // =========================
            // DELETE MESSAGES
            // =========================
            yield user_aichat_message_model_1.default.updateMany({ conversation_id: (0, common_helper_1.convertToObjectId)(conversation_id) }, { status: 2 });
            // =========================
            // RETURN
            // =========================
            return (0, response_util_1.showResponse)(true, "Conversation deleted successfully", { conversation_id: conversationData._id }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "DELETE_CONVERSATION_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
    getConversationListing: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, search = "", sort_column = "updatedAt", sort_direction = "desc", user_id) {
        try {
            // =========================
            // USER
            // =========================
            console.log(page, "page");
            const userData = yield user_auth_model_1.default.findOne({ _id: (0, common_helper_1.convertToObjectId)(user_id), status: workflow_constant_1.USER_STATUS.ACTIVE });
            if (!userData) {
                return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.not_exist, null, statusCodes_1.default.NOT_FOUND);
            }
            const userLanguage = (userData === null || userData === void 0 ? void 0 : userData.language) || "en";
            // =========================
            // MATCH
            // =========================
            const matchQuery = { user_id: (0, common_helper_1.convertToObjectId)(user_id), status: workflow_constant_1.USER_STATUS.ACTIVE };
            // =========================
            // AGGREGATE
            // =========================
            const aggregate = [
                {
                    $match: matchQuery,
                },
                {
                    $addFields: {
                        title: {
                            $ifNull: [
                                `$title.${userLanguage}`,
                                "$title.en",
                            ],
                        },
                    },
                },
                // search
                ...(search
                    ? [
                        {
                            $match: {
                                title: {
                                    $regex: search,
                                    $options: "i",
                                },
                            },
                        },
                    ]
                    : []),
                // latest message
                // {
                //     $lookup: {
                //         from: "user_messages",
                //         let: {
                //             conversationId: "$_id",
                //         },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $eq: [
                //                             "$conversation_id",
                //                             "$$conversationId",
                //                         ],
                //                     },
                //                 },
                //             },
                //             {
                //                 $sort: {
                //                     sequence: -1,
                //                 },
                //             },
                //             {
                //                 $limit: 1,
                //             },
                //             {
                //                 $project: {
                //                     _id: 0,
                //                     message: {
                //                         $ifNull: [
                //                             `$message.${userLanguage}`,
                //                             "$message.en",
                //                         ],
                //                     },
                //                     role: 1,
                //                     createdAt: 1,
                //                 },
                //             },
                //         ],
                //         as: "lastMessage",
                //     },
                // },
                // {
                //     $unwind: {
                //         path: "$lastMessage",
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                {
                    $sort: {
                        [sort_column]: sort_direction === "asc"
                            ? 1
                            : -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        // lastMessage: 1,
                    },
                },
            ];
            // =========================
            // PAGINATION
            // =========================
            const { totalCount, aggregation, } = yield commonHelper.getCountAndPagination(user_aichat_conversation_model_1.default, aggregate, page, limit);
            const result = yield user_aichat_conversation_model_1.default.aggregate(aggregation);
            // =========================
            // RESPONSE
            // =========================
            return (0, response_util_1.showResponse)(true, responseMessages_1.default.common
                .data_retreive_sucess, {
                result,
                totalCount,
            }, statusCodes_1.default.SUCCESS);
        }
        catch (error) {
            console.log(error, "GET_CONVERSATION_LISTING_ERROR");
            return (0, response_util_1.showResponse)(false, responseMessages_1.default.common.server_error, null, statusCodes_1.default.API_ERROR);
        }
    }),
};
exports.default = UserCommonHandler;
