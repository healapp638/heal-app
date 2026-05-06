import express, { Request, Response } from 'express'
import ExerciseController from './admin.exercise.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenAdmin } = middlewares.auth

const router = express.Router()

router.post('/create_exercise_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { reading_title, reading_description, concept_title, concept_description, reflection, phase_id } = req.body
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.createExerciseDetails({ reading_title, reading_description, concept_title, concept_description, reflection, phase_id });
    return showOutput(res, result, result.code)
});

router.post('/update_exercise_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { reading_title, reading_description, concept_title, concept_description, reflection, exercise_details_id, lang } = req.body
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.updateExerciseDetails({ reading_title, reading_description, concept_title, concept_description, reflection, exercise_details_id, lang });
    return showOutput(res, result, result.code)
});

router.delete('/delete_exercise_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { exercise_details_id, status } = req.body
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.deleteExerciseDetails({ exercise_details_id, status });
    return showOutput(res, result, result.code)
});

router.get('/list_exercise_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang, phase_id } = req.query
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.listExerciseDetails(page, limit, search, lang, phase_id);
    return showOutput(res, result, result.code)
});

router.get('/exercise_details', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { exercise_details_id, lang } = req.query
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.exerciseDetails(exercise_details_id, lang);
    return showOutput(res, result, result.code)
});

//exercise api

router.post('/create_exercise', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, description, exercise_details_id } = req.body
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.createExercise({ title, description, exercise_details_id });
    return showOutput(res, result, result.code)
});

router.post('/update_exercise', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, description, exercise_id, lang } = req.body
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.updateExercise({ title, description, exercise_id, lang });
    return showOutput(res, result, result.code)
});

router.delete('/delete_exercise', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { exercise_id, status } = req.body
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.deleteExercise({ exercise_id, status });
    return showOutput(res, result, result.code)
});

router.get('/list_exercise', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang, exercise_details_id } = req.query
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.listExercise(page, limit, search, lang, exercise_details_id);
    return showOutput(res, result, result.code)
});

router.get('/single_exercise', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { exercise_id, lang } = req.query
    const controller = new ExerciseController(req, res)
    const result: ApiResponse = await controller.singleExercise(exercise_id, lang);
    return showOutput(res, result, result.code)
});


export default router