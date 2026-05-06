import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Security } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from '../UserChallenges/user.challenges.handler'
import { tryCatchWrapper } from '../../utils/config.util';

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
     * Add Challenges
     */
    @Security('Bearer')
    @Post("/add")
    public async add(): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.add);
        return wrappedFunc(this.userId); // Invoking the wrapped function 
    }
}





