import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Body, Security,Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from '../UserHealyChat/user.aichat.handler'
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes'
import { tryCatchWrapper } from '../../utils/config.util';
import { validateAiSupportResponse, validateConversationListing, validateGetMessageList, validatesendMessage } from './user.aichat.validator';

@Tags('User Healy Chat Routes')
@Route('/user/healyChat')  

export default class UserHealyChatController extends Controller {
    req: Request;
    res: Response;
    userId: string
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : ''
    }

    /**
     * send message
     */
    @Security('Bearer')
    @Post("sendMessage")
    public async sendMessage(@Body() request: { message: string, conversation_id?: string, role: string }): Promise<ApiResponse> {

        const validate = validatesendMessage(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.sendMessage);
        return wrappedFunc(request,this.userId); // Invoking the wrapped function 
    }

    /**
     * get random questions
     */
    @Security('Bearer')
    @Get("getRandomQuestions")
    public async getRandomQuestions(): Promise<ApiResponse> {

        const wrappedFunc = tryCatchWrapper(handler.getRandomQuestions);
        return wrappedFunc(this.userId); // Invoking the wrapped function 
    }

    /**
     * get message List
     */
    @Security('Bearer')
    @Post("getMessageList")
    public async getMessageList(@Body() request: { conversation_id: string ,page:number,limit:number}): Promise<ApiResponse> {

        const validate = validateGetMessageList(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.getConversationMessages);
        return wrappedFunc(request,this.userId); // Invoking the wrapped function 
    }


    
    /**
     * ai support response
     */
    @Security('Bearer')
    @Post("aiSupportResponse")
    public async aiSupportResponse(@Body() request: { message: string}): Promise<ApiResponse> {

        const validate = validateAiSupportResponse(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.aiSupportResponse);
        return wrappedFunc(request,this.userId); // Invoking the wrapped function 
    }

    /**
     * get conversations list
     */
    @Security('Bearer')
    @Get("getConversationList")
    public async getConversationList(@Query()page?: number ,@Query()limit?:number,@Query()search?:string,@Query()sort_column?:string,@Query()sort_direction?:string): Promise<ApiResponse> {

        const validate = validateConversationListing({page,limit,search,sort_column,sort_direction});
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.getConversationListing);
        return wrappedFunc(page,limit,search,sort_column,sort_direction,this.userId); // Invoking the wrapped function 
    }
}


