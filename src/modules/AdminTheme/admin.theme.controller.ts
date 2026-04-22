import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Security, Body, Delete, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './admin.theme.handler'
import { showResponse } from '../../utils/response.util';
import { tryCatchWrapper } from '../../utils/config.util';
import statusCodes from '../../constants/statusCodes';
import { validateCreateTheme, validateDeleteTheme, validateThemeDetails, validateUpdateTheme } from './admin.theme.validator';


@Tags('Admin Theme')
@Route('/admin/theme')
export default class AdminThemeController extends Controller {
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
    @Post('/create_theme')
    public async createTheme(@Body() request: { title: string, description: string, imgUrl: string }): Promise<ApiResponse> {
        const validate = validateCreateTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/update_theme')
    public async updateTheme(@Body() request: { title: string, description: string, imgUrl: string, lang: string, themeId: string }): Promise<ApiResponse> {
        const validate = validateUpdateTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/delete_theme')
    public async deleteTheme(@Body() request: { themeId: string }): Promise<ApiResponse> {
        const validate = validateDeleteTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/list_theme')
    public async listTheme(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.listTheme);
        return wrappedFunc(page, limit, search, lang); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/theme_details')
    public async themeDetails(@Query() themeId?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validateThemeDetails({ themeId, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.themeDetails);
        return wrappedFunc({ themeId, lang }); // Invoking the wrapped function 
    }
}