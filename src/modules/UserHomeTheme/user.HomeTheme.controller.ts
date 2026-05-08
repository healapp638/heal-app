import { Request, Response } from 'express'
import { Route, Controller, Tags, Security, Post, Body, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import { tryCatchWrapper } from '../../utils/config.util';
import handler from './user.HomeTheme.handler'
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';

import { validateAddUserTheme } from './user.HomeTheme.validator';
// import { validateCreateTheme, validateDeleteTheme, validateThemeDetails, validateUpdateTheme } from './admin.theme.validator';


@Tags('User Home Theme')
@Route('/user/homeTheme')
export default class AdminAffirmationController extends Controller {
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
    @Post('/addUserTheme')
    public async addUserTheme(@Body() request: { homeTheme_id: string }): Promise<ApiResponse> {
        const validate = validateAddUserTheme(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.addUserTheme);
        return wrappedFunc(this.userId,request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/getHomeThemeCategory')
    public async getHomeThemeCategory(): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.getHomeThemeCategory);
        return wrappedFunc(this.userId); // Invoking the wrapped function 
    }

    /**
   * all | new | most_popular | recent ---> filters
   */
    @Security('Bearer')
    @Get("/getHomeThemeListing")
    public async getHomeThemeListing(@Query() filter?: string, @Query() categoryTheme_id?: string, @Query() page?: number, @Query() limit?: number): Promise<ApiResponse> {
        const request = { filter, categoryTheme_id, page, limit }
        const wrappedFunc = tryCatchWrapper(handler.getHomeThemeListing);
        return wrappedFunc(request,this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/getMyTheme')
    public async getMyTheme(): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.getMyTheme);
        return wrappedFunc(this.userId); // Invoking the wrapped function 
    }


}