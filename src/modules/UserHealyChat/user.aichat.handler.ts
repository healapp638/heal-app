import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import userAichatConversation from "./user.aichat.conversation.model";
import { convertToObjectId } from "../../helpers/common.helper";
import messageModel from "./user.aichat.message.model";
import userAichatConversationModel from "./user.aichat.conversation.model";
import * as commonHelper from "../../helpers/common.helper";
import userAuthModel from "../UserAuth/user.auth.model";
import { languages, USER_STATUS,questions } from "../../constants/workflow.constant";
import { translateHealyText,detectLanguage } from "../../helpers/langauge.translate.helper";
import OpenAI from "openai";
import { APP } from "../../constants/app.constant";

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

sendMessage: async (data: any,user_id: string): Promise<ApiResponse> => {
    try {
        const { conversation_id, message, role } = data;

        if (!message?.trim()) {
            return showResponse(false,"Message is required",null,statusCodes.VALIDATION_ERROR);
        }
        

        let finalConversationId = conversation_id;

        // =========================================
        // USER LANGUAGE
        // =========================================

        const user = await userAuthModel.findOne({
            _id: convertToObjectId(user_id),
            status: USER_STATUS.ACTIVE,
        });

        const userLanguage = user?.language || "en";

        // =========================================
        // OPENAI CONFIG
        // =========================================

        const openai = new OpenAI({
            apiKey: APP.OPENAI_API_KEY,
        });

        // =========================================
        // TRANSLATE USER MESSAGE
        // =========================================

        const translatedMessage: any = {};

        const langs: any =
            Object.values(languages);

        let detectedMessageLanguage =
         await detectLanguage(message);

        if (!langs.includes(detectedMessageLanguage)) {
            detectedMessageLanguage = "en";
        }

        await Promise.all(
            langs.map(async (lang: string) => {
                translatedMessage[lang] = await translateHealyText(message,detectedMessageLanguage,lang);
            })
        );

        // =========================================
        // CREATE CONVERSATION
        // =========================================

        if (!conversation_id ||!conversation_id.trim() || conversation_id == null) {

            let shortTitle = "New Chat";

            try {

                const titleResponse = await openai.chat.completions.create({
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

                shortTitle = titleResponse.choices?.[0]?.message?.content?.trim()?.replace(/["']/g, "") || "New Chat";

            } catch (err) {
                console.log(err,"TITLE_GENERATION_ERROR");
            }

            const translatedTitle: any = {};

            let detectedTitleLanguage = await detectLanguage(shortTitle);

            if (!langs.includes(detectedTitleLanguage)) {
                detectedTitleLanguage = "en";
            }

            await Promise.all(
                langs.map(async (lang: string) => {

                    translatedTitle[lang] =await translateHealyText(shortTitle,detectedTitleLanguage,lang);
                })
            );

            const createConversation = await userAichatConversation.create({user_id:convertToObjectId(user_id),title: translatedTitle,});

            finalConversationId =createConversation._id;
        }

        // =========================================
        // FIND LAST SEQUENCE
        // =========================================

        const lastMessage = await messageModel.findOne({conversation_id:convertToObjectId(finalConversationId)}).sort({sequence: -1,});

        const nextSequence = lastMessage?.sequence ? lastMessage.sequence + 1: 1;

        // =========================================
        // SAVE USER MESSAGE
        // =========================================

        const createUserMessage: any = await messageModel.create({
                conversation_id:convertToObjectId(finalConversationId),
                user_id:convertToObjectId(user_id),
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

Your role is to help users feel genuinely understood while guiding them toward deeper self-awareness.

You are not limited to providing emotional validation. You help users explore what they are experiencing, understand why they may be feeling that way, recognize patterns in their thoughts and behaviors, and discover insights about themselves.

CONVERSATION PHILOSOPHY

People often come to Healy for more than advice.

They want:

* To feel heard.
* To make sense of their emotions.
* To understand themselves better.
* To process difficult experiences.
* To talk through situations without being judged.
* To feel less alone.

Your goal is to create the feeling of a meaningful conversation with someone who is thoughtful, emotionally aware, and genuinely interested in understanding them.

HOW TO RESPOND

Before offering suggestions, spend time understanding the user's experience.

When appropriate:

* Reflect emotions you notice.
* Identify underlying concerns, fears, needs, or conflicts.
* Help users connect feelings with possible causes.
* Explore emotional patterns.
* Explain psychological or emotional mechanisms in simple language.
* Offer observations and insights.
* Ask relevant follow-up questions that deepen understanding.
* Encourage reflection rather than immediately solving the problem.
* Help users discover their own answers.

DEPTH OVER SPEED

Do not stop after acknowledging emotions.

Move the conversation forward by helping users explore:

* Why they might feel this way.
* What may be contributing to it.
* What emotional needs may be present.
* What internal conflicts may exist.
* What patterns may be repeating.

EXAMPLES OF GOOD EXPLORATION

Instead of only saying:

"That sounds difficult."

You may continue with:

"Sometimes situations like this create a conflict between what we want and what we think we should want. Reading your message, I wonder if part of the frustration comes from feeling pulled in two different directions."

Or:

"It sounds like you're carrying more than just disappointment. There may also be some self-pressure underneath it. Often when people care deeply about something, setbacks can start feeling like a reflection of who they are rather than simply what happened."

CONVERSATION STYLE

* Warm and natural.
* Curious without being intrusive.
* Emotionally intelligent.
* Insightful without sounding clinical.
* Thoughtful rather than motivational.
* Conversational rather than scripted.

AVOID

* Generic self-help advice.
* Therapy clichés.
* Excessive positivity.
* Motivational speaker language.
* Repetitive validation.
* Formulaic responses.


ONGOING CONVERSATIONS

Do not treat every user message as a new topic.

If the user has shared details earlier in the conversation:

- remember them
- reference them naturally
- build upon them
- notice recurring themes

Avoid repeatedly introducing yourself or re-validating the same emotion.

Instead, deepen the conversation and help the user connect ideas across different parts of their experience.


LENGTH

Match the user's needs.

For emotional or personal topics, responses can be several thoughtful paragraphs when deeper exploration would help.

Do not artificially shorten responses if the conversation would benefit from more depth.

The user should leave feeling:

"I feel understood."

"I learned something about myself."

"I want to continue this conversation."


        `;

        // =========================================
        // AI RESPONSE
        // =========================================

        // const aiResponse = await openai.chat.completions.create({
        //         model: "gpt-4.1-mini",
        //         messages: [
        //             {
        //                 role: "system",
        //                 content: systemPrompt,
        //             },
        //             {
        //                 role: "user",
        //                 content: message,
        //             },
        //         ],

        //         temperature: 0.7,
        //         max_tokens: 1200,
        //     });

        const conversationMessages = await messageModel
    .find({
        conversation_id: convertToObjectId(finalConversationId),
    })
    .sort({ sequence: -1 })
    .limit(20);


    conversationMessages.reverse();
    // Build history for OpenAI
    const history: any[] = [];

    conversationMessages.forEach((msg:any) => {
    const content =
    msg?.message?.[userLanguage] ||
    msg?.message?.en ||
    "";

        history.push({
            role: msg.role === "ai" ? "assistant" : "user",
            content,
        });
    });

    const aiResponse = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...history,
        ],
        temperature: 0.9,
        max_tokens: 1000,
    });

        const aiMessage = aiResponse?.choices?.[0]
                ?.message?.content || "";

        // =========================================
        // TRANSLATE AI MESSAGE
        // =========================================

        const translatedAiMessage: any = {};

        let detectedAiMessageLanguage = await detectLanguage(aiMessage);

        if (!langs.includes(detectedAiMessageLanguage)) {
            detectedAiMessageLanguage = "en";
        }

        await Promise.all(
            langs.map(async (lang: string) => {
                translatedAiMessage[lang] = await translateHealyText(aiMessage,detectedAiMessageLanguage,lang);
            })
        );

        // =========================================
        // SAVE AI MESSAGE
        // =========================================

        const createAiMessage: any = await messageModel.create({
                conversation_id:convertToObjectId(finalConversationId),
                user_id:convertToObjectId(user_id),
                role: "ai",
                message: translatedAiMessage,
                unix: `${Date.now()}`,
                sequence: nextSequence + 1,
            });

        // =========================================
        // UPDATE CONVERSATION
        // =========================================

        await userAichatConversation.updateOne(
            {
                _id: convertToObjectId(finalConversationId),
            },
            {
                $set: {
                    updatedAt: new Date(),
                },

                $inc: {
                    total_messages: 2,
                },
            }
        );

        // =========================================
        // RESPONSE
        // =========================================

        return showResponse(
            true,
            responseMessage.common.data_save,
            {
                conversation_id:finalConversationId,
                user_message: {
                    _id: createUserMessage._id,
                    role: createUserMessage.role,
                    message:createUserMessage?.message?.[userLanguage] ||createUserMessage?.message?.en,
                    sequence:createUserMessage.sequence,
                },
                ai_message: {
                    _id: createAiMessage._id,
                    role: createAiMessage.role,
                    message:createAiMessage?.message?.[userLanguage] ||createAiMessage?.message?.en,
                    sequence:createAiMessage.sequence,
                },
            },
            statusCodes.SUCCESS
        );

    } catch (error) {

        console.log(error,"SEND_MESSAGE_ERROR");

        return showResponse(false,responseMessage.common.server_error,null,statusCodes.API_ERROR);
    }
},

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

getRandomQuestions: async (user_id: string): Promise<ApiResponse> => {

    try {

        // =========================================
        // USER
        // =========================================

        const user = await userAuthModel.findOne({
            _id: convertToObjectId(user_id),
            status: USER_STATUS.ACTIVE
        });

        if (!user) {

            return showResponse(
                false,
                "User not found",
                null,
                statusCodes.NOT_FOUND
            );
        }

        const userLanguage = user?.language || "en";

        // =========================================
        // RANDOM REFERENCE QUESTION
        // =========================================

        const randomQuestion:any =
            questions[Math.floor(Math.random() * questions.length)];

        const referenceQuestion =
            randomQuestion[userLanguage] || randomQuestion.en;

        // =========================================
        // OPENAI
        // =========================================

        const openai = new OpenAI({
            apiKey: APP.OPENAI_API_KEY,
        });

        // =========================================
        // LANGUAGE MAP
        // =========================================

        const languageMap: any = {
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

        const languageName =
            languageMap[userLanguage] || "English";

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

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You generate emotional wellness reflection questions."
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

        const generatedQuestion =
            completion.choices?.[0]?.message?.content?.trim();

        return showResponse(
            true,
            responseMessage.common.data_retreive_sucess,
            {
                question: generatedQuestion
            },
            statusCodes.SUCCESS
        );

    } catch (error) {

        console.log(error, "GET_RANDOM_QUESTIONS_ERROR");

        return showResponse(
            false,
            responseMessage.common.server_error,
            null,
            statusCodes.API_ERROR
        );
    }
},

getConversationMessages: async (data: any,user_id: string): Promise<ApiResponse> => {
    try {

        const {conversation_id,page ,limit } = data;


        // =========================================
        // CHECK CONVERSATION
        // =========================================

        console.log(conversation_id,"conversation_id");

        if(conversation_id == " " || conversation_id == null || conversation_id == undefined){
            return showResponse(true,responseMessage.common.data_retreive_sucess,[],statusCodes.SUCCESS);
        }

        const conversation = await userAichatConversationModel.findOne({
            _id: convertToObjectId(conversation_id),
            user_id: convertToObjectId(user_id),
            status: 1,
        });

        if (!conversation) {
            return showResponse(false,"Conversation not found",null,statusCodes.NOT_FOUND);
        }

        const user = await userAuthModel.findOne({_id: convertToObjectId(user_id),status: USER_STATUS.ACTIVE});

        const userLanguage =
            user?.language || "en";

        // =========================================
        // AGGREGATE
        // =========================================

        const aggregate: any = [
            {
                $match: {
                    conversation_id: convertToObjectId(conversation_id),
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

        const {totalCount,aggregation} = await commonHelper.getCountAndPagination(messageModel,aggregate,page,limit);
        const result = await messageModel.aggregate(aggregation);
        return showResponse(true,responseMessage.common.data_retreive_sucess,{
                result,
                totalCount,
            },statusCodes.SUCCESS
        );

    } catch (error) {
        console.log(error,"GET_CONVERSATION_MESSAGES_ERROR");
        return showResponse(false,responseMessage.common.server_error,null,statusCodes.API_ERROR);
    }
},
aiSupportResponse: async (data: any): Promise<ApiResponse> => {

    try {

        const {message} = data;


        // =========================
        // OPENAI CONFIG
        // =========================

        const openai = new OpenAI({
            apiKey: APP.OPENAI_API_KEY,
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

        const response =
            await openai.chat.completions.create({
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

        const aiMessage =
            response?.choices?.[0]?.message?.content || "";

        // =========================
        // RETURN
        // =========================

        return showResponse(
            true,
            "AI response generated successfully",
            {
                response: aiMessage,
            },
            statusCodes.SUCCESS
        );

    } catch (error: any) {

        console.log(
            error,
            "AI_SUPPORT_RESPONSE_ERROR"
        );

        return showResponse(
            false,
            error?.message ||
                "Failed to generate AI response",
            null,
            statusCodes.API_ERROR
        );
    }
},
deleteConversation: async (conversation_id: string, user_id: string): Promise<ApiResponse> => {
    try {
        // =========================
        // USER
        // =========================
        const userData = await userAuthModel.findOne({_id: convertToObjectId(user_id),status: USER_STATUS.ACTIVE});

        if (!userData) {
            return showResponse(false,responseMessage.common.not_exist,null,statusCodes.NOT_FOUND);
        }

        // =========================
        // CONVERSATION
        // =========================
        const conversationData = await userAichatConversation.findOne({_id: convertToObjectId(conversation_id),user_id: convertToObjectId(user_id),status: USER_STATUS.ACTIVE});

        if (!conversationData) {
            return showResponse(false,responseMessage.common.not_exist,null,statusCodes.NOT_FOUND);
        }

        // =========================
        // DELETE CONVERSATION
        // =========================
        conversationData.status = 2;
        await conversationData.save();

        // =========================
        // DELETE MESSAGES
        // =========================
        await messageModel.updateMany({conversation_id: convertToObjectId(conversation_id)}, {status: 2});

        // =========================
        // RETURN
        // =========================
        return showResponse(true,"Conversation deleted successfully",{conversation_id:conversationData._id},statusCodes.SUCCESS);
    } catch (error: any) {
        console.log(error,"DELETE_CONVERSATION_ERROR");
        return showResponse(false,responseMessage.common.server_error,null,statusCodes.API_ERROR);
    }
},


getConversationListing: async (page: number = 1,limit: number = 10,search: string = "",sort_column: string = "updatedAt",sort_direction: string = "desc",user_id: string,): Promise<ApiResponse> => {
    try {
        // =========================
        // USER
        // =========================
        console.log(page,"page")
        const userData = await userAuthModel.findOne({_id: convertToObjectId(user_id),status: USER_STATUS.ACTIVE});

        if (!userData) {
            return showResponse(false,responseMessage.common.not_exist,null,statusCodes.NOT_FOUND);
        }

        const userLanguage = userData?.language || "en";

        // =========================
        // MATCH
        // =========================

        const matchQuery: any = {user_id: convertToObjectId(user_id),status: USER_STATUS.ACTIVE};

        // =========================
        // AGGREGATE
        // =========================

        const aggregate: any = [

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
                    [sort_column]:
                        sort_direction === "asc"
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

        const {
            totalCount,
            aggregation,
        } =
            await commonHelper.getCountAndPagination(
                userAichatConversation,
                aggregate,
                page,
                limit
            );

        const result =
            await userAichatConversation.aggregate(
                aggregation
            );

        // =========================
        // RESPONSE
        // =========================

        return showResponse(
            true,
            responseMessage.common
                .data_retreive_sucess,
            {
                result,
                totalCount,
            },
            statusCodes.SUCCESS
        );

    } catch (error) {

        console.log(
            error,
            "GET_CONVERSATION_LISTING_ERROR"
        );

        return showResponse(
            false,
            responseMessage.common.server_error,
            null,
            statusCodes.API_ERROR
        );
    }
},

}

export default UserCommonHandler 
