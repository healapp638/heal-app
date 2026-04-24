import express, { Request, Response } from 'express'
import SubModuleController from './admin.submodules.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenAdmin } = middlewares.auth

const router = express.Router()

router.post('/create_submodule', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title,moduleId,description } = req.body
    const controller = new SubModuleController(req, res)
    const result: ApiResponse = await controller.createSubModule({ title,moduleId,description });
    return showOutput(res, result, result.code)
});

router.post('/update_submodule', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, subModuleId, lang,description } = req.body
    const controller = new SubModuleController(req, res)
    const result: ApiResponse = await controller.updateSubModule({ title, subModuleId, lang,description });
    return showOutput(res, result, result.code)
});

router.delete('/delete_submodule', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { subModuleId } = req.body
    const controller = new SubModuleController(req, res)
    const result: ApiResponse = await controller.deleteSubModule({ subModuleId });
    return showOutput(res, result, result.code)
});

router.get('/list_submodule', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang,moduleId } = req.query
    const controller = new SubModuleController(req, res)
    const result: ApiResponse = await controller.listSubModule(page, limit, search, lang,moduleId);
    return showOutput(res, result, result.code)
});

router.get('/submodule_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { subModuleId, lang } = req.query
    const controller = new SubModuleController(req, res)
    const result: ApiResponse = await controller.subModuleDetails(subModuleId, lang);
    return showOutput(res, result, result.code)
});

export default router