import express, { Request, Response } from 'express'
import UserChallengesController from './user.challenges.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import { verifyTokenUser } from '../../middlewares/auth.middleware'

const router = express.Router()


router.get('/list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { challenge_type } = req.query
    const controller = new UserChallengesController(req, res)
    const result: ApiResponse = await controller.list(challenge_type);
    return showOutput(res, result, result.code)
});

router.get('/challenge_details', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { challenge_type, challenge_id } = req.query
    const controller = new UserChallengesController(req, res)
    const result: ApiResponse = await controller.challengeDetails(challenge_type, challenge_id);
    return showOutput(res, result, result.code)
});


router.post('/complete_challenges', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { challenge_type, challenge_id } = req.body;
    const controller = new UserChallengesController(req, res)
    const result: ApiResponse = await controller.completeChallenges({ challenge_type, challenge_id });
    return showOutput(res, result, result.code)
});

export default router
