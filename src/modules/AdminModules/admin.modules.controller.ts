import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Security, Body, Delete, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './admin.modules.handler'
import { showResponse } from '../../utils/response.util';
import { tryCatchWrapper } from '../../utils/config.util';
import statusCodes from '../../constants/statusCodes';
import { validateCreateModule, validateDeleteModule, validateListModule, validateModuleDetails, validateUpdateModule } from './admin.modules.validator';


@Tags('Admin Modules')
@Route('/admin/modules')
export default class AdminModulesController extends Controller {
    req: Request;
    res: Response;
    userId: string
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : ''
    }

    @Security('Bearer')
    @Post('/create_module')
    public async    createModule(@Body() request: { title: string,themeId:string }): Promise<ApiResponse> {
        const validate = validateCreateModule(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createModule);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/update_module')
    public async updateModule(@Body() request: { title: string, moduleId: string,lang:string }): Promise<ApiResponse> {
        const validate = validateUpdateModule(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateModule);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/delete_module')
    public async deleteModule(@Body() request: { moduleId: string }): Promise<ApiResponse> {
        const validate = validateDeleteModule(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteModule);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/list_module')
    public async listModule(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string, @Query() themeId?: string): Promise<ApiResponse> {
        const validate = validateListModule({ page, limit, search, lang,themeId });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.listModule);
        return wrappedFunc(page, limit, search, lang,themeId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/module_details')
    public async moduleDetails(@Query() moduleId?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validateModuleDetails({ moduleId, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.moduleDetails);
        return wrappedFunc({ moduleId, lang }); // Invoking the wrapped function 
    }
}