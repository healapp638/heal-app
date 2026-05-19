import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Security, Body, Delete, Get, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from './admin.exercise.handler'
import { showResponse } from '../../utils/response.util';
import { tryCatchWrapper } from '../../utils/config.util';
import statusCodes from '../../constants/statusCodes';
import { validateCreateExerciseDetails, validateDeleteExerciseDetails, validateListExerciseDetails, validateExerciseDetails, validateUpdateExerciseDetails, validateCreateExercise, validateUpdateExercise, validateDeleteExercise, validateListExercise, validateSingleExercise, validateCreateMcqExercise, validateUpdateMcqExercise, validateDeleteMcqExercise, validateListMcqExercise, validateSingleMcqExercise } from './admin.exercise.validator';


@Tags('Admin Exercise')
@Route('/admin/exercise')
export default class AdminExerciseController extends Controller {
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
    @Post('/create_exercise_details')
    public async createExerciseDetails(@Body() request: { reading_title: string, reading_description: string, concept_title: string, concept_description: string, reflection: string, phase_id: string }): Promise<ApiResponse> {
        const validate = validateCreateExerciseDetails(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createExerciseDetails);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/update_exercise_details')
    public async updateExerciseDetails(@Body() request: { reading_title: string, reading_description: string, concept_title: string, concept_description: string, reflection: string, exercise_details_id: string, lang: string }): Promise<ApiResponse> {
        const validate = validateUpdateExerciseDetails(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateExerciseDetails);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/delete_exercise_details')
    public async deleteExerciseDetails(@Body() request: { exercise_details_id: string,status:string }): Promise<ApiResponse> {
        const validate = validateDeleteExerciseDetails(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteExerciseDetails);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/list_exercise_details')
    public async listExerciseDetails(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string, @Query() phase_id?: string): Promise<ApiResponse> {
        const validate = validateListExerciseDetails({ page, limit, search, lang, phase_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.listExerciseDetails);
        return wrappedFunc(page, limit, search, lang, phase_id); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/exercise_details')
    public async exerciseDetails(@Query() exercise_details_id?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validateExerciseDetails({ exercise_details_id, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.exerciseDetails);
        return wrappedFunc({ exercise_details_id, lang }); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/create_exercise')
    public async createExercise(@Body() request: { title: string, description: string, exercise_details_id: string}): Promise<ApiResponse> {
        const validate = validateCreateExercise(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createExercise);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/update_exercise')
    public async updateExercise(@Body() request: { title: string, description: string, exercise_id: string, lang: string }): Promise<ApiResponse> {
        const validate = validateUpdateExercise(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateExercise);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/delete_exercise')
    public async deleteExercise(@Body() request: { exercise_id: string,status:string }): Promise<ApiResponse> {
        const validate = validateDeleteExercise(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteExercise);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/list_exercise')
    public async listExercise(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string, @Query() exercise_details_id?: string): Promise<ApiResponse> {
        const validate = validateListExercise({ page, limit, search, lang, exercise_details_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.listExercise);
        return wrappedFunc(page, limit, search, lang, exercise_details_id); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/single_exercise')
    public async singleExercise(@Query() exercise_id?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validateSingleExercise({ exercise_id, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.singleExercise);
        return wrappedFunc({ exercise_id, lang }); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/create_mcq_exercise')
    public async createMcqExercise(@Body() request: { title: string, description: string, mcq:string[], phase_id: string }): Promise<ApiResponse> {
        const validate = validateCreateMcqExercise(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createmcqExercise);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Post('/update_mcq_exercise')
    public async updateMcqExercise(@Body() request: { title: string, description: string, mcq:string[], mcqexercise_id: string, lang: string }): Promise<ApiResponse> {
        const validate = validateUpdateMcqExercise(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateMcqExercise);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete('/delete_mcq_exercise')
    public async deleteMcqExercise(@Body() request: { mcqexercise_id: string,status:string }): Promise<ApiResponse> {
        const validate = validateDeleteMcqExercise(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteMcqExercise);
        return wrappedFunc(request); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/list_mcq_exercise')
    public async listMcqExercise(@Query() page?: number, @Query() limit?: number, @Query() search?: string, @Query() lang?: string, @Query() phase_id?: string): Promise<ApiResponse> {
        const validate = validateListMcqExercise({ page, limit, search, lang, phase_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.listMcqExercise);
        return wrappedFunc(page, limit, search, lang, phase_id); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get('/single_mcq_exercise')
    public async singleMcqExercise(@Query() mcqexercise_id?: string, @Query() lang?: string): Promise<ApiResponse> {
        const validate = validateSingleMcqExercise({ mcqexercise_id, lang });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.singleMcqExercise);
        return wrappedFunc({ mcqexercise_id, lang }); // Invoking the wrapped function 
    }
}