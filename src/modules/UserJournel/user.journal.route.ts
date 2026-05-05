import express, { Request, Response } from 'express'
import UserJournalController from './user.journal.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import { verifyTokenUser } from '../../middlewares/auth.middleware'

const router = express.Router()

router.post('/create_journal', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { feeling, title, description } = req.body;
    const controller = new UserJournalController(req, res)
    const result: ApiResponse = await controller.createJournal({ feeling, title, description });
    return showOutput(res, result, result.code)
});

router.get('/journal_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { page,limit,search_key} = req.query;
    const controller = new UserJournalController(req, res)
    const result: ApiResponse = await controller.journalList(page, limit, search_key);
    return showOutput(res, result, result.code)
});

router.put('/update_journal', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { journal_id, feeling, title, description } = req.body;
    const controller = new UserJournalController(req, res)
    const result: ApiResponse = await controller.updateJournal({ journal_id, feeling, title, description });
    return showOutput(res, result, result.code)
});

router.delete('/delete_journal', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { journal_id } = req.body;
    const controller = new UserJournalController(req, res)
    const result: ApiResponse = await controller.deleteJournal({ journal_id });
    return showOutput(res, result, result.code)
});

router.get('/journal_detail', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { journal_id } = req.query;
    const controller = new UserJournalController(req, res)
    const result: ApiResponse = await controller.journalDetail(journal_id);
    return showOutput(res, result, result.code)
});

router.get('/journal_list_by_date', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { date } = req.query;
    const controller = new UserJournalController(req, res)
    const result: ApiResponse = await controller.journalListByDate(date);
    return showOutput(res, result, result.code)
});

router.get('/journal_map_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserJournalController(req, res)
    const result: ApiResponse = await controller.journalMapList();
    return showOutput(res, result, result.code)
});




export default router
