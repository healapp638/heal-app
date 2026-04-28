import express, { Request, Response } from 'express'
import AdminCommonController from './admin.common.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenAdmin } = middlewares.auth
const { addToMulter } = middlewares.fileUpload.multer
const router = express.Router()


router.post('/question', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { question, answer } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.addQuestion({ question, answer });
    return showOutput(res, result, result.code)

})

router.put('/question', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { answer, question, question_id,language } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.updateQuestion({ answer, question, question_id,language });
    return showOutput(res, result, result.code)

})

router.delete('/question', addToMulter.none(), verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { question_id } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.deleteQuestion(question_id);
    return showOutput(res, result, result.code)

})

router.put('/common_content', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { type, content, language } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.updateCommonContent({ type, content, language });
    return showOutput(res, result, result.code)
});

router.put('/reset_common_content', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { type } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.resentCommonContent({ type});
    return showOutput(res, result, result.code)
});





export default router
