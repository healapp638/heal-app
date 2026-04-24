import express, { Request, Response } from 'express'
import UserModulesController from './user.modules.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenUser } = middlewares.auth

const router = express.Router()

router.post('/theme_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { cursor, limit } = req.body;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.themeList({ cursor, limit });
    return showOutput(res, result, result.code)
})

export default router
