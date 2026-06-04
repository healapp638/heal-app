import express, { Request, Response } from 'express'
import ModuleController from './admin.hometheme.controller'
import { showOutput } from '../../utils/response.util'
import { ApiResponse } from '../../utils/interfaces.util'
import middlewares from '../../middlewares'
const { verifyTokenAdmin } = middlewares.auth

const router = express.Router()

router.post('/createCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, imgUrl } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.createCategoryTheme({ title, imgUrl });
    return showOutput(res, result, result.code)
});

router.post('/updateCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, imgUrl, lang, themeCategoryId } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.updateCategoryTheme({ title, imgUrl, lang, themeCategoryId });
    return showOutput(res, result, result.code)
});

router.delete('/deleteCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeCategoryId, status } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.deleteCategoryTheme({ themeCategoryId, status });
    return showOutput(res, result, result.code)
});

router.get('/listCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.listCategoryTheme(page, limit, search, lang);
    return showOutput(res, result, result.code)
});

router.get('/themeCategoryDetails', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeCategoryId, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.themeCategoryDetails(themeCategoryId, lang);
    return showOutput(res, result, result.code)
});

router.post('/createCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, imgUrl } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.createCategoryTheme({ title, imgUrl });
    return showOutput(res, result, result.code)
});

router.post('/updateCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, imgUrl, lang, themeCategoryId } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.updateCategoryTheme({ title, imgUrl, lang, themeCategoryId });
    return showOutput(res, result, result.code)
});

router.delete('/deleteCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeCategoryId, status } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.deleteCategoryTheme({ themeCategoryId, status });
    return showOutput(res, result, result.code)
});

router.get('/listCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.listCategoryTheme(page, limit, search, lang);
    return showOutput(res, result, result.code)
});

router.get('/themeCategoryDetails', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeCategoryId, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.themeCategoryDetails(themeCategoryId, lang);
    return showOutput(res, result, result.code)
});

router.post('/createCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, imgUrl } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.createCategoryTheme({ title, imgUrl });
    return showOutput(res, result, result.code)
});

router.post('/updateCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { title, imgUrl, lang, themeCategoryId } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.updateCategoryTheme({ title, imgUrl, lang, themeCategoryId });
    return showOutput(res, result, result.code)
});

router.delete('/deleteCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeCategoryId, status } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.deleteCategoryTheme({ themeCategoryId, status });
    return showOutput(res, result, result.code)
});

router.get('/listCategoryTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { page, limit, search, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.listCategoryTheme(page, limit, search, lang);
    return showOutput(res, result, result.code)
});

router.get('/themeCategoryDetails', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { themeCategoryId, lang } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.themeCategoryDetails(themeCategoryId, lang);
    return showOutput(res, result, result.code)
});

router.post('/createHomeTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const {categoryTheme_id, imgUrl,homeImgUrl } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.createHomeTheme({ categoryTheme_id,imgUrl,homeImgUrl });
    return showOutput(res, result, result.code)
});

router.post('/updateHomeTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { hometheme_id, imgUrl,homeImgUrl} = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.updateHomeTheme({ hometheme_id, imgUrl,homeImgUrl });
    return showOutput(res, result, result.code)
});

router.delete('/deleteHomeTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { hometheme_id, status } = req.body
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.deleteHomeTheme({ hometheme_id, status });
    return showOutput(res, result, result.code)
});

router.get('/listHomeTheme', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { categoryTheme_id,page, limit } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.listHomeTheme(categoryTheme_id,page, limit);
    return showOutput(res, result, result.code)
});

router.get('/homeThemeDetails', verifyTokenAdmin, async (req: Request | any, res: Response) => {
    const { hometheme_id } = req.query
    const controller = new ModuleController(req, res)
    const result: ApiResponse = await controller.homeThemeDetails(hometheme_id);
    return showOutput(res, result, result.code)
});

export default router