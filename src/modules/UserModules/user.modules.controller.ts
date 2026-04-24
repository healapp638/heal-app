import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Body, Security } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from '../UserModules/user.modules.handler'
import { tryCatchWrapper } from '../../utils/config.util';

@Tags('User Modules Routes')
@Route('/user/modules')

export default class UserModulesController extends Controller {
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
    @Post("/theme_list")
    public async themeList(@Body() request: { cursor: string, limit: number }): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.themeList);
        return wrappedFunc(request, this.userId); // Invoking the wrapped function 
    }
}





