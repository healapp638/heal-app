// import express, { Request, Response } from 'express'
// import UserJournalController from './user.journal.controller'
// import { showOutput } from '../../utils/response.util'
// import { ApiResponse } from '../../utils/interfaces.util'

// const router = express.Router()

// router.post('/create_journal', async (req: Request | any, res: Response) => {
//     const { feeling, title, description } = req.body;
//     const controller = new UserJournalController(req, res)
//     const result: ApiResponse = await controller.createJournal({ feeling, title, description });
//     return showOutput(res, result, result.code)
// });

// router.get('/journal_list', async (req: Request | any, res: Response) => {
//     const { cursor, limit } = req.query;
//     const controller = new UserJournalController(req, res)
//     const result: ApiResponse = await controller.journalList(cursor, limit);
//     return showOutput(res, result, result.code)
// });

// router.put('/update_journal', async (req: Request | any, res: Response) => {
//     const { journal_id, feeling, title, description } = req.body;
//     const controller = new UserJournalController(req, res)
//     const result: ApiResponse = await controller.updateJournal({ journal_id, feeling, title, description });
//     return showOutput(res, result, result.code)
// });

// router.delete('/delete_journal', async (req: Request | any, res: Response) => {
//     const { journal_id } = req.body;
//     const controller = new UserJournalController(req, res)
//     const result: ApiResponse = await controller.deleteJournal({ journal_id });
//     return showOutput(res, result, result.code)
// });




// export default router
