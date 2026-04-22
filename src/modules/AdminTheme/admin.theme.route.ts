import express, { Request, Response } from 'express'
import ModuleController from './admin.theme.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenAdmin } = middlewares.auth

const router = express.Router()

router.post('/create_theme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, description, imgUrl } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.createTheme({ title, description, imgUrl });
    return showOutput(res, result, result.code)
});

router.post('/update_theme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, description, imgUrl, lang, themeId } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.updateTheme({ title, description, imgUrl, lang, themeId });
    return showOutput(res, result, result.code)
});

router.delete('/delete_theme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeId } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.deleteTheme({ themeId });
    return showOutput(res, result, result.code)
});

router.get('/list_theme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.listTheme(page, limit, search, lang);
    return showOutput(res, result, result.code)
});

router.get('/theme_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeId, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.themeDetails(themeId, lang);
    return showOutput(res, result, result.code)
});

export default router