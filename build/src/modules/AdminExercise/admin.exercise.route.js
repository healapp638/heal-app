"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_exercise_controller_1 = __importDefault(require("./admin.exercise.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.post('/create_exercise_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reading_title, reading_description, concept_title, concept_description, reflection, phase_id } = req.body;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.createExerciseDetails({ reading_title, reading_description, concept_title, concept_description, reflection, phase_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/update_exercise_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reading_title, reading_description, concept_title, concept_description, reflection, exercise_details_id, lang } = req.body;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.updateExerciseDetails({ reading_title, reading_description, concept_title, concept_description, reflection, exercise_details_id, lang });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete_exercise_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { exercise_details_id } = req.body;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.deleteExerciseDetails({ exercise_details_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/list_exercise_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang, phase_id } = req.query;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.listExerciseDetails(page, limit, search, lang, phase_id);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/exercise_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { exercise_details_id, lang } = req.query;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.exerciseDetails(exercise_details_id, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
//exercise api
router.post('/create_exercise', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, exercise_details_id } = req.body;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.createExercise({ title, description, exercise_details_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/update_exercise', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, exercise_id, lang } = req.body;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.updateExercise({ title, description, exercise_id, lang });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete_exercise', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { exercise_id } = req.body;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.deleteExercise({ exercise_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/list_exercise', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang, exercise_details_id } = req.query;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.listExercise(page, limit, search, lang, exercise_details_id);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/single_exercise', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { exercise_id, lang } = req.query;
    const controller = new admin_exercise_controller_1.default(req, res);
    const result = yield controller.singleExercise(exercise_id, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
