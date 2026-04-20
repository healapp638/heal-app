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
const admin_contactus_controller_1 = __importDefault(require("../../controllers/Admin/admin.contactus.controller"));
const response_util_1 = require("../../utils/response.util");
const middlewares_1 = __importDefault(require("../../middlewares"));
const { verifyTokenAdmin } = middlewares_1.default.auth;
const router = express_1.default.Router();
router.get('/list', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort_column, sort_direction, page, limit, search_key } = req.query;
    const adminController = new admin_contactus_controller_1.default(req, res);
    const result = yield adminController.listContactDetails(sort_column, sort_direction, page, limit, search_key);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.get('/details', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contact_id } = req.query;
    const adminController = new admin_contactus_controller_1.default(req, res);
    const result = yield adminController.getContactDetail(contact_id);
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.delete('/delete', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contact_id } = req.body;
    const adminController = new admin_contactus_controller_1.default(req, res);
    const result = yield adminController.deleteContactUs({ contact_id });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
router.post('/reply', verifyTokenAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contact_id, html } = req.body;
    const adminController = new admin_contactus_controller_1.default(req, res);
    const result = yield adminController.replyContactus({ contact_id, html });
    return (0, response_util_1.showOutput)(res, result, result.code);
}));
exports.default = router;
