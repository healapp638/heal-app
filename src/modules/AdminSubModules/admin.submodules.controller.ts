import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Security, Body, Delete, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './admin.submodules.handler'
import { showResponse } from '../../utils/response.util';
import { tryCatchWrapper } from '../../utils/config.util';
import statusCodes from '../../constants/statusCodes';
import { validateCreateSubModule, validateDeleteSubModule, validateListSubModule, validateSubModuleDetails, validateUpdateSubModule } from './admin.submodules.validator';


@Tags('Admin Sub Modules')
@Route('/admin/submodules')
export default class AdminSubModulesController extends Controller {
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
    @Post('/create_submodule')
    public async createSubModule(@Body() request: { title: string, moduleId: string, description: string }): Promise<ApiResponse> {
        const validate = validateCreateSubModule(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createSubModule);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/update_submodule')
    public async updateSubModule(@Body() request: { title: string, subModuleId: string, lang: string,description:string }): Promise<ApiResponse> {
        const validate = validateUpdateSubModule(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateSubModule);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/delete_submodule')
    public async deleteSubModule(@Body() request: { subModuleId: string }): Promise<ApiResponse> {
        const validate = validateDeleteSubModule(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteSubModule);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/list_submodule')
    public async listSubModule(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string, @Query() moduleId?: string): Promise<ApiResponse> {
        const validate = validateListSubModule({ page, limit, search, lang, moduleId });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.listSubModule);
        return wrappedFunc(page, limit, search, lang, moduleId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/submodule_details')
    public async subModuleDetails(@Query() subModuleId?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validateSubModuleDetails({ subModuleId, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.subModuleDetails);
        return wrappedFunc({ subModuleId, lang }); // Invoking the wrapped function 
    }
}