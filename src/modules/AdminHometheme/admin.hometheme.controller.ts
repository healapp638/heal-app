import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Security, Body, Delete, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './admin.hometheme.handler'
import { showResponse } from '../../utils/response.util';
import { tryCatchWrapper } from '../../utils/config.util';
import statusCodes from '../../constants/statusCodes';
import { validateCreateHomeTheme, validateCreateTheme, validateDeleteHomeTheme, validateDeleteTheme, validateHomeThemeDetails, validateThemeDetails, validateUpdateHometheme, validateUpdateTheme } from './admin.hometheme.validator';


@Tags('Admin Home Theme')
@Route('/admin/homeTheme')
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
    @Post('/createCategoryTheme')
    public async createCategoryTheme(@Body() request: { title: string, imgUrl: string }): Promise<ApiResponse> {
        const validate = validateCreateTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createCategoryTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/updateCategoryTheme')
    public async updateCategoryTheme(@Body() request: { title: string, imgUrl: string, lang: string, themeCategoryId: string }): Promise<ApiResponse> {
        const validate = validateUpdateTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateCategoryTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/deleteCategoryTheme')
    public async deleteCategoryTheme(@Body() request: { themeCategoryId: string, status: string }): Promise<ApiResponse> {
        const validate = validateDeleteTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteCategoryTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/listCategoryTheme')
    public async listCategoryTheme(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.listCategoryTheme);
        return wrappedFunc(page, limit, search, lang); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/themeCategoryDetails')
    public async themeCategoryDetails(@Query() themeCategoryId?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validateThemeDetails({ themeCategoryId, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.themeCategoryDetails);
        return wrappedFunc({ themeCategoryId, lang }); // Invoking the wrapped function 
    }

        @Security('Bearer')
    @Post('/createHomeTheme')
    public async createHomeTheme(@Body() request: { categoryTheme_id:string,imgUrl: string,homeImgUrl:string }): Promise<ApiResponse> {
        const validate = validateCreateHomeTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createHomeTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/updateHomeTheme')
    public async updateHomeTheme(@Body() request: { hometheme_id: string, imgUrl: string,homeImgUrl:string }): Promise<ApiResponse> {
        const validate = validateUpdateHometheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateHomeTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/deleteHomeTheme')
    public async deleteHomeTheme(@Body() request: { hometheme_id: string, status: string }): Promise<ApiResponse> {
        const validate = validateDeleteHomeTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteHomeTheme);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/listHomeTheme')
    public async listHomeTheme(@Query() categoryTheme_id?:string, @Query() page?: number, @Query() limit?: number): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.listHomeTheme);
        return wrappedFunc(categoryTheme_id,page, limit); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/homeThemeDetails')
    public async homeThemeDetails(@Query() hometheme_id?: string): Promise<ApiResponse> {
        const validate = validateHomeThemeDetails({ hometheme_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.homeThemeDetails);
        return wrappedFunc({ hometheme_id, }); // Invoking the wrapped function 
    }
}