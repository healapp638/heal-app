import express, { Request, Response } from 'express'
import UserHealyChatController from './user.aichat.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares';
const { verifyTokenUser } = middlewares.auth
const router = express.Router()

router.post('/sendMessage',verifyTokenUser, async (req: Request | any, res: Response) => {
    const { message, conversation_id, role } = req.body;
    const controller = new UserHealyChatController(req, res)
    const result: ApiResponse = await controller.sendMessage({ message, conversation_id, role });
    return showOutput(res, result, result.code)
})

router.get('/getRandomQuestions', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserHealyChatController(req, res)
    const result: ApiResponse = await controller.getRandomQuestions();
    return showOutput(res, result, result.code)
})

router.get('/getMessageList',verifyTokenUser, async (req: Request | any, res: Response) => {
    const { conversation_id, page, limit } = req.query;
    const controller = new UserHealyChatController(req, res)
    const result: ApiResponse = await controller.getMessageList(conversation_id, page, limit);
    return showOutput(res, result, result.code)
})

router.post('/aiSupportResponse',verifyTokenUser, async (req: Request | any, res: Response) => {
    const { message } = req.body;
    const controller = new UserHealyChatController(req, res)
    const result: ApiResponse = await controller.aiSupportResponse({ message });
    return showOutput(res, result, result.code)
})

router.get('/getConversationList',verifyTokenUser, async (req: Request | any, res: Response) => {
    const {page,limit,search,sort_column,sort_direction} = req.query;
    const controller = new UserHealyChatController(req, res)
    const result: ApiResponse = await controller.getConversationList(page,limit,search,sort_column,sort_direction);
    return showOutput(res, result, result.code)
})

export default router
