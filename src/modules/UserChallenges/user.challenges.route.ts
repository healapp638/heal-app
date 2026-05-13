import express, { Request, Response } from 'express'
import UserChallengesController from './user.challenges.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import { verifyTokenUser } from '../../middlewares/auth.middleware'

const router = express.Router()


router.get('/list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new UserChallengesController(req, res)
    const result: ApiResponse = await controller.list();
    return showOutput(res, result, result.code)
})

export default router
