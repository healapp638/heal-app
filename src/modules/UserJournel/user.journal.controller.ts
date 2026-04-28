import { Request, Response } from 'express'
import { Route, Controller, Tags, Post, Body, Security, Get, Query, Put, Delete } from 'tsoa'
import { ApiResponse } from '../../utils/interfaces.util';
import handler from '../UserJournel/user.journal.handler'
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes'
import { tryCatchWrapper } from '../../utils/config.util';
import { validateAddJournal, validateDeleteJournal, validateJournalDetail, validateUpdateJournal } from './user.journel.validator';

@Tags('User Journal Routes')
@Route('/user/journal')

export default class UserJournalController extends Controller {
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
    @Post("create_journal")
    public async createJournal(@Body() request: { feeling: string, title: string, description: string }): Promise<ApiResponse> {
        const validate = validateAddJournal(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.createJournal);
        return wrappedFunc(request, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("journal_list")
    public async journalList(@Query() cursor?: string, @Query() limit?: string,@Query() search_key?: string): Promise<ApiResponse> {
        const wrappedFunc = tryCatchWrapper(handler.journalList);
        return wrappedFunc(cursor, limit,search_key, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Put("update_journal")
    public async updateJournal(@Body() request: { journal_id: string, feeling: string, title: string, description: string }): Promise<ApiResponse> {
        const validate = validateUpdateJournal(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.updateJournal);
        return wrappedFunc(request, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Delete("delete_journal")
    public async deleteJournal(@Body() request: { journal_id: string }): Promise<ApiResponse> {
        const validate = validateDeleteJournal(request);
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.deleteJournal);
        return wrappedFunc(request, this.userId); // Invoking the wrapped function 
    }

    @Security('Bearer')
    @Get("journal_detail")
    public async journalDetail(@Query() journal_id: string): Promise<ApiResponse> {
        const validate = validateJournalDetail({journal_id});
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.journalDetail);
        return wrappedFunc(journal_id, this.userId); // Invoking the wrapped function 
    }
}





