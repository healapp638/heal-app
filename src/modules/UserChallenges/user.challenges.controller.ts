import { Request, Response } from 'express'
import { Route, Controller, Tags, Security, Get, Post,  Body, Query } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from '../UserChallenges/user.challenges.handler'
import { tryCatchWrapper } from '../../utils/config.util';
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';
import { validateCompleteChallenge } from './user.challenge.validation';

@Tags('User Challenges Routes')
@Route('/user/challenges')

export default class UserChallengesController extends Controller {
    req: Request;
    res: Response;
    userId: string
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : ''
    }

    /**
     * List Challenges
     */
    @Security('Bearer')
    @Get("/list")
    public async list(@Query() challenge_type: string): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.list);
        return wrappedFunc(this.userId, challenge_type); // Invoking the wrapped function 
    }

    /**
     * Complete Challenges
     */
    @Security('Bearer')
    @Post("/complete_challenges")
    public async completeChallenges(@Body() request: { challenge_type: string, challenge_id: string }): Promise<ApiResponse> {
        const validate = validateCompleteChallenge(request)
        if (validate.error) {
            return showResponse(false, validate.error.message, {}, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.completeChallenges);
        return wrappedFunc(this.userId, request.challenge_type, request.challenge_id); // Invoking the wrapped function 
    }
}





