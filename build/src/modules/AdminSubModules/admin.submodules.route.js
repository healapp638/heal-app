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
const admin_submodules_controller_1 = __importDefault(require("./admin.submodules.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.post('/create_submodule', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, moduleId } = req.body;
    const controller = new admin_submodules_controller_1.default(req, res);
    const result = yield controller.createSubModule({ title, moduleId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/update_submodule', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subModuleId, lang } = req.body;
    const controller = new admin_submodules_controller_1.default(req, res);
    const result = yield controller.updateSubModule({ title, subModuleId, lang });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete_submodule', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subModuleId } = req.body;
    const controller = new admin_submodules_controller_1.default(req, res);
    const result = yield controller.deleteSubModule({ subModuleId });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/list_submodule', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, lang, moduleId } = req.query;
    const controller = new admin_submodules_controller_1.default(req, res);
    const result = yield controller.listSubModule(page, limit, search, lang, moduleId);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/submodule_details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subModuleId, lang } = req.query;
    const controller = new admin_submodules_controller_1.default(req, res);
    const result = yield controller.subModuleDetails(subModuleId, lang);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
