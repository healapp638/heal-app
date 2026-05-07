import express, { Request, Response } from 'express'
import ModuleController from './user.affirmation.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import { verifyTokenUser } from '../../middlewares/auth.middleware'

const router = express.Router()

// router.post('/create', verifyTokenUser, async (req: Request | any, res: Response) => {
//     const controller = new ModuleController(req, res)
//     const result: ApiResponse = await controller.createAffirmation();
//     return showOutput(res, result, result.code)
// });



// router.delete('/delete_theme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
//     const { themeId, status } = req.body
//     const controller = new ModuleController(req, res)
//     const result: ApiResponse = await controller.deleteTheme({ themeId, status });
//     return showOutput(res, result, result.code)
// });

router.get('/getAIAffirmation', verifyTokenUser, async (req: Request | any, res: Response) => {
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.getAIAffirmation();
    return showOutput(res, result, result.code)
});

router.post('/addView', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { affirmation_id } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.addView({ affirmation_id });
    return showOutput(res, result, result.code)
});
router.get('/getAffirmationListing', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { sort_column, sort_direction, page, limit } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.getAffirmationListing(sort_column, sort_direction, page, limit);
    return showOutput(res, result, result.code)
})
router.post('/likeUnlikeAffirmation', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { affirmation_id } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.likeUnlikeAffirmation({ affirmation_id });
    return showOutput(res, result, result.code)
});

router.get('/likedAffirmationList', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { sort_column, sort_direction, page, limit } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.likedAffirmationList(sort_column, sort_direction, page, limit);
    return showOutput(res, result, result.code)
})

export default router