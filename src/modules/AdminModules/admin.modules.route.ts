import express, { Request, Response } from 'express'
import ModuleController from './admin.modules.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenAdmin } = middlewares.auth

const router = express.Router()

router.post('/create_module', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title,themeId } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.createModule({ title,themeId });
    return showOutput(res, result, result.code)
});

router.post('/update_module', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, moduleId, lang } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.updateModule({ title, moduleId, lang });
    return showOutput(res, result, result.code)
});

router.delete('/delete_module', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { moduleId,status } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.deleteModule({ moduleId,status });
    return showOutput(res, result, result.code)
});

router.get('/list_module', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang,themeId } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.listModule(page, limit, search, lang,themeId);
    return showOutput(res, result, result.code)
});

router.get('/module_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { moduleId, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.moduleDetails(moduleId, lang);
    return showOutput(res, result, result.code)
});

export default router