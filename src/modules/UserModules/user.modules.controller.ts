import { Request, Response } from 'express'
import { Route, Controller, Tags, Security, Query, Get, Post, Body } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from '../UserModules/user.modules.handler'
import { tryCatchWrapper } from '../../utils/config.util';
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';
import { validateAddMcqAnswer, validateCompleteLesson, validateExcerciseMcqAnswerList, validateExerciseDetailList, validateExerciseList, validateExerciseMcqList, validateModuleList, validatePhaseList, validateStartLesson, validateStartSubModuleList } from './user.modules.validator';

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
    @Get("/theme_list")
    public async themeList(@Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.themeList);
        return wrappedFunc({ cursor, limit }, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("/module_list")
    public async moduleList(@Query() theme_id: string, @Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validateModuleList({ theme_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.moduleList);
        return wrappedFunc({ theme_id, cursor, limit }, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("/phase_list")
    public async phaseList(@Query() sub_module_id: string, @Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validatePhaseList({ sub_module_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.phaseList);
        return wrappedFunc({ sub_module_id, cursor, limit }, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post("/add_mcq_answer")
    public async addMcqAnswer(@Body() request: { mcq_exercise_id: string, mcq_id: string, phase_id: string }): Promise<ApiResponse> {
        const validate = validateAddMcqAnswer(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.addMcqAnswer);
        return wrappedFunc(request, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("/exercise_mcq_list")
    public async excerciseMcqList(@Query() phase_id: string, @Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validateExerciseMcqList({ phase_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.excerciseMcqList);
        return wrappedFunc({ phase_id, cursor, limit }, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("/exercise_answer_list")
    public async excerciseMcqAnswerList(@Query() phase_id: string, @Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validateExcerciseMcqAnswerList({phase_id, cursor, limit});
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.excerciseMcqAnswerList);
        return wrappedFunc({phase_id, cursor, limit}, this.userId); // Invoking the wrapped function 
    }



    @Security('Bearer')
    @Get("/exercise_detail_list")
    public async exerciseDetailList(@Query() phase_id: string, @Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validateExerciseDetailList({ phase_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.exerciseDetailList);
        return wrappedFunc({ phase_id, cursor, limit }, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("/exercise_list")
    public async exerciseList(@Query() exercise_detail_id: string, @Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validateExerciseList({ exercise_detail_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.exerciseList);
        return wrappedFunc({ exercise_detail_id, cursor, limit }, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post("/complete_lesson")
    public async completeLesson(@Body() body: { exercise_id: string,  phase_id: string, reflection: string }): Promise<ApiResponse> {
        const validate = validateCompleteLesson(body);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.completeLesson);
        return wrappedFunc(body, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post("/start_lesson")
    public async startLesson(@Body() body: { phase_id: string }): Promise<ApiResponse> {
        const validate = validateStartLesson(body);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.startLesson);
        return wrappedFunc(body, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("/start_sub_module_list")
    public async startSubModuleList(@Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validateStartSubModuleList({ cursor, limit });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.startSubModuleList);
        return wrappedFunc({ cursor, limit }, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("/end_sub_module_list")
    public async endSubModuleList(@Query() cursor?: string, @Query() limit?: number): Promise<ApiResponse> {
        const validate = validateStartSubModuleList({ cursor, limit });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.API_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.endSubModuleList);
        return wrappedFunc({ cursor, limit }, this.userId); // Invoking the wrapped function 
    }

}





