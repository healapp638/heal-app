import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Security, Body, Delete, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './admin.phases.handler'
import { showResponse } from '../../utils/response.util';
import { tryCatchWrapper } from '../../utils/config.util';
import statusCodes from '../../constants/statusCodes';
import { validateCreatePhase, validateDeletePhase, validateListPhase, validatePhaseDetails, validateUpdatePhase } from './admin.phases.validator';


@Tags('Admin Phases')
@Route('/admin/phases')
export default class AdminPhasesController extends Controller {
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
    @Post('/create_phase')
    public async createPhase(@Body() request: { title: string, points: number, subModuleId: string }): Promise<ApiResponse> {
        const validate = validateCreatePhase(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createPhase);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/update_phase')
    public async updatePhase(@Body() request: { title: string, points: number, lang: string, phaseId: string }): Promise<ApiResponse> {
        const validate = validateUpdatePhase(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updatePhase);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/delete_phase')
    public async deletePhase(@Body() request: { phaseId: string,status:string }): Promise<ApiResponse> {
        const validate = validateDeletePhase(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deletePhase);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/list_phase')
    public async listPhase(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string, @Query() subModuleId?: string): Promise<ApiResponse> {
        const validate = validateListPhase({ page, limit, search, lang, subModuleId });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.listPhase);
        return wrappedFunc(page, limit, search, lang, subModuleId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/phase_details')
    public async phaseDetails(@Query() phaseId?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validatePhaseDetails({ phaseId, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.phaseDetails);
        return wrappedFunc({ phaseId, lang }); // Invoking the wrapped function 
    }
}