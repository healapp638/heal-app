import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import responseMessage from '../../constants/responseMessages'
import statusCodes from '../../constants/statusCodes'
import userAichatConversation from "./user.aichat.conversation.model";
import { convertToObjectId } from "../../helpers/common.helper";
import messageModel from "./user.aichat.message.model";
import userAichatConversationModel from "./user.aichat.conversation.model";
import * as commonHelper from "../../helpers/common.helper";

const UserCommonHandler = {

    sendMessage: async (data: any,user_id: string): Promise<ApiResponse> => {
    try {
        const {conversation_id,message,role} = data;

        let finalConversationId = conversation_id;

        // =========================================
        // CREATE CONVERSATION IF NOT EXISTS
        // =========================================

        if (!conversation_id) {

            // title from first message
            const title = message.trim().length > 40 ? `${message.trim().slice(0, 40)}...` : message.trim();
            const createConversation = await userAichatConversation.create({ user_id: convertToObjectId(user_id),title });
            finalConversationId = createConversation._id;
            console.log(createConversation,"createConversation---------------------------")
        }

        // =========================================
        // FIND LAST SEQUENCE
        // =========================================

        const lastMessage = await messageModel.findOne({conversation_id:convertToObjectId(finalConversationId)}).sort({ sequence: -1 });

        const nextSequence =lastMessage?.sequence ? lastMessage.sequence + 1 : 1;

        // =========================================
        // SAVE MESSAGE
        // =========================================

        const createMessage = await messageModel.create({
                conversation_id:convertToObjectId(finalConversationId), 
                user_id:convertToObjectId(user_id),
                role,
                message: message.trim(),
                unix: `${Date.now()}`,
                sequence: nextSequence,
            });
        console.log(createMessage,"createMessage---------------------------")
        if (!createMessage) {

            return showResponse(false,responseMessage.common.save_failed,null,statusCodes.API_ERROR);
        }

        return showResponse(true,responseMessage.common.data_save,{
            conversation_id:finalConversationId,message: createMessage},statusCodes.SUCCESS
        );

    } catch (error) {
        console.log(error,"SEND_MESSAGE_ERROR")
        return showResponse(false,responseMessage.common.server_error,null,statusCodes.API_ERROR);
    }
},
getRandomQuestions: async (): Promise<ApiResponse> => {

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

        return showResponse(true,responseMessage.common.data_retreive_sucess,randomQuestions,statusCodes.SUCCESS);

    } catch (error) {
        console.log(error,"GET_RANDOM_QUESTIONS_ERROR");
        return showResponse(false,responseMessage.common.server_error,null,statusCodes.API_ERROR);
    }
},

getConversationMessages: async (data: any,user_id: string): Promise<ApiResponse> => {
    try {

        const {conversation_id,page = 1,limit = 20} = data;


        // =========================================
        // CHECK CONVERSATION
        // =========================================

        const conversation = await userAichatConversationModel.findOne({
            _id: convertToObjectId(conversation_id),
            user_id: convertToObjectId(user_id),
            status: 1,
        });

        if (!conversation) {
            return showResponse(false,"Conversation not found",null,statusCodes.NOT_FOUND);
        }

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
}

export default UserCommonHandler 
