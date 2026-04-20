"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Route = express_1.default.Router();
//admin routes
const admin_auth_route_1 = __importDefault(require("../modules/AdminAuth/admin.auth.route"));
const admin_common_route_1 = __importDefault(require("../modules/AdminCommon/admin.common.route"));
const admin_user_route_1 = __importDefault(require("../modules/AdminUser/admin.user.route"));
const admin_contactus_route_1 = __importDefault(require("../modules/AdminContactus/admin.contactus.route"));
//user and admin all usertype common routes
const common_route_1 = __importDefault(require("../modules/Common/common.route"));
//user routes
const user_auth_route_1 = __importDefault(require("../modules/UserAuth/user.auth.route"));
const user_common_route_1 = __importDefault(require("../modules/UserCommon/user.common.route"));
// *********assign order of routes for swagger in last to show on first **********
//admin routes
Route.use('/admin/common', admin_common_route_1.default);
Route.use('/admin/user', admin_user_route_1.default);
Route.use('/admin/auth', admin_auth_route_1.default);
Route.use('/admin/contactus', admin_contactus_route_1.default);
//user routes
Route.use('/user/auth', user_auth_route_1.default);
Route.use('/user/common', user_common_route_1.default);
//user and admin all usertype common routes
Route.use('/common', common_route_1.default);
exports.default = Route;
