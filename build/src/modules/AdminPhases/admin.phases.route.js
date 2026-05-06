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
const admin_phases_controller_1 = __importDefault(require("./admin.phases.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.post('/create_phase', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, points, subModuleId } = req.body;
    const controller = new admin_phases_controller_1.default(req, res);
    const result = yield controller.createPhase({ title, points, subModuleId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/update_phase', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, points, lang, phaseId } = req.body;
    const controller = new admin_phases_controller_1.default(req, res);
    const result = yield controller.updatePhase({ title, points, lang, phaseId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete_phase', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phaseId, status } = req.body;
    const controller = new admin_phases_controller_1.default(req, res);
    const result = yield controller.deletePhase({ phaseId, status });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/list_phase', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang, subModuleId } = req.query;
    const controller = new admin_phases_controller_1.default(req, res);
    const result = yield controller.listPhase(page, limit, search, lang, subModuleId);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/phase_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phaseId, lang } = req.query;
    const controller = new admin_phases_controller_1.default(req, res);
    const result = yield controller.phaseDetails(phaseId, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
