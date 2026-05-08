import express, { Request, Response } from 'express'
import UserHomeThemeController from './user.HomeTheme.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import { verifyTokenUser } from '../../middlewares/auth.middleware'

const router = express.Router()

router.post('/addUserTheme',verifyTokenUser, async (req: Request | any, res: Response) => {
    const { homeTheme_id } = req.body;
    const controller = new UserHomeThemeController(req, res)
    const result: ApiResponse = await controller.addUserTheme({ homeTheme_id});
    return showOutput(res, result, result.code)
})

router.get('/getHomeThemeCategory', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserHomeThemeController(req, res)
    const result: ApiResponse = await controller.getHomeThemeCategory();
    return showOutput(res, result, result.code)
});

router.get('/getHomeThemeListing', verifyTokenUser, async (req: Request | any, res: Response) => {
    const {  filter, categoryTheme_id, page, limit } = req.query
    const controller = new UserHomeThemeController(req, res)
    const result: ApiResponse = await controller.getHomeThemeListing( filter, categoryTheme_id,page, limit);
    return showOutput(res, result, result.code)
})

router.get('/getMyTheme', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserHomeThemeController(req, res)
    const result: ApiResponse = await controller.getMyTheme();
    return showOutput(res, result, result.code)
});

export default router
