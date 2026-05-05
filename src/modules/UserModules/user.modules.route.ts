import express, { Request, Response } from 'express'
import UserModulesController from './user.modules.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenUser } = middlewares.auth

const router = express.Router()

router.get('/theme_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { cursor, limit } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.themeList(cursor, limit);
    return showOutput(res, result, result.code)
});

router.get('/module_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { theme_id, cursor, limit } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.moduleList(theme_id, cursor, limit);
    return showOutput(res, result, result.code)
});

router.get('/phase_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { sub_module_id, cursor, limit } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.phaseList(sub_module_id, cursor, limit);
    return showOutput(res, result, result.code)
});

router.get('/exercise_detail_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { phase_id, cursor, limit } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.exerciseDetailList(phase_id, cursor, limit);
    return showOutput(res, result, result.code)
});

router.get('/exercise_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { exercise_detail_id, cursor, limit } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.exerciseList(exercise_detail_id, cursor, limit);
    return showOutput(res, result, result.code)
});

router.post('/complete_lesson', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { exercise_id, exercise_details_id, phase_id, reflection } = req.body;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.completeLesson({ exercise_id, exercise_details_id, phase_id, reflection });
    return showOutput(res, result, result.code)
});

router.post('/start_lesson', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { phase_id } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.startLesson(phase_id);
    return showOutput(res, result, result.code)
});

router.get('/start_sub_module_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { cursor, limit } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.startSubModuleList(cursor, limit);
    return showOutput(res, result, result.code)
});

router.get('/end_sub_module_list', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { cursor, limit } = req.query;
    const controller = new UserModulesController(req, res)
    const result: ApiResponse = await controller.endSubModuleList(cursor, limit);
    return showOutput(res, result, result.code)
});


export default router
