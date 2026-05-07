import express, { Request, Response } from 'express'
import AdminCommonController from './admin.common.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { multer } = middlewares.fileUpload
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
router.post('/readExcel', multer.addToMulter.single('file'), async (req: Request | any, res: Response) => {
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.excelRead(req.file as Express.Multer.File);
    return showOutput(res, result, result.code)
})
router.post('/readAffirmationExcel', multer.addToMulter.single('file'), async (req: Request | any, res: Response) => {
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.excelAffirmationRead(req.file as Express.Multer.File);
    return showOutput(res, result, result.code)
})
router.get('/listExcelImports', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search } = req.query
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.listModule(page, limit, search);
    return showOutput(res, result, result.code)
});
router.post('/addAffirmation', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { affirmation } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.affirmation({ affirmation});
    return showOutput(res, result, result.code)
});
router.get('/listAffirmation', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit,language } = req.query
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.listAffirmation(page, limit,language);
    return showOutput(res, result, result.code)
});
router.put('/editAffirmation', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { affirmation_id,affirmation,language } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.editAffirmation({ affirmation_id,affirmation,language});
    return showOutput(res, result, result.code)
});
router.put('/deleteAffirmation', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { affirmation_id,status } = req.body;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.deleteAffirmation({ affirmation_id,status});
    return showOutput(res, result, result.code)
});
router.get('/affirmationDetail', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { affirmation_id,language } = req.query;
    const controller = new AdminCommonController(req, res)
    const result: ApiResponse = await controller.affirmationDetail(affirmation_id,language);
    return showOutput(res, result, result.code)
});

export default router
