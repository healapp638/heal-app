import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Get, Security, FormField, Query, Body, Put } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from '../Common/common.handler'
import { showResponse } from '../../utils/response.util';
import { validateDeleteAccount, validateGetCommonContent, validateStoreParmeterToAws } from './common.validator';
import statusCodes from '../../constants/statusCodes'
import { tryCatchWrapper } from '../../utils/config.util';


@Tags('Common')
@Route('/common')

export default class CommonController extends Controller {
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
   * Get Common Content info
   */
    @Security('Bearer')
    @Get("/common_content")
    public async getCommonContent(@Query() type: string,@Query() lang: string): Promise<ApiResponse> {
        const validate = validateGetCommonContent({ lang ,type});
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.getCommonContent);
        return wrappedFunc(type,lang); // Invoking the wrapped function 
    }
    //ends

    /**
   * Get Faq Questions
   */
    @Security('Bearer')
    @Get("/questions")
    public async getQuestions(): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.getQuestions);
        return wrappedFunc(); // Invoking the wrapped function 
    }
    //ends

    /**
* Post parameter to aws 
*/
    @Post("/store_parameter_to_aws")
    public async storeParameterToAws(@FormField() name: string, @FormField() value: string): Promise<ApiResponse> {

        const validate = validateStoreParmeterToAws({ name, value });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.storeParameterToAws);
        return wrappedFunc(name, value); // Invoking the wrapped function 
    }
    //ends


    /**
   * Test endpoint to trigger a handled error for logging verification
   * GET /admin/test-error
   */
    @Get('test-error')
    public async testError(): Promise<ApiResponse> {

    const wrappedFunc = tryCatchWrapper(async () => {

        throw new Error('Test Handled Error - Verify logging');
    });
    return wrappedFunc();
    }
 
  /**
   * Test endpoint to trigger an uncaught exception for logging verification
   * GET /admin/test-exception
   */
  @Get('test-exception')
  async testException() {
    setTimeout(() => {
      throw new Error('Test Uncaught Exception - Verify logging');
    }, 100);
    return showResponse(
    true,
    "Uncaught exception triggered. Check logs/exceptions.",
    null,
    statusCodes.SERVER_TRYCATCH_ERROR
);
  }
 
  /**
   * Test endpoint to trigger an unhandled rejection for logging verification
   * GET /admin/test-rejection
   */
  @Get('test-rejection')
  async testRejection() {
    Promise.reject(new Error('Test Unhandled Rejection - Verify logging'));
    return showResponse(
    true,
    "Unhandled rejection triggered. Check logs/rejections.",
    null,
    statusCodes.SERVER_TRYCATCH_ERROR
);
}

/**
* delete user account
* 
*/
    @Put("/delete_account")
    public async deleteAccount(@Body() request: { email: string, otp: string }): Promise<ApiResponse> {
        const validate = validateDeleteAccount(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteAccount);
        return wrappedFunc(request); 
    } //ends
}





