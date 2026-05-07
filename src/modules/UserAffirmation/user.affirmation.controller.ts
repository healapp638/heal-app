import { Request, Response } from 'express'
import { Route, Controller, Tags, Security, Get, Post, Body} from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import { tryCatchWrapper } from '../../utils/config.util';
import handler from './user.affirmation.handler'
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';
import { validateAffirmation } from '../AdminCommon/admin.common.validator';
// import { validateCreateTheme, validateDeleteTheme, validateThemeDetails, validateUpdateTheme } from './admin.theme.validator';


@Tags('User Affirmation')
@Route('/user/affirmation')
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

    // @Security('Bearer')
    // @Post('/create')
    // public async createAffirmation(): Promise<ApiResponse> {
    //     const wrappedFunc = tryCatchWrapper(handler.createAffirmation);
    //     return wrappedFunc(); // Invoking the wrapped function 
    // }

    // @Security('Bearer')
    // @Post('/update_theme')
    // public async updateTheme(@Body() request: { title: string, description: string, imgUrl: string, lang: string, themeId: string }): Promise<ApiResponse> {
    //     const validate = validateUpdateTheme(request);
    //     if (validate.error) {
    //         return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    //     }
    //     const wrappedFunc = tryCatchWrapper(handler.updateTheme);
    //     return wrappedFunc(request); // Invoking the wrapped function 
    // }

    // @Security('Bearer')
    // @Delete('/delete_theme')
    // public async deleteTheme(@Body() request: { themeId: string, status: string }): Promise<ApiResponse> {
    //     const validate = validateDeleteTheme(request);
    //     if (validate.error) {
    //         return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    //     }
    //     const wrappedFunc = tryCatchWrapper(handler.deleteTheme);
    //     return wrappedFunc(request); // Invoking the wrapped function 
    // }

    @Security('Bearer')
    @Get('/getAIAffirmation')
    public async getAIAffirmation(): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.getAIAffirmation);
        return wrappedFunc(this.userId); // Invoking the wrapped function 
    }


    @Security('Bearer')
    @Post('/addView')
    public async addView(@Body() request: { affirmation_id: string }): Promise<ApiResponse> {
        const validate = validateAffirmation(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.addView);
        return wrappedFunc(request,this.userId); // Invoking the wrapped function 
    }

    // @Security('Bearer')
    // @Get('/theme_details')
    // public async themeDetails(@Query() themeId?: string, @Query() lang?: string): Promise<ApiResponse> {
    //     const validate = validateThemeDetails({ themeId, lang });
    //     if (validate.error) {
    //         return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    //     }
    //     const wrappedFunc = tryCatchWrapper(handler.themeDetails);
    //     return wrappedFunc({ themeId, lang }); // Invoking the wrapped function 
    // }
}