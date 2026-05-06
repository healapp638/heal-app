import express, { Request, Response } from 'express'
import PhaseController from './admin.phases.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenAdmin } = middlewares.auth

const router = express.Router()

router.post('/create_phase', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, points, subModuleId } = req.body
    const controller = new PhaseController(req, res)
    const result: ApiResponse = await controller.createPhase({ title, points, subModuleId });
    return showOutput(res, result, result.code)
});

router.post('/update_phase', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, points, lang, phaseId } = req.body
    const controller = new PhaseController(req, res)
    const result: ApiResponse = await controller.updatePhase({ title, points, lang, phaseId });
    return showOutput(res, result, result.code)
});

router.delete('/delete_phase', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { phaseId,status } = req.body
    const controller = new PhaseController(req, res)
    const result: ApiResponse = await controller.deletePhase({ phaseId,status });
    return showOutput(res, result, result.code)
});

router.get('/list_phase', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang, subModuleId } = req.query
    const controller = new PhaseController(req, res)
    const result: ApiResponse = await controller.listPhase(page, limit, search, lang, subModuleId);
    return showOutput(res, result, result.code)
});

router.get('/phase_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { phaseId, lang } = req.query
    const controller = new PhaseController(req, res)
    const result: ApiResponse = await controller.phaseDetails(phaseId, lang);
    return showOutput(res, result, result.code)
});

export default router