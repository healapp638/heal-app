import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Body, Security, Put, FormField, Delete, UploadedFile, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import { validateUpdateQuestion, validateAddQuestion, validateCommonContent, validateDeleteQuestion, validateResetCommonContent, validateEditAffirmation, validateDeleteAffirmation } from './admin.common.validator';
import handler from '../AdminCommon/admin.common.handler'
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes'
import { tryCatchWrapper } from '../../utils/config.util';



@Tags('Admin Common Routes')
@Route('/admin/common')

export default class AdminCommonController extends Controller {
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
* Add Question  endpoint
*/
    @Security('Bearer')
    @Post("/question")
    public async addQuestion(@Body() request: { question: string, answer: string }): Promise<ApiResponse> {

        const validate = validateAddQuestion(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.addQuestion);
        return wrappedFunc(request); // Invoking the wrapped function 
    }
    //ends

    /**
* Update Question endpoint
*/
    @Security('Bearer')
    @Put("/question")
    public async updateQuestion(@Body() request: { question_id: string, question: string, answer: string, language: string }): Promise<ApiResponse> {

        const validate = validateUpdateQuestion(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.updateQuestion);
        return wrappedFunc(request); // Invoking the wrapped function 
    }
    //ends

    /**
    * Delete Question endpoint
    */
    @Security('Bearer')
    @Delete("/question")
    public async deleteQuestion(@FormField() question_id: string): Promise<ApiResponse> {

        const validate = validateDeleteQuestion({ question_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.deleteQuestion);
        return wrappedFunc({ question_id }); // Invoking the wrapped function 
    }
    //ends

    /**
 * Update Common Content endpoint
 */
    @Security('Bearer')
    @Put("/common_content")
    public async updateCommonContent(@Body() request: { type: string, content: string, language: string }): Promise<ApiResponse> {

        const validate = validateCommonContent(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.updateCommonContent);
        return wrappedFunc(request); // Invoking the wrapped function 
    }
    //ends

    @Security('Bearer')
    @Put("/reset_common_content")
    public async resentCommonContent(@Body() request: { type: string }): Promise<ApiResponse> {

        const validate = validateResetCommonContent(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.resentCommonContent);
        return wrappedFunc(request); // Invoking the wrapped function 
    }
    //ends


    /**
 * Read Excel
 */
    @Post("/readExcel")
    public async excelRead(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse> {
        return handler.excelRead({ file })
    }
    //ends

        /**
 * Read Affirmation Excel
 */
    @Post("/readAffirmationExcel")
    public async excelAffirmationRead(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse> {
        return handler.addExcelAffirmation({ file })
    }
    //ends

    @Security('Bearer')
    @Get('/listExcelImports')
    public async listModule(@Query() page?: number, @Query() limit?: number, @Query() search?: string): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.listExcelImport);
        return wrappedFunc(page, limit, search); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post("/addAffirmation")
    public async affirmation(@Body() request: { affirmation: string }): Promise<ApiResponse> {

        // const validate = validateAffirmation(request);
        // if (validate.error) {
        //     return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        // }

        const wrappedFunc = tryCatchWrapper(handler.addAffirmation);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/listAffirmation')
    public async listAffirmation(@Query() page?: number, @Query() limit?: number,@Query() language?:string): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.listAffirmation);
        return wrappedFunc(page, limit,language); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Put("/editAffirmation")
    public async editAffirmation(@Body() request: { affirmation_id:string,affirmation: string,language:string }): Promise<ApiResponse> {

        const validate = validateEditAffirmation(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.editAffirmation);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

     @Security('Bearer')
    @Put("/deleteAffirmation")
    public async deleteAffirmation(@Body() request: { affirmation_id: string,status:number }): Promise<ApiResponse> {

        const validate = validateDeleteAffirmation(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }

        const wrappedFunc = tryCatchWrapper(handler.deleteAffirmation);
        return wrappedFunc(request); // Invoking the wrapped function 
    }
    @Security('Bearer')
    @Get('/affirmationDetail')
    public async affirmationDetail(@Query() affirmation_id?: string, @Query() language?: string): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.affirmationDetail);
        return wrappedFunc(affirmation_id,language); // Invoking the wrapped function 
    }

    
}





